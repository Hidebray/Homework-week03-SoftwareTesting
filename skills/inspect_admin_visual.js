const { chromium } = require('D:/Project/Software Testing/Project/gui-testing/node_modules/playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log("=== BẮT ĐẦU MỞ TRÌNH DUYỆT TRỰC QUAN (HEADED MODE) ===");
  
  // Mở trình duyệt Chromium thật ngay trên màn hình desktop của bạn với slowMo để bạn nhìn rõ từng thao tác
  const browser = await chromium.launch({
    headless: false,
    slowMo: 1200 // Dừng 1.2s mỗi thao tác để bạn kịp quan sát
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  // Tự động xử lý dialog (alert/confirm/prompt) nếu xuất hiện
  page.on('dialog', async (dialog) => {
    console.log(`[Browser Dialog] ${dialog.type()}: ${dialog.message()}`);
    await dialog.accept();
  });

  console.log("-> Đang truy cập http://localhost:5174...");
  await page.goto("http://localhost:5174");
  await page.waitForTimeout(2000);

  // Thư mục lưu ảnh bằng chứng
  const proofDir = "D:/Project/Software Testing/Homework/Week03/proof-image/checklist";
  if (!fs.existsSync(proofDir)) fs.mkdirSync(proofDir, { recursive: true });

  // Kiểm tra nếu đang ở trang Login
  const emailInput = await page.$('input[placeholder="Email"]');
  if (emailInput) {
    console.log("-> Đang hiển thị trang Login. Tiến hành đăng nhập tài khoản Admin...");
    await page.screenshot({ path: path.join(proofDir, "RAW_LOGIN_SCREEN.png") });
    await page.fill('input[placeholder="Email"]', "admin@eshop.com");
    await page.waitForTimeout(800);
    await page.fill('input[type="password"]', "Admin123!");
    await page.waitForTimeout(800);
    await page.click('button:has-text("Login")');
    await page.waitForTimeout(2500);
  }

  // Chờ Sidebar xuất hiện
  await page.waitForSelector('li:has-text("Dashboard")', { timeout: 10000 });

  // 1. Tab Dashboard
  console.log("-> Đang mở Tab 1: Dashboard...");
  await page.click('li:has-text("Dashboard")');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(proofDir, "RAW_TAB1_DASHBOARD.png") });

  // 2. Tab Sản phẩm & CSV
  console.log("-> Đang mở Tab 2: Quản lý Sản phẩm & CSV...");
  await page.click('li:has-text("Sản phẩm")');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(proofDir, "RAW_TAB2_PRODUCTS.png") });

  // 3. Tab Mã Giảm Giá
  console.log("-> Đang mở Tab 3: Quản lý Mã Giảm Giá...");
  await page.click('li:has-text("Mã Giảm Giá")');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(proofDir, "RAW_TAB3_COUPONS.png") });

  // 4. Tab Đơn hàng
  console.log("-> Đang mở Tab 4: Quản lý Đơn hàng...");
  await page.click('li:has-text("Đơn hàng")');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(proofDir, "RAW_TAB4_ORDERS.png") });

  console.log("=== HOÀN TẤT KIỂM TRA TRỰC QUAN ===");
  console.log("-> Giữ trình duyệt mở thêm 15 giây để bạn quan sát trực tiếp trên màn hình...");
  await page.waitForTimeout(15000);

  await browser.close();
  console.log("-> Đã hoàn thành và đóng trình duyệt.");
})();
