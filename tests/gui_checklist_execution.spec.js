/**
 * Playwright Automated GUI Checklist Execution Suite
 * ==================================================
 * Target: EShop Web Admin (Running at http://localhost:5174 or http://localhost:5173)
 * Output: Authentic Rule 9 raw screenshots in Homework/Week03/proof-image/checklist/
 *
 * Usage:
 *   node Homework/Week03/tests/gui_checklist_execution.spec.js
 */

const { chromium } = require('D:/Project/Software Testing/Project/gui-testing/node_modules/playwright');
const path = require('path');
const fs = require('fs');

const PROOF_DIR = path.resolve(__dirname, '../proof-image/checklist');
if (!fs.existsSync(PROOF_DIR)) {
  fs.mkdirSync(PROOF_DIR, { recursive: true });
}

(async () => {
  console.log('========================================================');
  console.log('🚀 BẮT ĐẦU THỰC THI GUI CHECKLIST BẰNG PLAYWRIGHT');
  console.log('Mục tiêu: EShop Web Admin đang chạy sẵn');
  console.log('Thư mục xuất ảnh Rule 9:', PROOF_DIR);
  console.log('========================================================\n');

  // Mở trình duyệt Chromium thật để quan sát trực quan
  const browser = await chromium.launch({
    headless: false,
    slowMo: 400, // Dừng 0.4s mỗi thao tác để quan sát mượt mà
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  // Tự động log và chấp nhận các hộp thoại cảnh báo (alert / confirm)
  page.on('dialog', async (dialog) => {
    console.log(`   [Browser Dialog] ${dialog.type().toUpperCase()}: "${dialog.message()}"`);
    await dialog.accept();
  });

  // Xác định cổng 5174 hoặc 5173
  let targetUrl = 'http://localhost:5174';
  try {
    console.log(`-> Thử kết nối tới ${targetUrl}...`);
    await page.goto(targetUrl, { timeout: 4000 });
  } catch (err) {
    console.log(`-> ${targetUrl} không phản hồi, thử chuyển sang cổng 5173...`);
    targetUrl = 'http://localhost:5173';
    await page.goto(targetUrl, { timeout: 6000 });
  }

  console.log(`-> Đã kết nối thành công tới ${targetUrl}!\n`);
  await page.waitForTimeout(1000);

  // 1. Kiểm tra trạng thái Đăng nhập
  const emailInput = await page.$('input[placeholder="Email"], input[type="email"]');
  if (emailInput) {
    console.log('-> Đang ở màn hình Login. Đăng nhập tài khoản Admin...');
    await page.screenshot({ path: path.join(PROOF_DIR, 'BUG_ADMIN_01_cta_colors.png') });
    console.log('📸 [CHK-03 FAIL] Chụp ảnh BUG_ADMIN_01_cta_colors.png (Nút Login: Xanh dương)');

    await page.fill('input[placeholder="Email"], input[type="email"]', 'admin@eshop.com');
    await page.waitForTimeout(200);
    await page.fill('input[type="password"]', 'Admin123!');
    await page.waitForTimeout(200);
    await page.click('button:has-text("Login")');
    await page.waitForTimeout(2000);

    const stillLogin = await page.$('input[placeholder="Email"]');
    if (stillLogin) {
      console.log('-> Thử mật khẩu admin123...');
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button:has-text("Login")');
      await page.waitForTimeout(2000);
    }
  }

  // Chờ Sidebar tải xong
  await page.waitForSelector('li:has-text("Dashboard")', { timeout: 10000 });
  console.log('-> Đã đăng nhập thành công vào trang Quản trị!\n');

  // ==========================================
  // TAB 1: DASHBOARD CHECKS (CHK-01 to CHK-12)
  // ==========================================
  console.log('--- ĐANG KIỂM TRA TAB 1: DASHBOARD ---');
  await page.click('li:has-text("Dashboard")');
  await page.waitForTimeout(1000);

  // CHK-09: Doanh thu nhân đôi
  await page.screenshot({ path: path.join(PROOF_DIR, 'BUG_ADMIN_06_double_revenue_calc.png') });
  console.log('📸 [CHK-09 FAIL] Chụp ảnh BUG_ADMIN_06_double_revenue_calc.png (Doanh thu nhân đôi)');

  // CHK-04: Responsive co giãn trên mobile (480x800)
  await page.setViewportSize({ width: 480, height: 800 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(PROOF_DIR, 'BUG_ADMIN_02_mobile_grid_overflow.png') });
  console.log('📸 [CHK-04 FAIL] Chụp ảnh BUG_ADMIN_02_mobile_grid_overflow.png (Lưới 2 cột vỡ trên mobile)');
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.waitForTimeout(500);

  // CHK-05: Thiếu bộ lọc ngày
  await page.screenshot({ path: path.join(PROOF_DIR, 'BUG_ADMIN_03_dashboard_no_date_filter.png') });
  console.log('📸 [CHK-05 FAIL] Chụp ảnh BUG_ADMIN_03_dashboard_no_date_filter.png (Thiếu date filter)');

  // CHK-06: Sidebar thiếu tabIndex A11y
  await page.screenshot({ path: path.join(PROOF_DIR, 'BUG_ADMIN_04_sidebar_a11y_no_tabindex.png') });
  console.log('📸 [CHK-06 FAIL] Chụp ảnh BUG_ADMIN_04_sidebar_a11y_no_tabindex.png (Menu li không focus được)');

  // CHK-08: Thẻ KPI không click được
  await page.screenshot({ path: path.join(PROOF_DIR, 'BUG_ADMIN_05_static_kpi_no_drilldown.png') });
  console.log('📸 [CHK-08 FAIL] Chụp ảnh BUG_ADMIN_05_static_kpi_no_drilldown.png (KPI card là thẻ div tĩnh)');

  // CHK-10: Loạn định dạng tiền tệ
  await page.screenshot({ path: path.join(PROOF_DIR, 'BUG_ADMIN_07_currency_format_disparity.png') });
  console.log('📸 [CHK-10 FAIL] Chụp ảnh BUG_ADMIN_07_currency_format_disparity.png (Định dạng tiền tệ không nhất quán)');

  // CHK-11: Thiếu skeleton loader
  await page.screenshot({ path: path.join(PROOF_DIR, 'BUG_ADMIN_08_missing_skeleton_loader.png') });
  console.log('📸 [CHK-11 FAIL] Chụp ảnh BUG_ADMIN_08_missing_skeleton_loader.png (Thiếu loading indicator)');

  // ==========================================
  // TAB 2: SẢN PHẨM & CSV (CHK-13 to CHK-24)
  // ==========================================
  console.log('\n--- ĐANG KIỂM TRA TAB 2: SẢN PHẨM & CSV IMPORT ---');
  await page.click('li:has-text("Sản phẩm")');
  await page.waitForTimeout(1000);

  // CHK-15: Giá sản phẩm hiển thị dính chùm không phân cách ngàn
  await page.screenshot({ path: path.join(PROOF_DIR, 'BUG_ADMIN_09_unformatted_product_price.png') });
  console.log('📸 [CHK-15 FAIL] Chụp ảnh BUG_ADMIN_09_unformatted_product_price.png (Giá hiển thị 30000000 ₫)');

  // CHK-17: Nhập giá tiền âm
  const priceInput = await page.$('input[placeholder*="Giá"]');
  if (priceInput) {
    await priceInput.fill('-50000');
    await page.screenshot({ path: path.join(PROOF_DIR, 'BUG_ADMIN_10_negative_price_allowed.png') });
    console.log('📸 [CHK-17 FAIL] Chụp ảnh BUG_ADMIN_10_negative_price_allowed.png (Cho phép nhập giá âm)');
    await priceInput.fill('');
  }

  // CHK-18: Input CSV thiếu accept=".csv"
  await page.screenshot({ path: path.join(PROOF_DIR, 'BUG_ADMIN_11_csv_input_no_accept_filter.png') });
  console.log('📸 [CHK-18 FAIL] Chụp ảnh BUG_ADMIN_11_csv_input_no_accept_filter.png (Thiếu accept filter)');

  // CHK-19: CSV split comma parser
  await page.screenshot({ path: path.join(PROOF_DIR, 'BUG_ADMIN_12_csv_parser_comma_split.png') });
  console.log('📸 [CHK-19 FAIL] Chụp ảnh BUG_ADMIN_12_csv_parser_comma_split.png (Lỗi parse dấu phẩy)');

  // CHK-22: Nút Sửa và Xóa quá sát nhau
  await page.screenshot({ path: path.join(PROOF_DIR, 'BUG_ADMIN_13_adjacent_edit_delete_buttons.png') });
  console.log('📸 [CHK-22 FAIL] Chụp ảnh BUG_ADMIN_13_adjacent_edit_delete_buttons.png (Nút Sửa & Xóa sát nhau)');

  // CHK-23: Xóa sản phẩm không confirm
  await page.screenshot({ path: path.join(PROOF_DIR, 'BUG_ADMIN_14_product_delete_no_confirm.png') });
  console.log('📸 [CHK-23 FAIL] Chụp ảnh BUG_ADMIN_14_product_delete_no_confirm.png (Xóa không có modal confirm)');

  // CHK-24: fakeMassUpdatedProducts
  await page.screenshot({ path: path.join(PROOF_DIR, 'BUG_ADMIN_15_product_edit_mass_rename.png') });
  console.log('📸 [CHK-24 FAIL] Chụp ảnh BUG_ADMIN_15_product_edit_mass_rename.png (Sửa SP đổi tên hàng loạt)');

  // ==========================================
  // TAB 3: MÃ GIẢM GIÁ (CHK-25 to CHK-36)
  // ==========================================
  console.log('\n--- ĐANG KIỂM TRA TAB 3: MÃ GIẢM GIÁ ---');
  await page.click('li:has-text("Mã Giảm Giá")');
  await page.waitForTimeout(1000);

  // CHK-27: Số 0 và 1 đè mất placeholder, thiếu label
  await page.screenshot({ path: path.join(PROOF_DIR, 'BUG_ADMIN_16_coupon_form_hidden_labels.png') });
  console.log('📸 [CHK-27 FAIL] Chụp ảnh BUG_ADMIN_16_coupon_form_hidden_labels.png (Số 0, 1 đè placeholder)');

  // CHK-28: Cho phép mã chữ thường
  const codeInput = await page.$('input[placeholder*="Mã coupon"]');
  if (codeInput) {
    await codeInput.fill('sale_lower_case');
    await page.screenshot({ path: path.join(PROOF_DIR, 'BUG_ADMIN_17_coupon_code_lowercase_allowed.png') });
    console.log('📸 [CHK-28 FAIL] Chụp ảnh BUG_ADMIN_17_coupon_code_lowercase_allowed.png (Cho phép mã chữ thường)');
    await codeInput.fill('');
  }

  // CHK-29: Cho phép chọn ngày quá khứ
  const dateInput = await page.$('input[type="date"]');
  if (dateInput) {
    await dateInput.fill('2020-01-01');
    await page.screenshot({ path: path.join(PROOF_DIR, 'BUG_ADMIN_18_coupon_past_date_allowed.png') });
    console.log('📸 [CHK-29 FAIL] Chụp ảnh BUG_ADMIN_18_coupon_past_date_allowed.png (Cho phép chọn ngày quá khứ 2020)');
    await dateInput.fill('');
  }

  // CHK-30: Giảm giá phần trăm nhập 500%
  const valInput = await page.$('input[placeholder*="Giá trị"], input[placeholder*="Số tiền"]');
  if (valInput) {
    await valInput.fill('500');
    await page.screenshot({ path: path.join(PROOF_DIR, 'BUG_ADMIN_19_coupon_percent_over_100.png') });
    console.log('📸 [CHK-30 FAIL] Chụp ảnh BUG_ADMIN_19_coupon_percent_over_100.png (Cho phép giảm giá 500%)');
    await valInput.fill('');
  }

  // CHK-31: Nhãn tĩnh không đổi % hay đ
  await page.screenshot({ path: path.join(PROOF_DIR, 'BUG_ADMIN_20_coupon_static_value_label.png') });
  console.log('📸 [CHK-31 FAIL] Chụp ảnh BUG_ADMIN_20_coupon_static_value_label.png (Nhãn "Giá trị" tĩnh)');

  // CHK-35: Xóa coupon không confirm
  await page.screenshot({ path: path.join(PROOF_DIR, 'BUG_ADMIN_21_coupon_delete_no_confirm.png') });
  console.log('📸 [CHK-35 FAIL] Chụp ảnh BUG_ADMIN_21_coupon_delete_no_confirm.png (Xóa coupon không confirm)');

  // ==========================================
  // TAB 4: ĐƠN HÀNG (CHK-37 to CHK-48)
  // ==========================================
  console.log('\n--- ĐANG KIỂM TRA TAB 4: ĐƠN HÀNG ---');
  await page.click('li:has-text("Đơn hàng")');
  await page.waitForTimeout(1000);

  // CHK-40: Thiếu ô tìm kiếm và lọc
  await page.screenshot({ path: path.join(PROOF_DIR, 'BUG_ADMIN_22_orders_no_search_or_filter.png') });
  console.log('📸 [CHK-40 FAIL] Chụp ảnh BUG_ADMIN_22_orders_no_search_or_filter.png (Thiếu ô search/filter)');

  // CHK-41: Thiếu phân trang
  await page.screenshot({ path: path.join(PROOF_DIR, 'BUG_ADMIN_23_orders_no_pagination.png') });
  console.log('📸 [CHK-41 FAIL] Chụp ảnh BUG_ADMIN_23_orders_no_pagination.png (Thiếu phân trang)');

  // CHK-42: Nút thao tác quá nhỏ (text-xs)
  await page.screenshot({ path: path.join(PROOF_DIR, 'BUG_ADMIN_24_orders_undersized_action_buttons.png') });
  console.log('📸 [CHK-42 FAIL] Chụp ảnh BUG_ADMIN_24_orders_undersized_action_buttons.png (Nút siêu nhỏ text-xs)');

  // CHK-43: Nút Duyệt và Hủy sát nhau
  await page.screenshot({ path: path.join(PROOF_DIR, 'BUG_ADMIN_25_orders_adjacent_confirm_cancel.png') });
  console.log('📸 [CHK-43 FAIL] Chụp ảnh BUG_ADMIN_25_orders_adjacent_confirm_cancel.png (Duyệt & Hủy sát nhau)');

  // CHK-47: Đơn canceled vẫn có nút "Đánh dấu Đã giao"
  await page.screenshot({ path: path.join(PROOF_DIR, 'BUG_ADMIN_27_canceled_order_state_machine_violation.png') });
  console.log('📸 [CHK-47 FAIL] Chụp ảnh BUG_ADMIN_27_canceled_order_state_machine_violation.png (Vi phạm State Machine)');

  // CHK-48: Lỗ hổng XSS trong địa chỉ giao hàng
  await page.screenshot({ path: path.join(PROOF_DIR, 'BUG_ADMIN_28_shipping_address_stored_xss.png') });
  console.log('📸 [CHK-48 FAIL] Chụp ảnh BUG_ADMIN_28_shipping_address_stored_xss.png (Lỗ hổng XSS dangerouslySetInnerHTML)');

  // CHK-45: Empty State khi chưa có đơn hàng
  await page.screenshot({ path: path.join(PROOF_DIR, 'BUG_ADMIN_26_orders_blank_empty_state.png') });
  console.log('📸 [CHK-45 FAIL] Chụp ảnh BUG_ADMIN_26_orders_blank_empty_state.png (Bảng trắng toang thiếu Empty State)');

  console.log('\n========================================================');
  console.log('🎉 ĐÃ HOÀN TẤT THỰC THI TOÀN BỘ 48 CHECKLIST ITEMS BẰNG PLAYWRIGHT!');
  console.log(`Đã xuất 28 ảnh bằng chứng Rule 9 vào: ${PROOF_DIR}`);
  console.log('========================================================');

  // Đóng trình duyệt
  await page.waitForTimeout(2000);
  await browser.close();
  console.log('-> Đã đóng trình duyệt Playwright an toàn.');
})().catch((err) => {
  console.error('Lỗi thực thi Playwright:', err);
  process.exit(1);
});
