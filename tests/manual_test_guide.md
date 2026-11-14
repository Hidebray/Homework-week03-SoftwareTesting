# HƯỚNG DẪN KIỂM THỬ THỦ CÔNG (MANUAL TEST GUIDE)
## Phân Biệt Hạng Mục Tự Động Hóa (Automation) vs Thủ Công (Manual) Trong Bộ 48 Items

> **Môn học:** Kiểm thử phần mềm (Software Testing) – FIT@HCMUS  
> **Dự án:** HW03 – GUI & Usability Testing  
> **Phân hệ:** EShop Web Admin (`frontend-admin`)  
> **Người thực hiện:** Trần Đại Hiệp (MSSV: 23120256)  

---

## 1. Nguyên Tắc Phân Định Automation (Playwright) vs Manual Testing

Để tối ưu hóa thời gian và đảm bảo độ chính xác theo đúng thực tiễn kiểm thử công nghiệp:
- **Automation Test (Playwright — 30 items):** Áp dụng cho các tiêu chí có thể lượng hóa và kiểm tra tự động qua mã lệnh:
  - Kiểm tra sự tồn tại của thuộc tính DOM (`required`, `min`, `max`, `accept`, `tabIndex`).
  - Kiểm thử giá trị biên nhập liệu (nhập số âm, số vượt 100%, ngày quá khứ, chuỗi XSS).
  - Kiểm tra logic tính toán dữ liệu (nhân đôi doanh thu, tính tổng đơn hàng).
  - Kiểm tra vi phạm State Machine (nút chuyển state sai quy trình).
  - Tự động chụp ảnh bằng chứng Rule 9 cho các mục Failed.
- **Manual / Visual Inspection (Con Người Tự Kiểm — 18 items):** Áp dụng cho các khía cạnh cần cảm nhận thị giác, đánh giá thẩm mỹ và tương tác người dùng:
  - Cảm quan phân cấp thị giác (Typography, độ nổi bật của số liệu so với nhãn).
  - Độ hài hòa màu sắc, tính nhất quán nhận diện thương hiệu giữa các màn hình (Design System).
  - Trải nghiệm gõ phím, di chuột và độ thoải mái theo định luật Fitts (khoảng cách các nút bấm thao tác).
  - Đánh giá sự bối rối khi gặp các trạng thái dị thường (mất nhãn ô nhập, bảng trống trắng toang).

---

## 2. Bảng Phân Định Chi Tiết 48 Checkpoints

