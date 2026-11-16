# BÁO CÁO LỖI GIAO DIỆN & TRẢI NGHIỆM NGƯỜI DÙNG (DEFECT REPORTS)
## Phân Hệ Web Admin (`frontend-admin`) — EShop SUT

> **Môn học:** Kiểm thử phần mềm (Software Testing) – FIT@HCMUS  
> **Bài tập:** HW03 – GUI & Usability Testing (Task 1 Deliverable)  
> **Sinh viên thực hiện:** Trần Đại Hiệp (MSSV: 23120256) – Email: `23120256@student.hcmus.edu.vn`  
> **Đối tượng kiểm thử (SUT):** [EShop Web Admin](https://github.com/ttbhanh/eshop-sut)  
> **Quy chuẩn bằng chứng (Rule 9):** Toàn bộ hình ảnh đính kèm là **ảnh chụp màn hình RAW nguyên bản 100%**, được xuất trực tiếp từ phiên kiểm thử Playwright (`tests/gui_checklist_execution.spec.js`), không chỉnh sửa ảnh; phần tử lỗi được tô viền đỏ bằng CSS trong trang thật. Ảnh là viewport screenshot nên **không có thanh địa chỉ**.  

---

## 1. Bảng Tổng Hợp 26 Lỗi Phát Hiện (Bug Summary Matrix)

> **Đính chính (sau khi chạy lại bằng test có assertion):** `BUG_ADMIN_17` (không tự viết hoa mã coupon) và `BUG_ADMIN_20` (nhãn giá trị không đổi theo loại coupon) đã được **rút lại** vì không đúng với source: `App.jsx:644` gọi `toUpperCase()` và `App.jsx:660-663` đổi placeholder theo loại coupon. `CHK-28` và `CHK-31` được chuyển sang **Pass**. Còn **26 bug**, **22 Pass / 26 Fail**.

| Bug ID | Tên Khiếm Khuyết (Defect Title) | Tab / Màn Hình | Khía Cạnh | Mức Độ (Severity) | Ảnh Bằng Chứng (Rule 9 Raw) |
|:---:|:---|:---:|:---:|:---:|:---|
| `BUG_ADMIN_01` | Phân mảnh màu sắc nút bấm chính (CTA): Login Xanh dương, Lưu SP Xanh lá, Tạo Coupon Cam | Dashboard / All | `IA-01` | **MINOR** | [`BUG_ADMIN_01_cta_colors.png`](../proof-image/checklist/BUG_ADMIN_01_cta_colors.png) |
| `BUG_ADMIN_02` | Lưới thẻ KPI cố định `grid-cols-2`, không co giãn thành 1 cột trên mobile làm tràn chữ | Dashboard | `IA-01` | **MINOR** | [`BUG_ADMIN_02_mobile_grid_overflow.png`](../proof-image/checklist/BUG_ADMIN_02_mobile_grid_overflow.png) |
| `BUG_ADMIN_03` | Thiếu hoàn toàn bộ lọc thời gian (Date Range) để thống kê doanh thu và đơn hàng | Dashboard | `IA-02` | **MINOR** | [`BUG_ADMIN_03_dashboard_no_date_filter.png`](../proof-image/checklist/BUG_ADMIN_03_dashboard_no_date_filter.png) |
| `BUG_ADMIN_04` | Menu Sidebar dùng thẻ `<li>` không có `tabIndex={0}`, liệt hoàn toàn điều hướng bằng phím Tab | Dashboard / Nav | `IA-03` | **MAJOR** | [`BUG_ADMIN_04_sidebar_a11y_no_tabindex.png`](../proof-image/checklist/BUG_ADMIN_04_sidebar_a11y_no_tabindex.png) |
| `BUG_ADMIN_05` | Thẻ KPI tổng số đơn hàng là div tĩnh, không có khả năng nhấp chuột để chuyển sang bảng Đơn | Dashboard | `IA-03` | **MINOR** | [`BUG_ADMIN_05_static_kpi_no_drilldown.png`](../proof-image/checklist/BUG_ADMIN_05_static_kpi_no_drilldown.png) |
| `BUG_ADMIN_06` | Công thức tính Tổng doanh thu nhân đôi phi lý số tiền các đơn `delivered` (`sum + o.total_amount * 2`) | Dashboard | `IA-04` | **CRITICAL** | [`BUG_ADMIN_06_double_revenue_calc.png`](../proof-image/checklist/BUG_ADMIN_06_double_revenue_calc.png) |
| `BUG_ADMIN_07` | Loạn định dạng tiền tệ giữa 3 tab (`0 ₫` vs `30000000 ₫` vs `300,000 ₫`) | Dashboard / All | `IA-04` | **MINOR** | [`BUG_ADMIN_07_currency_format_disparity.png`](../proof-image/checklist/BUG_ADMIN_07_currency_format_disparity.png) |
| `BUG_ADMIN_08` | Thiếu Skeleton loader hoặc loading spinner khi nạp dữ liệu đơn hàng ban đầu | Dashboard | `IA-04` | **MINOR** | [`BUG_ADMIN_08_missing_skeleton_loader.png`](../proof-image/checklist/BUG_ADMIN_08_missing_skeleton_loader.png) |
| `BUG_ADMIN_09` | Giá sản phẩm trên bảng hiển thị số nguyên dính chùm không có dấu phân cách hàng ngàn | Sản phẩm | `IA-01` | **MINOR** | [`BUG_ADMIN_09_unformatted_product_price.png`](../proof-image/checklist/BUG_ADMIN_09_unformatted_product_price.png) |
| `BUG_ADMIN_10` | Ô nhập Giá tiền sản phẩm không có ràng buộc `min="0"`, cho phép lưu giá bán âm | Sản phẩm | `IA-02` | **MAJOR** | [`BUG_ADMIN_10_negative_price_allowed.png`](../proof-image/checklist/BUG_ADMIN_10_negative_price_allowed.png) |
| `BUG_ADMIN_11` | Input upload file CSV thiếu thuộc tính `accept=".csv"`, cho phép chọn mọi loại file không hợp lệ | Sản phẩm | `IA-02` | **MINOR** | [`BUG_ADMIN_11_csv_input_no_accept_filter.png`](../proof-image/checklist/BUG_ADMIN_11_csv_input_no_accept_filter.png) |
| `BUG_ADMIN_12` | Hàm parse CSV dùng `split(',')` làm vỡ toàn bộ cấu trúc bảng khi mô tả chứa dấu phẩy | Sản phẩm | `IA-02` | **CRITICAL** | [`BUG_ADMIN_12_csv_parser_comma_split.png`](../proof-image/checklist/BUG_ADMIN_12_csv_parser_comma_split.png) |
| `BUG_ADMIN_13` | Nút Sửa và Xóa sản phẩm đặt sát nhau (`gap-2`), rất dễ gây click nhầm làm mất dữ liệu | Sản phẩm | `IA-03` | **MAJOR** | [`BUG_ADMIN_13_adjacent_edit_delete_buttons.png`](../proof-image/checklist/BUG_ADMIN_13_adjacent_edit_delete_buttons.png) |
| `BUG_ADMIN_14` | Nút Xóa sản phẩm xóa vĩnh viễn dữ liệu ngay lập tức mà không có bất kỳ hộp thoại Confirm | Sản phẩm | `IA-04` | **CRITICAL** | [`BUG_ADMIN_14_product_delete_no_confirm.png`](../proof-image/checklist/BUG_ADMIN_14_product_delete_no_confirm.png) |
| `BUG_ADMIN_15` | Sửa thông tin 1 sản phẩm làm toàn bộ sản phẩm trên bảng UI bị đồng loạt đổi tên (`fakeMass`) | Sản phẩm | `IA-04` | **CRITICAL** | [`BUG_ADMIN_15_product_edit_mass_rename.png`](../proof-image/checklist/BUG_ADMIN_15_product_edit_mass_rename.png) |
| `BUG_ADMIN_16` | State mặc định `{min: 0, max: 1}` đè mất placeholder, form trơ trọi 2 ô số không có nhãn `<label>` | Mã Giảm Giá | `IA-02` | **MAJOR** | [`BUG_ADMIN_16_coupon_form_hidden_labels.png`](../proof-image/checklist/BUG_ADMIN_16_coupon_form_hidden_labels.png) |
| `BUG_ADMIN_18` | Bộ chọn ngày hết hạn thiếu `min="today"`, cho phép tạo mã có ngày hết hạn trong quá khứ | Mã Giảm Giá | `IA-02` | **MAJOR** | [`BUG_ADMIN_18_coupon_past_date_allowed.png`](../proof-image/checklist/BUG_ADMIN_18_coupon_past_date_allowed.png) |
| `BUG_ADMIN_19` | Không khống chế giá trị tối đa `max="100"` khi chọn loại phần trăm, cho phép nhập 500% | Mã Giảm Giá | `IA-02` | **MAJOR** | [`BUG_ADMIN_19_coupon_percent_over_100.png`](../proof-image/checklist/BUG_ADMIN_19_coupon_percent_over_100.png) |
| `BUG_ADMIN_21` | Nút Xóa mã giảm giá gọi API xóa ngay lập tức mà không có bất kỳ hộp thoại xác nhận | Mã Giảm Giá | `IA-04` | **CRITICAL** | [`BUG_ADMIN_21_coupon_delete_no_confirm.png`](../proof-image/checklist/BUG_ADMIN_21_coupon_delete_no_confirm.png) |
| `BUG_ADMIN_22` | Bảng Đơn hàng thiếu ô tìm kiếm và bộ lọc trạng thái, gây quá tải khi tìm đơn | Đơn Hàng | `IA-02` | **MINOR** | [`BUG_ADMIN_22_orders_no_search_or_filter.png`](../proof-image/checklist/BUG_ADMIN_22_orders_no_search_or_filter.png) |
| `BUG_ADMIN_23` | Bảng Đơn hàng hiển thị tất cả bản ghi trên một trang, thiếu phân trang (Pagination) | Đơn Hàng | `IA-02` | **MINOR** | [`BUG_ADMIN_23_orders_no_pagination.png`](../proof-image/checklist/BUG_ADMIN_23_orders_no_pagination.png) |
| `BUG_ADMIN_24` | Nút thao tác chuyển trạng thái đơn quá nhỏ (`text-xs px-2 py-1`), vi phạm định luật Fitts | Đơn Hàng | `IA-03` | **MAJOR** | [`BUG_ADMIN_24_orders_undersized_action_buttons.png`](../proof-image/checklist/BUG_ADMIN_24_orders_undersized_action_buttons.png) |
| `BUG_ADMIN_25` | Nút "Xác nhận" và "Hủy" xếp sát nhau không có khoảng đệm, nguy cơ ấn nhầm hủy đơn | Đơn Hàng | `IA-03` | **MAJOR** | [`BUG_ADMIN_25_orders_adjacent_confirm_cancel.png`](../proof-image/checklist/BUG_ADMIN_25_orders_adjacent_confirm_cancel.png) |
| `BUG_ADMIN_26` | Bảng Đơn hàng trống trơn trắng toang khi DB chưa có đơn (Thiếu hoàn toàn Empty State) | Đơn Hàng | `IA-04` | **MAJOR** | [`BUG_ADMIN_26_orders_blank_empty_state.png`](../proof-image/checklist/BUG_ADMIN_26_orders_blank_empty_state.png) |
| `BUG_ADMIN_27` | Đơn hàng đã hủy (`canceled`) vẫn xuất hiện nút cho phép đánh dấu đã giao (`delivered`) | Đơn Hàng | `IA-04` | **CRITICAL** | [`BUG_ADMIN_27_canceled_order_state_machine_violation.png`](../proof-image/checklist/BUG_ADMIN_27_canceled_order_state_machine_violation.png) |
| `BUG_ADMIN_28` | Lỗ hổng bảo mật XSS lưu trữ khi render địa chỉ giao hàng qua `dangerouslySetInnerHTML` | Đơn Hàng | `IA-04` | **CRITICAL** | [`BUG_ADMIN_28_shipping_address_stored_xss.png`](../proof-image/checklist/BUG_ADMIN_28_shipping_address_stored_xss.png) |

---

## 2. Chi Tiết Các Lỗi Trọng Yếu Điển Hình

### 2.1 BUG_ADMIN_06 — Công thức tính Tổng doanh thu Dashboard nhân đôi phi lý số tiền
* **Mã lỗi:** `BUG_ADMIN_06` (Liên quan `CHK-09`)
* **Màn hình:** Tab Dashboard (`FR-13`) | **Khía cạnh:** `IA-04` (State & Data Integrity)
* **Mức độ:** **CRITICAL** (Sai lệch nghiêm trọng số liệu tài chính quản trị)
* **Mô tả hành vi thực tế:** Khi hệ thống có 1 đơn hàng đã giao (`delivered`) trị giá `150.000 ₫`, trên thẻ KPI Dashboard lại hiển thị số tiền là `300.000 ₫`.
* **Hành vi kỳ vọng:** Tổng doanh thu hiển thị đúng tổng giá trị thực tế của các đơn đã giao: $\sum \text{total\_amount} = 150.000\text{ ₫}$.
* **Đoạn mã nguồn gây lỗi:**
  ```javascript
  // App.jsx - Dòng 217-220:
  const totalRevenue = orders.reduce((sum, o) => {
    if (o.status === "delivered") return sum + o.total_amount * 2; // LỖI: Nhân 2 phi lý
    return sum;
  }, 0);
  ```
* **Bằng chứng xác thực (Rule 9):** [BUG_ADMIN_06_double_revenue_calc.png](../proof-image/checklist/BUG_ADMIN_06_double_revenue_calc.png)

---

### 2.2 BUG_ADMIN_15 — Sửa một sản phẩm làm đổi tên hàng loạt toàn bộ sản phẩm trên UI
* **Mã lỗi:** `BUG_ADMIN_15` (Liên quan `CHK-24`)
* **Màn hình:** Tab Sản phẩm (`FR-15`) | **Khía cạnh:** `IA-04` (State Synchronization)
* **Mức độ:** **CRITICAL** (Gây hoảng loạn cho quản lý kho hàng)
* **Mô tả hành vi thực tế:** Khi bấm Sửa một sản phẩm và đổi tên thành "Áo Khoác Nam", sau khi lưu, toàn bộ hàng chục sản phẩm khác trên bảng danh sách đồng loạt bị đổi tên thành "Áo Khoác Nam".
* **Đoạn mã nguồn gây lỗi:**
  ```javascript
  // App.jsx - Dòng 110-114:
  const fakeMassUpdatedProducts = products.map((p) => ({
    ...p,
    name: productForm.name, // LỖI: Ghi đè tên của tất cả sản phẩm
  }));
  setProducts(fakeMassUpdatedProducts);
  ```
* **Bằng chứng xác thực (Rule 9):** [BUG_ADMIN_15_product_edit_mass_rename.png](../proof-image/checklist/BUG_ADMIN_15_product_edit_mass_rename.png)

---

### 2.3 BUG_ADMIN_16 — State mặc định số 0 và 1 đè mất placeholder, form trơ trọi không có label
* **Mã lỗi:** `BUG_ADMIN_16` (Liên quan `CHK-27`)
* **Màn hình:** Tab Mã Giảm Giá (`FR-17`) | **Khía cạnh:** `IA-02` (Forms & Accessibility)
* **Mức độ:** **MAJOR** (Người dùng không thể biết phải nhập gì vào ô)
* **Mô tả hành vi thực tế:** Form chỉ có placeholder mà không có `<label>`. Do React State khởi tạo `{ min_order_amount: 0, max_uses_per_user: 1 }`, hai giá trị số `0` và `1` đã hiển thị trong ô và che mất placeholder, khiến form chỉ còn trơ trọi 2 ô số vô danh.
* **Đoạn mã nguồn gây lỗi:**
  ```javascript
  // App.jsx - Dòng 29-31:
  const [couponForm, setCouponForm] = useState({
    min_order_amount: 0,     // Đè mất placeholder="Đơn tối thiểu (₫)"
    max_uses_per_user: 1,    // Đè mất placeholder="Số lần dùng tối đa/người"
  });
  ```
* **Bằng chứng xác thực (Rule 9):** [BUG_ADMIN_16_coupon_form_hidden_labels.png](../proof-image/checklist/BUG_ADMIN_16_coupon_form_hidden_labels.png)

---

### 2.4 BUG_ADMIN_26 — Bảng Đơn hàng trống trơn khi chưa có đơn (Thiếu Empty State)
* **Mã lỗi:** `BUG_ADMIN_26` (Liên quan `CHK-45`)
* **Màn hình:** Tab Đơn hàng (`FR-18`) | **Khía cạnh:** `IA-04` (Feedback & State)
* **Mức độ:** **MAJOR** (Gây cảm giác hệ thống bị treo hoặc lỗi)
* **Mô tả hành vi thực tế:** Khi cơ sở dữ liệu chưa có đơn hàng nào, bảng Đơn hàng chỉ hiện tiêu đề xám, thân bảng trắng toang không có dòng chữ "Chưa có đơn hàng nào".
* **Đoạn mã nguồn gây lỗi:**
  ```jsx
  // App.jsx - Dòng 792:
  <tbody>
    {orders.map((o) => ( ... ))} {/* Thiếu điều kiện: orders.length === 0 */}
  </tbody>
  ```
* **Bằng chứng xác thực (Rule 9):** [BUG_ADMIN_26_orders_blank_empty_state.png](../proof-image/checklist/BUG_ADMIN_26_orders_blank_empty_state.png)

---

### 2.5 BUG_ADMIN_27 — Vi phạm State Machine: Đơn đã hủy vẫn cho phép đánh dấu Đã giao
* **Mã lỗi:** `BUG_ADMIN_27` (Liên quan `CHK-47`)
* **Màn hình:** Tab Đơn hàng (`FR-18, FR-10`) | **Khía cạnh:** `IA-04` (State Machine Integrity)
* **Mức độ:** **CRITICAL** (Phá vỡ tính toàn vẹn vòng đời đơn hàng)
* **Mô tả hành vi thực tế:** Một đơn hàng đã bị `canceled` (trạng thái kết thúc) nhưng giao diện vẫn hiển thị nút màu xanh "Đánh dấu Đã giao", cho phép chuyển thẳng sang `delivered`.
* **Đoạn mã nguồn gây lỗi:**
  ```jsx
  // App.jsx - Dòng 862-869:
  {o.status === "canceled" && (
    <button
      className="bg-green-500 text-white px-2 py-1 rounded text-xs"
      onClick={() => updateOrderStatus(o.id, "delivered")} // VI PHẠM STATE MACHINE
    >
      Đánh dấu Đã giao
    </button>
  )}
  ```
* **Bằng chứng xác thực (Rule 9):** [BUG_ADMIN_27_canceled_order_state_machine_violation.png](../proof-image/checklist/BUG_ADMIN_27_canceled_order_state_machine_violation.png)

---

### 2.6 BUG_ADMIN_28 — Lỗ hổng bảo mật XSS lưu trữ qua `dangerouslySetInnerHTML`
* **Mã lỗi:** `BUG_ADMIN_28` (Liên quan `CHK-48`)
* **Màn hình:** Tab Đơn hàng (`FR-18`) | **Khía cạnh:** `IA-04` (Security in GUI)
* **Mức độ:** **CRITICAL** (Nguy cơ đánh cắp token quản trị viên `adminToken`)
* **Mô tả hành vi thực tế:** Cột địa chỉ giao hàng sử dụng `dangerouslySetInnerHTML` để hiển thị địa chỉ mà không qua bộ lọc khử khuẩn (sanitize), cho phép thực thi mã JavaScript độc hại khi admin xem đơn.
* **Đoạn mã nguồn gây lỗi:**
  ```jsx
  // App.jsx - Dòng 801-803:
  <td
    className="p-3 font-mono text-sm"
    dangerouslySetInnerHTML={{
      __html: o.shipping_address || "Chưa cập nhật", // LỖ HỔNG XSS
    }}
  />
  ```
* **Bằng chứng xác thực (Rule 9):** [BUG_ADMIN_28_shipping_address_stored_xss.png](../proof-image/checklist/BUG_ADMIN_28_shipping_address_stored_xss.png)

---
*Báo cáo được hoàn thiện và bảo chứng bởi sinh viên Trần Đại Hiệp (MSSV: 23120256).*
