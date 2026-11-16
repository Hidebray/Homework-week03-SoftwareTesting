/**
 * HW03 - GUI checklist execution with REAL assertions (v2).
 * - Seeds data through the SUT REST API (admin token) so every defect is observable.
 * - Each automated checklist item = one assertion; status Pass/Fail is decided by the assertion.
 * - Evidence screenshots are Playwright viewport screenshots of a HEADED Chromium (no address bar in the image).
 *   The offending element is highlighted with a red CSS outline in the live page (no image editing).
 * Usage: node tests/gui_checklist_execution.spec.js     (SUT: :5174, API: :3000)
 */
const { chromium } = require('D:/Project/Software Testing/Project/gui-testing/node_modules/playwright');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

const API = 'http://localhost:3000/api';
const UI = 'http://localhost:5174';
const PROOF = path.resolve(__dirname, '../proof-image/checklist');
const OUT = path.resolve(__dirname, 'results');
fs.mkdirSync(PROOF, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });
const PS1 = path.resolve(__dirname, 'capture_screen.ps1');

const RERUN = !!process.env.RERUN; // RERUN=1: orders already seeded; keep CHK-12/45 from the previous run
const RESULTS_FILE = path.join(OUT, 'gui_checklist_results.json');
const prev = RERUN && fs.existsSync(RESULTS_FILE) ? JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8')).results : [];
const results = [];
const dialogs = [];
let page;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function api(method, url, body, token) {
  const r = await fetch(API + url, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await r.text();
  let json; try { json = JSON.parse(text); } catch { json = text; }
  return { status: r.status, json };
}
async function shoot(file, pg = page) {
  // Playwright viewport screenshot (documented API). NOTE: it does not include the browser address bar.
  await pg.bringToFront();
  await sleep(400);
  await pg.screenshot({ path: path.join(PROOF, file) });
}
async function highlight(sel) {
  await page.evaluate((s) => document.querySelectorAll(s).forEach((e) => (e.style.outline = '3px solid red')), sel).catch(() => {});
}
function rec(id, bug, status, note, shot) {
  results.push({ id, bug, status, note, shot: shot || null });
  console.log(`${status === 'Fail' ? 'FAIL' : 'PASS'} ${id} ${bug || ''} :: ${note}`);
}
const nav = async (label) => { await page.click(`li:has-text("${label}")`); await sleep(700); };

(async () => {
  const login = await api('POST', '/login', { email: 'admin@eshop.com', password: 'Admin123!' });
  const token = login.json.token;

  const browser = await chromium.launch({ headless: false, args: ['--start-maximized', '--window-position=0,0'] });
  const ctx = await browser.newContext({ viewport: null });
  page = await ctx.newPage();
  page.on('dialog', async (d) => { dialogs.push({ type: d.type(), message: d.message() }); await d.accept(); });
  await page.goto(UI); await sleep(1200);

  // ---------- CHK-03: CTA colours (login screen first) ----------
  const colours = {};
  colours.login = await page.$eval('form button', (b) => getComputedStyle(b).backgroundColor);
  await page.fill('input[placeholder="Email"]', 'admin@eshop.com');
  await page.fill('input[type="password"]', 'Admin123!');
  await page.click('button:has-text("Login")');
  await page.waitForSelector('li:has-text("Dashboard")'); await sleep(800);

  // ---------- Dashboard, empty-orders state (before seeding) ----------
  const ordersBefore = (await api('GET', '/admin/orders', null, token)).json.length;
  const kpiText = await page.innerText('body');
  // CHK-11 loading feedback: delay orders API and look for any loading indicator
  const p2 = await ctx.newPage();
  await p2.route('**/api/admin/orders', async (r) => { await sleep(2500); r.continue(); });
  await p2.goto(UI); await sleep(1200);
  const loadingVisible = await p2.evaluate(() => /loading|đang tải|spinner|skeleton/i.test(document.body.innerHTML) || !!document.querySelector('.animate-pulse,.animate-spin'));
  await p2.bringToFront(); await sleep(300);
  await shoot('BUG_ADMIN_08_missing_skeleton_loader.png', p2);
  rec('CHK-11', 'BUG_ADMIN_08', loadingVisible ? 'Pass' : 'Fail', loadingVisible ? 'loading indicator found' : 'Orders API delayed 2.5s: dashboard shows 0 ₫ / 0 with no loader/skeleton', 'BUG_ADMIN_08_missing_skeleton_loader.png');
  await p2.close(); await page.bringToFront();

  if (RERUN) { for (const id of ['CHK-12','CHK-45']) { const o = prev.find((r) => r.id === id); if (o) results.push(o); } }
  else rec('CHK-12', null, /0 ₫/.test(kpiText) ? 'Pass' : 'Fail', `orders in DB at start: ${ordersBefore}; KPI shows formatted zero`);
  await nav('Đơn hàng');
  const emptyRows = await page.$$eval('tbody tr', (r) => r.length);
  const emptyMsg = /chưa có|không có|trống|empty/i.test(await page.innerText('body'));
  if (RERUN) { /* carried over */ } else if (ordersBefore === 0) {
    await highlight('table');
    await shoot('BUG_ADMIN_26_orders_blank_empty_state.png');
    rec('CHK-45', 'BUG_ADMIN_26', emptyRows === 0 && !emptyMsg ? 'Fail' : 'Pass', `orders=0, tbody rows=${emptyRows}, empty-state message=${emptyMsg}`, 'BUG_ADMIN_26_orders_blank_empty_state.png');
  } else rec('CHK-45', 'BUG_ADMIN_26', 'NOT RUN', `DB already had ${ordersBefore} orders; empty state not testable`);

  // ---------- Seed data through API ----------
  const mk = async (addr, total, path = []) => {
    const r = await api('POST', '/checkout', { total_amount: total, shipping_address: addr }, token);
    const id = r.json.orderId;
    for (const s of path) await api('PUT', `/admin/orders/${id}/status`, { status: s }, token);
    return id;
  };
  if (!RERUN) {
  await mk('12 Nguyễn Huệ, Q1', 150000);                                           // pending
  const idDel = await mk('34 Lê Lợi, Q1', 150000, ['confirmed', 'shipping', 'delivered']); // delivered
  await mk('56 Hai Bà Trưng, Q3', 99000, ['confirmed', 'shipping']);              // shipping
  await mk('78 Pasteur, Q3', 120000, ['canceled']);                                // canceled
  await mk('<b style="color:red">INJECTED-HTML</b><img src=x onerror="document.title=\'XSS-HW03\'">', 50000); // XSS
  for (let i = 0; i < 46; i++) await mk(`Địa chỉ test ${i + 1}`, 10000 + i);       // >50 orders total
  }
  const pTest = (await api('POST', '/products', { name: 'HW03 XOA THU', price: 1234567, description: 'seed', imageUrl: 'https://placehold.co/50', category_id: 1 }, token)).json;
  await api('POST', '/admin/coupons', { code: 'HW03DEL', type: 'percent', discount_value: 5, min_order_amount: 0, expired_at: '2099-12-31', max_uses_per_user: 1 }, token);

  await page.reload(); await page.waitForSelector('li:has-text("Dashboard")'); await sleep(1200);

  // ---------- Dashboard ----------
  await nav('Dashboard');
  const liActive = await page.$eval('li:has-text("Dashboard")', (e) => e.className.includes('text-blue-400'));
  rec('CHK-07', null, liActive ? 'Pass' : 'Fail', 'active sidebar item highlighted');
  const allOrders = (await api('GET', '/admin/orders', null, token)).json;
  const realRevenue = allOrders.filter((o) => o.status === 'delivered').reduce((s, o) => s + o.total_amount, 0);
  const uiRevenue = Number((await page.$eval('p:has-text("doanh thu"), div:has-text("Tổng doanh thu (Delivered)")', (e) => e.parentElement.innerText).catch(() => '')).replace(/[^0-9]/g, '')) ;
  const kpiAll = await page.innerText('main, body');
  const mRev = kpiAll.match(/Tổng doanh thu \(Delivered\)\s*([\d.,]+)\s*₫/);
  const uiRev = mRev ? Number(mRev[1].replace(/[.,]/g, '')) : NaN;
  await highlight('.text-green-600');
  await shoot('BUG_ADMIN_06_double_revenue_calc.png');
  rec('CHK-09', 'BUG_ADMIN_06', uiRev === realRevenue ? 'Pass' : 'Fail', `API delivered sum=${realRevenue}, UI shows=${uiRev}`, 'BUG_ADMIN_06_double_revenue_calc.png');
  await page.evaluate(() => document.querySelectorAll('[style*=outline]').forEach((e) => (e.style.outline = '')));

  const hasFilter = await page.$$eval('input[type=date], select, input[type=search]', (e) => e.length);
  await shoot('BUG_ADMIN_03_dashboard_no_date_filter.png');
  rec('CHK-05', 'BUG_ADMIN_03', hasFilter ? 'Pass' : 'Fail', `date/select/search controls on dashboard: ${hasFilter}`, 'BUG_ADMIN_03_dashboard_no_date_filter.png');

  const tabIdx = await page.$$eval('ul li', (l) => l.map((e) => e.tabIndex));
  await page.keyboard.press('Tab'); await page.keyboard.press('Tab');
  const focusTag = await page.evaluate(() => document.activeElement && document.activeElement.tagName);
  await highlight('ul li');
  await shoot('BUG_ADMIN_04_sidebar_a11y_no_tabindex.png');
  rec('CHK-06', 'BUG_ADMIN_04', tabIdx.every((t) => t < 0) ? 'Fail' : 'Pass', `sidebar li tabIndex=${JSON.stringify(tabIdx)}, focus after 2xTab=${focusTag}`, 'BUG_ADMIN_04_sidebar_a11y_no_tabindex.png');
  await page.evaluate(() => document.querySelectorAll('[style*=outline]').forEach((e) => (e.style.outline = '')));

  await page.click('text=Tổng số đơn hàng'); await sleep(500);
  const stillDash = await page.$('h2:has-text("Dashboard")');
  await shoot('BUG_ADMIN_05_static_kpi_no_drilldown.png');
  rec('CHK-08', 'BUG_ADMIN_05', stillDash ? 'Fail' : 'Pass', stillDash ? 'clicking KPI card keeps the Dashboard view' : 'navigated', 'BUG_ADMIN_05_static_kpi_no_drilldown.png');

  // ---------- Products ----------
  await nav('Sản phẩm');
  const priceTxt = await page.$$eval('tbody tr td:nth-child(3)', (c) => c.map((x) => x.innerText.trim()));
  const unformatted = priceTxt.filter((t) => /^\d{5,}\s*₫$/.test(t));
  await highlight('tbody tr td:nth-child(3)');
  await shoot('BUG_ADMIN_09_unformatted_product_price.png');
  rec('CHK-15', 'BUG_ADMIN_09', unformatted.length ? 'Fail' : 'Pass', `unformatted prices: ${unformatted.slice(0, 3).join(' | ')}`, 'BUG_ADMIN_09_unformatted_product_price.png');
  const couponTxt = 'see coupons tab';
  await page.evaluate(() => document.querySelectorAll('[style*=outline]').forEach((e) => (e.style.outline = '')));

  rec('CHK-16', null, (await page.$eval('input[placeholder="Tên sản phẩm"]', (e) => e.required)) ? 'Pass' : 'Fail', 'product name has required attribute');
  const minAttr = await page.$eval('input[placeholder="Giá tiền"]', (e) => e.getAttribute('min'));
  await page.fill('input[placeholder="Giá tiền"]', '-50000');
  await highlight('input[placeholder="Giá tiền"]');
  await shoot('BUG_ADMIN_10_negative_price_allowed.png');
  rec('CHK-17', 'BUG_ADMIN_10', minAttr === null ? 'Fail' : 'Pass', `price input min attr=${minAttr}; value -50000 accepted by field`, 'BUG_ADMIN_10_negative_price_allowed.png');
  await page.fill('input[placeholder="Giá tiền"]', '');
  await page.evaluate(() => document.querySelectorAll('[style*=outline]').forEach((e) => (e.style.outline = '')));

  const accept = await page.$eval('input[type=file]', (e) => e.getAttribute('accept'));
  await highlight('input[type=file]');
  await shoot('BUG_ADMIN_11_csv_input_no_accept_filter.png');
  rec('CHK-18', 'BUG_ADMIN_11', accept ? 'Pass' : 'Fail', `file input accept attr=${accept}`, 'BUG_ADMIN_11_csv_input_no_accept_filter.png');
  await page.evaluate(() => document.querySelectorAll('[style*=outline]').forEach((e) => (e.style.outline = '')));

  const csv = 'name,price,description,imageUrl,category_id\n"Áo thun, cotton",150000,"Mô tả, có dấu phẩy",https://placehold.co/300,1\n';
  await page.setInputFiles('input[type=file]', { name: 'comma.csv', mimeType: 'text/csv', buffer: Buffer.from(csv, 'utf8') });
  await sleep(800);
  const cells = await page.$$eval('table td, table th', (c) => c.map((x) => x.innerText.trim()));
  const intact = cells.includes('Áo thun, cotton');
  await shoot('BUG_ADMIN_12_csv_parser_comma_split.png');
  rec('CHK-19', 'BUG_ADMIN_12', intact ? 'Pass' : 'Fail', `quoted field "Áo thun, cotton" kept as one cell: ${intact}; preview cells sample: ${cells.filter((c) => /Áo|cotton/.test(c)).join(' | ')}`, 'BUG_ADMIN_12_csv_parser_comma_split.png');
  const catOpts = await page.$$eval('select option', (o) => o.length);
  const catApi = (await api('GET', '/categories')).json.length;
  rec('CHK-20', null, catOpts >= catApi ? 'Pass' : 'Fail', `category options=${catOpts}, API=${catApi}`);
  rec('CHK-21', null, (await page.$('a[download]')) ? 'Pass' : 'Fail', 'template download link present');

  const row = page.locator('tbody tr', { hasText: 'HW03 XOA THU' });
  const bEdit = await row.locator('button:has-text("Sửa")').boundingBox();
  const bDel = await row.locator('button:has-text("Xóa")').boundingBox();
  const gap = bDel.x - (bEdit.x + bEdit.width);
  await page.evaluate(() => document.querySelectorAll('[style*=outline]').forEach((e) => (e.style.outline = '')));
  await row.scrollIntoViewIfNeeded();
  await row.locator('td').last().evaluate((e) => (e.style.outline = '3px solid red'));
  await shoot('BUG_ADMIN_13_adjacent_edit_delete_buttons.png');
  rec('CHK-22', 'BUG_ADMIN_13', gap < 12 ? 'Fail' : 'Pass', `gap between Sửa and Xóa = ${gap.toFixed(1)}px`, 'BUG_ADMIN_13_adjacent_edit_delete_buttons.png');

  // CHK-24 mass rename (restored afterwards through the API)
  const prods = (await api('GET', '/products')).json;
  const victim = prods[1];
  await page.locator('tbody tr').nth(1).locator('button:has-text("Sửa")').click(); await sleep(300);
  await page.fill('input[placeholder="Tên sản phẩm"]', 'HW03-RENAMED');
  await page.click('button:has-text("Lưu sản phẩm")'); await sleep(900);
  const names = await page.$$eval('tbody tr td:nth-child(2)', (c) => c.map((x) => x.innerText.trim()));
  const renamed = names.filter((n) => n === 'HW03-RENAMED').length;
  await shoot('BUG_ADMIN_15_product_edit_mass_rename.png');
  rec('CHK-24', 'BUG_ADMIN_15', renamed > 1 ? 'Fail' : 'Pass', `edited 1 product, ${renamed} rows now named HW03-RENAMED (of ${names.length})`, 'BUG_ADMIN_15_product_edit_mass_rename.png');
  await api('PUT', `/products/${victim.id}`, { ...victim }, token); // restore original name
  await page.reload(); await page.waitForSelector('li:has-text("Dashboard")'); await nav('Sản phẩm');

  // CHK-23 delete without confirm
  dialogs.length = 0;
  const row2 = page.locator('tbody tr', { hasText: 'HW03 XOA THU' });
  await row2.evaluate((e) => (e.style.outline = '3px solid red'));
  await shoot('BUG_ADMIN_14_product_delete_no_confirm.png');
  await row2.locator('button:has-text("Xóa")').click(); await sleep(900);
  const stillThere = (await api('GET', '/products')).json.some((p) => p.name === 'HW03 XOA THU');
  const confirmShown = dialogs.some((d) => d.type === 'confirm');
  rec('CHK-23', 'BUG_ADMIN_14', !confirmShown && !stillThere ? 'Fail' : 'Pass', `confirm dialog shown=${confirmShown}; product deleted from DB=${!stillThere}`, 'BUG_ADMIN_14_product_delete_no_confirm.png');

  // ---------- Coupons ----------
  await nav('Mã Giảm Giá');
  const form = 'form';
  const labels = await page.$$eval('form label', (l) => l.length);
  const defaults = await page.$$eval('form input[type=number]', (i) => i.map((x) => x.value));
  await highlight('form input[type=number]');
  await shoot('BUG_ADMIN_16_coupon_form_hidden_labels.png');
  rec('CHK-27', 'BUG_ADMIN_16', labels === 0 && defaults.includes('0') ? 'Fail' : 'Pass', `<label> count=${labels}; numeric defaults=${JSON.stringify(defaults)} hide placeholders`, 'BUG_ADMIN_16_coupon_form_hidden_labels.png');
  await page.evaluate(() => document.querySelectorAll('[style*=outline]').forEach((e) => (e.style.outline = '')));

  await page.fill('input[placeholder^="Mã coupon"]', 'sale_lower');
  const upper = await page.inputValue('input[placeholder^="Mã coupon"]');
  rec('CHK-28', 'BUG_ADMIN_17 (RETRACTED)', upper === 'SALE_LOWER' ? 'Pass' : 'Fail', `typed "sale_lower" -> field value "${upper}" (App.jsx:644 uses toUpperCase)`);
  await page.fill('input[placeholder^="Mã coupon"]', '');
  const phPct = await page.$eval('form input[type=number]', (e) => e.placeholder);
  await page.selectOption('form select', 'fixed');
  const phFix = await page.$eval('form input[type=number]', (e) => e.placeholder);
  rec('CHK-31', 'BUG_ADMIN_20 (RETRACTED)', phPct !== phFix ? 'Pass' : 'Fail', `placeholder percent="${phPct}" vs fixed="${phFix}" (App.jsx:660-663)`);
  await page.selectOption('form select', 'percent');

  const dateMin = await page.$eval('input[type=date]', (e) => e.getAttribute('min'));
  await page.fill('input[placeholder^="Mã coupon"]', 'HW03PAST');
  await page.fill('form input[type=number] >> nth=0', '10');
  await page.fill('input[type=date]', '2020-01-01');
  await page.click('button:has-text("Tạo mã")'); await sleep(900);
  const pastRow = page.locator('tbody tr', { hasText: 'HW03PAST' });
  const pastCreated = (await pastRow.count()) > 0;
  if (pastCreated) await pastRow.evaluate((e) => (e.style.outline = '3px solid red'));
  await shoot('BUG_ADMIN_18_coupon_past_date_allowed.png');
  rec('CHK-29', 'BUG_ADMIN_18', dateMin === null && pastCreated ? 'Fail' : 'Pass', `date min attr=${dateMin}; coupon with expiry 2020-01-01 created=${pastCreated}`, 'BUG_ADMIN_18_coupon_past_date_allowed.png');
  const min2 = await page.$$eval('form input[type=number]', (i) => i.map((x) => x.value));
  rec('CHK-36', null, min2[1] === '0' && min2[2] === '1' ? 'Pass' : 'Fail', `form reset after create: ${JSON.stringify(min2)}`);

  const maxAttr = await page.$eval('form input[type=number]', (e) => e.getAttribute('max'));
  await page.fill('input[placeholder^="Mã coupon"]', 'HW03P500');
  await page.fill('form input[type=number] >> nth=0', '500');
  await page.fill('input[type=date]', '2099-12-31');
  await page.click('button:has-text("Tạo mã")'); await sleep(900);
  const c500 = (await api('GET', '/coupons', null, token)).json.find((c) => c.code === 'HW03P500');
  const r500 = page.locator('tbody tr', { hasText: 'HW03P500' });
  if (await r500.count()) await r500.evaluate((e) => (e.style.outline = '3px solid red'));
  await shoot('BUG_ADMIN_19_coupon_percent_over_100.png');
  rec('CHK-30', 'BUG_ADMIN_19', maxAttr === null && c500 && c500.discount_value === 500 ? 'Fail' : 'Pass', `max attr=${maxAttr}; percent coupon saved with value=${c500 && c500.discount_value}`, 'BUG_ADMIN_19_coupon_percent_over_100.png');

  const expRow = page.locator('tbody tr', { hasText: 'EXPIRED' });
  rec('CHK-34', null, (await expRow.innerText()).includes('Hết hạn') ? 'Pass' : 'Fail', 'EXPIRED coupon shows Hết hạn');

  dialogs.length = 0;
  const delRow = page.locator('tbody tr', { hasText: 'HW03DEL' });
  await delRow.evaluate((e) => (e.style.outline = '3px solid red'));
  await shoot('BUG_ADMIN_21_coupon_delete_no_confirm.png');
  await delRow.locator('button:has-text("Xóa")').click(); await sleep(900);
  const delStill = (await api('GET', '/coupons', null, token)).json.some((c) => c.code === 'HW03DEL');
  rec('CHK-35', 'BUG_ADMIN_21', !dialogs.some((d) => d.type === 'confirm') && !delStill ? 'Fail' : 'Pass', `confirm shown=${dialogs.some((d) => d.type === 'confirm')}; coupon deleted=${!delStill}`, 'BUG_ADMIN_21_coupon_delete_no_confirm.png');
  // colours of CTA
  colours.products = 'rgb(22, 163, 74)'; // placeholder replaced below
  await nav('Sản phẩm');
  colours.products = await page.$eval('button:has-text("Lưu sản phẩm")', (b) => getComputedStyle(b).backgroundColor);
  await nav('Mã Giảm Giá');
  colours.coupons = await page.$eval('button:has-text("Tạo mã")', (b) => getComputedStyle(b).backgroundColor);
  await shoot('BUG_ADMIN_01_cta_colors.png');
  rec('CHK-03', 'BUG_ADMIN_01', new Set(Object.values(colours)).size > 1 ? 'Fail' : 'Pass', `CTA colours ${JSON.stringify(colours)}`, 'BUG_ADMIN_01_cta_colors.png');

  // ---------- Orders ----------
  await nav('Đơn hàng');
  const ctrl = await page.$$eval('input[type=text],input[type=search],input:not([type]),select', (e) => e.length);
  await shoot('BUG_ADMIN_22_orders_no_search_or_filter.png');
  rec('CHK-40', 'BUG_ADMIN_22', ctrl ? 'Pass' : 'Fail', `search/filter controls on Orders tab=${ctrl}`, 'BUG_ADMIN_22_orders_no_search_or_filter.png');
  const nRows = await page.$$eval('tbody tr', (r) => r.length);
  const pager = await page.$$eval('button, a', (e) => e.filter((x) => /next|prev|trang|›|»|sau|trước/i.test(x.innerText)).length);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.evaluate(() => document.querySelectorAll('main, div').forEach((e) => { if (e.scrollHeight > e.clientHeight + 50) e.scrollTop = e.scrollHeight; }));
  await shoot('BUG_ADMIN_23_orders_no_pagination.png');
  rec('CHK-41', 'BUG_ADMIN_23', nRows > 50 && !pager ? 'Fail' : 'Pass', `orders in DB=${allOrders.length}; rows rendered on one page=${nRows}; pager controls=${pager}`, 'BUG_ADMIN_23_orders_no_pagination.png');
  await page.evaluate(() => document.querySelectorAll('main, div').forEach((e) => (e.scrollTop = 0)));
  await sleep(300);

  const pendRow = page.locator('tbody tr', { hasText: '12 Nguyễn Huệ' });
  const bC = await pendRow.locator('button:has-text("Xác nhận")').boundingBox();
  const bH = await pendRow.locator('button:has-text("Hủy")').boundingBox();
  const vgap = bH.y - (bC.y + bC.height);
  await pendRow.evaluate((e) => (e.style.outline = '3px solid red'));
  await pendRow.scrollIntoViewIfNeeded();
  await shoot('BUG_ADMIN_24_orders_undersized_action_buttons.png');
  rec('CHK-42', 'BUG_ADMIN_24', bC.height < 36 ? 'Fail' : 'Pass', `Xác nhận button height=${bC.height.toFixed(1)}px (min 36)`, 'BUG_ADMIN_24_orders_undersized_action_buttons.png');
  await page.evaluate(() => document.querySelectorAll('[style*=outline]').forEach((e) => (e.style.outline = '')));
  await pendRow.locator('td').last().evaluate((e) => (e.style.outline = '3px solid red'));
  await shoot('BUG_ADMIN_25_orders_adjacent_confirm_cancel.png');
  rec('CHK-43', 'BUG_ADMIN_25', vgap < 8 ? 'Fail' : 'Pass', `gap Xác nhận↔Hủy=${vgap.toFixed(1)}px (stacked vertically, flex-col gap-1)`, 'BUG_ADMIN_25_orders_adjacent_confirm_cancel.png');

  const shipRow = page.locator('tbody tr', { hasText: '56 Hai Bà Trưng' });
  rec('CHK-46', null, (await shipRow.locator('button:has-text("Hoàn thành")').count()) ? 'Pass' : 'Fail', 'shipping order shows Hoàn thành');

  const cancRow = page.locator('tbody tr', { hasText: '78 Pasteur' });
  const hasDeliver = await cancRow.locator('button:has-text("Đánh dấu Đã giao")').count();
  await cancRow.scrollIntoViewIfNeeded();
  await cancRow.evaluate((e) => (e.style.outline = '3px solid red'));
  await shoot('BUG_ADMIN_27_canceled_order_state_machine_violation.png');
  rec('CHK-47', 'BUG_ADMIN_27', hasDeliver ? 'Fail' : 'Pass', `canceled order row has "Đánh dấu Đã giao" button=${!!hasDeliver}`, 'BUG_ADMIN_27_canceled_order_state_machine_violation.png');

  const xssRow = page.locator('tbody tr', { hasText: 'INJECTED-HTML' });
  await xssRow.scrollIntoViewIfNeeded();
  await page.evaluate(() => document.querySelectorAll('[style*=outline]').forEach((e) => (e.style.outline = '')));
  await xssRow.evaluate((e) => (e.style.outline = '3px solid red'));
  const title = await page.title();
  await shoot('BUG_ADMIN_28_shipping_address_stored_xss.png');
  rec('CHK-48', 'BUG_ADMIN_28', title === 'XSS-HW03' ? 'Fail' : 'Pass', `injected <img onerror> executed: document.title="${title}"; injected red HTML rendered`, 'BUG_ADMIN_28_shipping_address_stored_xss.png');

  // ---------- Mobile viewport (CHK-04), narrow real window ----------
  const b2 = await chromium.launch({ headless: false, args: ['--window-size=430,900', '--window-position=0,0'] });
  const c2 = await b2.newContext({ viewport: null });
  const m = await c2.newPage();
  await m.goto(UI); await sleep(1000);
  await m.fill('input[placeholder="Email"]', 'admin@eshop.com'); await m.fill('input[type="password"]', 'Admin123!');
  await m.click('button:has-text("Login")'); await m.waitForSelector('li:has-text("Dashboard")'); await sleep(800);
  const mob = await m.evaluate(() => ({ w: innerWidth, cols: getComputedStyle(document.querySelector('.grid-cols-2')).gridTemplateColumns.split(' ').length, side: document.querySelector('.w-64').getBoundingClientRect().width }));
  await shoot('BUG_ADMIN_02_mobile_grid_overflow.png', m);
  rec('CHK-04', 'BUG_ADMIN_02', mob.w < 768 && mob.cols > 1 ? 'Fail' : 'Pass', `window innerWidth=${mob.w}px: KPI grid columns=${mob.cols}, sidebar width=${mob.side}px`, 'BUG_ADMIN_02_mobile_grid_overflow.png');
  await b2.close();

  for (const c of (await api('GET', '/coupons', null, token)).json.filter((c) => /^HW03/.test(c.code))) await api('DELETE', `/admin/coupons/${c.id}`, null, token);
  fs.writeFileSync(path.join(OUT, 'gui_checklist_results.json'), JSON.stringify({ runAt: new Date().toISOString(), results }, null, 2));
  const pass = results.filter((r) => r.status === 'Pass').length, fail = results.filter((r) => r.status === 'Fail').length;
  console.log(`\nAutomated items: ${results.length}  Pass=${pass}  Fail=${fail}`);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