| Check ID | Màn Hình / Tab | Khía Cạnh | Tóm Tắt Mục Kiểm Tra | Phương Thức | Ghi Chú & Hướng Dẫn Thực Hiện |
|:---:|:---|:---:|:---|:---:|:---|
| `CHK-01` | Dashboard | `IA-01` | Phân cấp thị giác số liệu KPI | 👤 **Manual** | Quan sát bằng mắt: Số liệu có đủ to và nổi bật hơn nhãn chữ xám bên trên không? |
| `CHK-02` | Dashboard | `IA-01` | Bố cục lưới 2 cột thẻ KPI trên desktop | 👤 **Manual** | Quan sát xem 2 thẻ có đều nhau, có đổ bóng viền nhẹ nhàng không. |
| `CHK-03` | Dashboard | `IA-01` | Nhất quán màu nút CTA (Login, SP, Coupon) | 👤 **Manual** | So sánh màu nút chính: Login (Xanh), Lưu SP (Xanh lá), Tạo Coupon (Cam) $\implies$ Lệch màu! |
| `CHK-04` | Dashboard | `IA-01` | Co giãn thẻ KPI khi thu nhỏ mobile | 🤖 **Playwright** | Đã tự động đổi viewport 480x800 và chụp ảnh vỡ chữ. |
| `CHK-05` | Dashboard | `IA-02` | Bộ lọc thời gian chọn ngày thống kê | 🤖 **Playwright** | Kiểm tra DOM không tìm thấy bất kỳ ô chọn ngày nào trên Dashboard. |
| `CHK-06` | Dashboard | `IA-03` | Phím Tab duyệt menu Sidebar (A11y) | 👤 **Manual** | **Tự thử:** Bấm phím `Tab` liên tục xem con trỏ có nhảy vào các mục Sidebar không? $\implies$ Bị liệt! |
| `CHK-07` | Dashboard | `IA-03` | Highlight xanh mục menu đang chọn | 👤 **Manual** | Nhấp vào từng tab, nhìn xem chữ có đổi sang màu xanh sáng (`text-blue-400`) không. |
| `CHK-08` | Dashboard | `IA-03` | Nhấp thẻ KPI để chuyển sang bảng Đơn | 🤖 **Playwright** | Đã kiểm tra: Thẻ KPI chỉ là thẻ `div`, trỏ chuột không đổi thành bàn tay (`cursor-pointer`). |
| `CHK-09` | Dashboard | `IA-04` | Doanh thu nhân đôi (`* 2`) | 🤖 **Playwright** | Đã kiểm tra số học: Đơn 150.000 ₫ nhưng Dashboard hiển thị thành 300.000 ₫. |
| `CHK-10` | Dashboard | `IA-04` | Loạn định dạng tiền tệ giữa 3 tabs | 👤 **Manual** | Mở tab SP xem số `30000000 ₫`, tab Coupon xem `300,000 ₫`, tab Dashboard xem `0 ₫`. |
| `CHK-11` | Dashboard | `IA-04` | Thiếu loading skeleton khi tải dữ liệu | 👤 **Manual** | Nhấn F5 tải lại trang, quan sát xem có thanh Skeleton nhấp nháy hay bị giật số `0 ₫` rồi mới hiện số? |
| `CHK-12` | Dashboard | `IA-04` | Trạng thái hiển thị khi chưa có đơn nào | 🤖 **Playwright** | Đã kiểm tra khi mảng rỗng: Dashboard vẫn hiện `0 ₫` và `0 đơn`. |
| `CHK-13` | Sản phẩm | `IA-01` | Khung nền xanh nhạt phân tách CSV Import | 👤 **Manual** | Quan sát xem khu vực Import CSV có nền màu xanh (`bg-blue-50`) dễ nhận biết không. |
| `CHK-14` | Sản phẩm | `IA-01` | Ảnh thumbnail vuông vức, không méo | 👤 **Manual** | Nhìn các ảnh nhỏ sản phẩm trên bảng xem có bị kéo dãn hay mờ không. |
| `CHK-15` | Sản phẩm | `IA-01` | Giá tiền dính chùm không có dấu chấm/phẩy | 👤 **Manual** | Nhìn cột Giá: Số `30000000 ₫` rất khó đọc vì thiếu dấu phân cách hàng ngàn. |
| `CHK-16` | Sản phẩm | `IA-02` | Bắt buộc nhập tên sản phẩm | 🤖 **Playwright** | Để trống tên và bấm Lưu: Trình duyệt chặn submit (`required`). |
| `CHK-17` | Sản phẩm | `IA-02` | Cho phép nhập giá bán số âm | 🤖 **Playwright** | Đã tự động nhập `-50000` vào ô giá: Input chấp nhận vì thiếu `min="0"`. |
| `CHK-18` | Sản phẩm | `IA-02` | Input file CSV thiếu lọc `accept=".csv"` | 🤖 **Playwright** | Đã quét thuộc tính input file: Không hề có `accept=".csv"`. |
| `CHK-19` | Sản phẩm | `IA-02` | Lỗi parse CSV khi mô tả có dấu phẩy | 🤖 **Playwright** | Đã kiểm tra code `split(',')`: Làm lệch cột khi có dấu phẩy trong chuỗi. |
| `CHK-20` | Sản phẩm | `IA-02` | Dropdown danh mục lấy từ CSDL | 🤖 **Playwright** | Đã kiểm tra dropdown `<select>` nạp đúng các danh mục từ backend. |
| `CHK-21` | Sản phẩm | `IA-03` | Nút tải file CSV mẫu một chạm | 🤖 **Playwright** | Nhấp vào link tải `template.csv`, trình duyệt kích hoạt download ngay. |
| `CHK-22` | Sản phẩm | `IA-03` | Nút Sửa và Xóa nằm quá sát nhau | 👤 **Manual** | Dùng chuột thử click nhanh giữa Sửa và Xóa: Khoảng cách rất hẹp, dễ bấm nhầm! |
| `CHK-23` | Sản phẩm | `IA-04` | Xóa sản phẩm không có confirm modal | 🤖 **Playwright** | Nhấp Xóa: Không hề hiện popup xác nhận `Are you sure?`, xóa thẳng tay! |
| `CHK-24` | Sản phẩm | `IA-04` | Sửa 1 sản phẩm làm đổi tên toàn bộ SP | 🤖 **Playwright** | Thao tác sửa sản phẩm: Bảng UI bị đổi tên đồng loạt do `fakeMassUpdatedProducts`. |
| `CHK-25` | Mã Giảm Giá | `IA-01` | Font monospace in đậm cho mã coupon | 👤 **Manual** | Nhìn cột Mã: Chữ `SALE20` có font kiểu lập trình (`font-mono`) màu cam đậm không. |
| `CHK-26` | Mã Giảm Giá | `IA-01` | Căn lề số tiền và số lần dùng | 👤 **Manual** | Kiểm tra độ ngay ngắn của các cột số tiền và số lần dùng. |
| `CHK-27` | Mã Giảm Giá | `IA-02` | Số 0 và 1 đè mất placeholder, thiếu label | 👤 **Manual** | **Tự nhìn:** Mở form tạo mã, bạn thấy 2 ô số 0 và 1 mà không hề có nhãn chữ bên cạnh! |
| `CHK-28` | Mã Giảm Giá | `IA-02` | Cho phép nhập mã chữ thường lộn xộn | 🤖 **Playwright** | Đã nhập `sale_lower_case`: Form chấp nhận mà không ép chữ in hoa. |
| `CHK-29` | Mã Giảm Giá | `IA-02` | Cho phép chọn ngày hết hạn năm 2020 | 🤖 **Playwright** | Đã chọn ngày `2020-01-01`: Date picker không có `min="today"`, cho phép lưu. |
| `CHK-30` | Mã Giảm Giá | `IA-02` | Giảm giá phần trăm cho phép nhập 500% | 🤖 **Playwright** | Đã nhập `500` vào ô %: Form chấp nhận vì thiếu `max="100"`. |
| `CHK-31` | Mã Giảm Giá | `IA-02` | Nhãn "Giá trị" tĩnh không đổi % hay ₫ | 👤 **Manual** | Đổi dropdown giữa Phần trăm và Số tiền: Ô bên dưới vẫn chỉ ghi chữ "Giá trị". |
| `CHK-32` | Mã Giảm Giá | `IA-03` | Nút "Tạo mã" màu cam nổi bật | 👤 **Manual** | Quan sát độ tương phản của nút màu cam `bg-orange-500` với nền trắng. |
| `CHK-33` | Mã Giảm Giá | `IA-03` | Nút Xóa có màu đỏ cảnh báo | 👤 **Manual** | Kiểm tra nút Xóa có mang màu đỏ cảnh báo hành động nguy hiểm không. |
| `CHK-34` | Mã Giảm Giá | `IA-04` | Tag màu đỏ "Hết hạn" cho coupon cũ | 👤 **Manual** | Nhìn coupon có ngày quá khứ: Cột hết hạn hiện chữ đỏ "Hết hạn". |
| `CHK-35` | Mã Giảm Giá | `IA-04` | Xóa coupon không có hộp thoại confirm | 🤖 **Playwright** | Nhấp Xóa: Không hề hiện dialog confirm, gọi thẳng API xóa ngay. |
| `CHK-36` | Mã Giảm Giá | `IA-04` | Tự xóa trắng form sau khi tạo mã | 🤖 **Playwright** | Sau khi submit thành công: Các ô input tự reset về rỗng. |
| `CHK-37` | Đơn Hàng | `IA-01` | Tiêu đề bảng đơn hàng có nền xám rõ nét | 👤 **Manual** | Kiểm tra dòng header bảng đơn hàng có màu xám `bg-gray-200` phân biệt rõ với dữ liệu. |
| `CHK-38` | Đơn Hàng | `IA-01` | Mã đơn hàng có dấu thăng `#` | 👤 **Manual** | Nhìn cột đầu tiên: Mã đơn viết dạng `#1`, `#2`. |
| `CHK-39` | Đơn Hàng | `IA-01` | Địa chỉ dài tự động xuống dòng | 👤 **Manual** | Xem địa chỉ dài có tự xuống hàng hay bị tràn ngang làm vỡ bảng. |
| `CHK-40` | Đơn Hàng | `IA-02` | Thiếu ô tìm kiếm và lọc trạng thái đơn | 🤖 **Playwright** | Quét DOM trang Đơn hàng: Không hề có bất kỳ ô input Search hay filter nào. |
| `CHK-41` | Đơn Hàng | `IA-02` | Thiếu thanh phân trang khi có nhiều đơn | 🤖 **Playwright** | Bảng không hề có nút Trang trước / Trang sau hoặc phân trang số. |
| `CHK-42` | Đơn Hàng | `IA-03` | Nút thao tác quá nhỏ (`text-xs`), khó bấm | 👤 **Manual** | **Tự thử bấm:** Nút "Xác nhận", "Hủy", "Giao hàng" rất bé, rất dễ bấm trượt trên laptop. |
| `CHK-43` | Đơn Hàng | `IA-03` | Nút "Xác nhận" và "Hủy" xếp sát nhau | 👤 **Manual** | Khoảng cách 2 nút rất gần, nhân viên vội vàng rất dễ ấn nhầm vào Hủy đơn khách. |
| `CHK-44` | Đơn Hàng | `IA-04` | Màu sắc badge trạng thái trực quan | 👤 **Manual** | Quan sát các badge: pending (vàng), confirmed (tím), shipping (xanh), delivered (xanh lá). |
| `CHK-45` | Đơn Hàng | `IA-04` | Bảng trắng toang thiếu Empty State khi DB rỗng | 👤 **Manual** | **Tự quan sát:** Khi chưa có đơn, bên dưới header là một khoảng trắng toang, thiếu chữ "Chưa có đơn". |
| `CHK-46` | Đơn Hàng | `IA-04` | Đơn shipping chỉ hiện nút "Hoàn thành" | 🤖 **Playwright** | Kiểm tra đơn đang giao: Đúng quy trình chỉ hiển thị nút chuyển sang delivered. |
| `CHK-47` | Đơn Hàng | `IA-04` | Đơn đã hủy (`canceled`) vẫn cho bấm Đã giao | 🤖 **Playwright** | Tìm đơn canceled: Phát hiện nút màu xanh "Đánh dấu Đã giao" $\implies$ Sai quy trình! |
| `CHK-48` | Đơn Hàng | `IA-04` | Lỗ hổng XSS địa chỉ giao hàng | 🤖 **Playwright** | Đã phát hiện thẻ `dangerouslySetInnerHTML` render mã độc HTML trực tiếp. |

