const { chromium, firefox, webkit, devices } = require('D:/Project/Software Testing/Project/gui-testing/node_modules/playwright');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = "D:/Project/Software Testing/Homework/Week03/cross-platform";
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const STUDENT_INFO = {
  name: "Trần Đại Hiệp",
  mssv: "23120256",
  email: "23120256@student.hcmus.edu.vn"
};

async function injectWatermark(page, platformLabel) {
  await page.evaluate(({ name, mssv, email, platform }) => {
    let badge = document.getElementById('cross-platform-watermark');
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'cross-platform-watermark';
      badge.style.position = 'fixed';
      badge.style.bottom = '14px';
      badge.style.right = '14px';
      badge.style.backgroundColor = 'rgba(15, 23, 42, 0.92)';
      badge.style.color = '#ffffff';
      badge.style.padding = '8px 16px';
      badge.style.borderRadius = '8px';
      badge.style.fontFamily = 'Consolas, monospace';
      badge.style.fontSize = '12px';
      badge.style.fontWeight = 'bold';
      badge.style.zIndex = '9999999';
      badge.style.border = '2px solid #38bdf8';
      badge.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.4)';
      document.body.appendChild(badge);
    }
    badge.innerHTML = `🛡️ SUT Cross-Platform HW03 | ${name} - ${mssv} | ${email} | [${platform}]`;
  }, { ...STUDENT_INFO, platform: platformLabel });
}

async function runPlatform(browserType, platformName, launchOptions = {}, contextOptions = {}) {
  console.log(`\n=== BẮT ĐẦU CHỤP NỀN TẢNG: ${platformName} ===`);
  let browser;
  try {
    browser = await browserType.launch({ headless: true, ...launchOptions });
  } catch (err) {
    console.error(`Không thể khởi chạy ${platformName}:`, err.message);
    return false;
  }

  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();

  page.on('dialog', async d => {
    console.log(`[${platformName}] Dialog: ${d.message()}`);
    await d.accept();
  });

  try {
    console.log(`[${platformName}] Truy cập http://localhost:5174...`);
    await page.goto("http://localhost:5174", { timeout: 15000 });
    await page.waitForTimeout(1500);

    // Login nếu cần
    const emailInput = await page.$('input[placeholder="Email"]');
    if (emailInput) {
      console.log(`[${platformName}] Đăng nhập Admin...`);
      await page.fill('input[placeholder="Email"]', "admin@eshop.com");
      await page.fill('input[type="password"]', "Admin123!");
      await page.click('button:has-text("Login")');
      await page.waitForTimeout(2000);
    }

    // Chờ Sidebar
    await page.waitForSelector('li:has-text("Dashboard")', { timeout: 10000 });

    // 1. Dashboard
    console.log(`[${platformName}] Chụp Tab 1: Dashboard...`);
    await page.click('li:has-text("Dashboard")');
    await page.waitForTimeout(1500);
    await injectWatermark(page, `${platformName} - Dashboard`);
    await page.screenshot({ path: path.join(OUTPUT_DIR, `${platformName}_01_DASHBOARD.png`), fullPage: false });

    // 2. Sản phẩm & CSV
    console.log(`[${platformName}] Chụp Tab 2: Sản phẩm & CSV...`);
    await page.click('li:has-text("Sản phẩm")');
    await page.waitForTimeout(1500);
    await injectWatermark(page, `${platformName} - Products & CSV`);
    await page.screenshot({ path: path.join(OUTPUT_DIR, `${platformName}_02_PRODUCTS.png`), fullPage: false });

    // 3. Mã Giảm Giá
    console.log(`[${platformName}] Chụp Tab 3: Mã Giảm Giá...`);
    await page.click('li:has-text("Mã Giảm Giá")');
    await page.waitForTimeout(1500);
    await injectWatermark(page, `${platformName} - Coupons`);
    await page.screenshot({ path: path.join(OUTPUT_DIR, `${platformName}_03_COUPONS.png`), fullPage: false });

    // 4. Đơn hàng
    console.log(`[${platformName}] Chụp Tab 4: Đơn hàng...`);
    await page.click('li:has-text("Đơn hàng")');
    await page.waitForTimeout(1500);
    await injectWatermark(page, `${platformName} - Orders`);
    await page.screenshot({ path: path.join(OUTPUT_DIR, `${platformName}_04_ORDERS.png`), fullPage: false });

    console.log(`=== HOÀN TẤT NỀN TẢNG: ${platformName} ===`);
    return true;
  } catch (error) {
    console.error(`Lỗi khi chụp ${platformName}:`, error);
    return false;
  } finally {
    await browser.close();
  }
}

(async () => {
  console.log("==================================================");
  console.log("CHẠY BỔ SUNG NỀN TẢNG FIREFOX & SAFARI (HW03)");
  console.log("==================================================");

  // 1. Mozilla Firefox Desktop
  const ffPath = "C:/Users/daihi/AppData/Local/ms-playwright/firefox-1543/firefox/firefox.exe";
  await runPlatform(firefox, "FIREFOX_DESKTOP", {
    executablePath: ffPath
  }, {
    viewport: { width: 1280, height: 800 }
  });

  // 2. Apple Safari WebKit Desktop
  const wkPath = "C:/Users/daihi/AppData/Local/ms-playwright/webkit-2359/Playwright.exe";
  await runPlatform(webkit, "SAFARI_WEBKIT_DESKTOP", {
    executablePath: wkPath
  }, {
    viewport: { width: 1280, height: 800 }
  });

  console.log("\n-> TẤT CẢ ẢNH ĐÃ ĐƯỢC CHỤP VÀ LƯU VÀO:", OUTPUT_DIR);
})();