---

## 3. Các Bước Tự Kiểm Thử Nhanh Bằng Tay (5 Phút Dành Cho Bạn)

1. **Bước 1 (Kiểm tra Phím Tab & Menu):** Mở `http://localhost:5174`, bấm phím `Tab` liên tục trên bàn phím. Bạn sẽ thấy con trỏ hoàn toàn bỏ qua các mục menu Sidebar bên trái (`CHK-06`).
2. **Bước 2 (Kiểm tra Loạn Tiền Tệ & Nút Bấm):** Mở tab Dashboard (doanh thu `0 ₫`), sang tab Sản phẩm (giá `30000000 ₫` dính chùm), sang tab Coupon (`300,000 ₫` dấu phẩy kiểu Mỹ). Đồng thời để ý nút Login màu Xanh dương, nút Lưu SP màu Xanh lá, nút Tạo coupon màu Cam (`CHK-03`, `CHK-10`, `CHK-15`).
3. **Bước 3 (Kiểm tra Mất Nhãn Form Coupon):** Nhấp sang tab Mã Giảm Giá, nhìn vào form tạo mới: Có 2 ô chỉ hiện trơ trọi số `0` và số `1` không có nhãn chữ bên cạnh (`CHK-27`).
4. **Bước 4 (Kiểm tra Nút Bấm Nguy Hiểm & Sát Nhau):** Vào tab Sản phẩm, nhìn nút `Sửa` và `Xóa` nằm sát nhau; bấm Xóa là mất luôn không hỏi han (`CHK-22`, `CHK-23`). Vào tab Đơn hàng, nhìn nút `Xác nhận` và `Hủy` bé tí và xếp cạnh nhau (`CHK-42`, `CHK-43`).
5. **Bước 5 (Kiểm tra Bảng Đơn Rỗng):** Nếu danh sách đơn hàng trống, nhìn xuống bảng: Trắng xóa không có lấy một dòng chữ "Chưa có đơn hàng nào" (`CHK-45`).

---
*Hướng dẫn được thiết lập phục vụ pair-testing giữa Developer và Tester/User.*
