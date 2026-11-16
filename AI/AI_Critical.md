# AI Usage Critical Assessment — Homework Week 03

> **Môn học:** Kiểm thử phần mềm (Software Testing) – FIT@HCMUS  
> **Bài tập:** HW03 – GUI & Usability Testing on EShop Web Admin  
> **Sinh viên:** Trần Đại Hiệp (MSSV: 23120256)  
> **Phân hệ kiểm thử (SUT):** EShop Web Admin (`frontend-admin` React)  
> **Tiêu chuẩn Bloom-AI:** **G9.3 (Analyse)** & **G9.4 (Evaluate)**  
> **Tuân thủ biểu mẫu:** FIT@HCMUS AI Templates (`[AI-01]` đến `[AI-06]`)

---

## 1. Thông Tin Nhận Diện Hội Thoại (Conversation Metadata)

| Trường Thông Tin | Giá Trị |
|---|---|
| **Môn học & Bài tập** | Software Testing — Week 03: GUI & Usability Testing |
| **Leader Conversation ID** | `f0a6bbc4-bb59-49b8-8d1b-c5d8c45f2598` |
| **Developer Conversation ID** | `ecc28991-0c19-45d7-94db-fa7ddc986922` |
| **Công cụ & Mô hình AI** | Google Antigravity / Gemini 3.8 Flash (High) |
| **Trạng thái đánh giá** | **Hoàn thành (Completed & Audited)** |
| **Độ dài đoạn văn phê bình** | **287 từ** (Tuân thủ nghiêm ngặt khung 200–300 từ theo Tiêu chí 4 đề bài & Bloom-AI G9.3/G9.4) |

---

## 2. Đoạn Văn Phản Biện Năng Lực AI (AI Critical Evaluation — 287 từ)

Trong toàn bộ tiến trình thực thi HW03 trên EShop Web Admin, AI phát huy thế mạnh rõ rệt ở tốc độ khởi tạo dự án, dựng khung 48 tiêu chí GUI Checklist và đóng gói hai Agent Skill chuyên biệt. Dẫu vậy, AI bộc lộ những điểm mù cố hữu đòi hỏi con người phải liên tục phản biện và tái định hướng.

Trước hết, tác tử Leader liên tục đưa ra kế hoạch sơ sài, phát sinh nhận xét mang tính văn mẫu sáo rỗng và cố tình nhét phân tích AI Gap vào trong Agent Skill—một nghịch lý khi AI không thể tự nhận thức toàn vẹn thiếu sót của chính mình. Về phía Developer, khiếm khuyết chí mạng là ảo tưởng mã nguồn tĩnh khi chỉ đọc file App.jsx để suy diễn giao diện thay vì kiểm thử trên SUT đang chạy, dẫn đến việc sinh checklist sai lệch với DOM thực tế. Ngoài ra, AI lúng túng không thể tự phân định ranh giới giữa kiểm định tự động bằng Playwright với các khía cạnh cảm quan cần con người trực tiếp đánh giá.

Sinh viên đã kiên quyết can thiệp: bóc tách AI Gap thành bước hậu kiểm độc lập, phân chia rõ ràng test case tự động và thủ công, áp dụng Rule 9 chụp ảnh RAW, đồng thời trực tiếp điều phối 7 buổi phỏng vấn người dùng thật để tính toán điểm số SUS khách quan thay vì giả lập số liệu. Bài học cốt lõi là AI chỉ là công cụ gia tốc; năng lực phương pháp luận và sự kiểm chứng thực nghiệm của kỹ sư mới là nhân tố quyết định chất lượng kiểm thử.

---

## 3. Tổng Hợp Các Điểm Mù AI Qua Lịch Sử Chat LEADER & DEVELOPER (Review & Chấn Chỉnh)

Bảng đối soát dưới đây được tổng hợp trực tiếp từ lịch sử tương tác thực tế của hai tác tử Leader (`f0a6bbc4-bb59-49b8-8d1b-c5d8c45f2598`) và Developer (`ecc28991-0c19-45d7-94db-fa7ddc986922`), ghi nhận các can thiệp quyết định của sinh viên:

| Tác Tử / Giai Đoạn | Lỗi Sai & Điểm Mù Của AI | Biểu Hiện Bề Mặt & Ngụy Biện Của AI | Hành Động Can Thiệp & Hiệu Chỉnh Của Sinh Viên |
|:---|:---|:---|:---|
| **Leader (Exchange #4)** | Nhầm lẫn vai trò, phức tạp hóa và sai định hướng tài liệu ban đầu. | Trình bày bản mô tả task rườm rà, lẫn lộn giữa tài liệu đặc tả phạm vi và README tự đánh giá, đi chệch khỏi quy trình cốt lõi. | Sinh viên chặn đứng kịp thời: *"Leader, dừng lại và chấn chỉnh lại cách làm việc ngay!..."*, yêu cầu cô đọng lại 2 file nền tảng đúng trọng tâm. |
| **Leader (Exchange #8)** | Nghịch lý kiến trúc khi nhét "AI Gap" vào bên trong Agent Skill. | Đề xuất tích hợp cột và logic AI Gap vào template của skill `gui-checklist-tester`, buộc AI phải "tự sinh rồi tự chê chính mình". | Sinh viên vạch trần nghịch lý logic: AI Gap là bước con người hậu kiểm sau khi AI sinh ra, bóc tách triệt để AI Gap ra khỏi mã nguồn skill. |
| **Leader (Exchange #10)** | Nhận xét hời hợt, mang tính "văn mẫu" sáo rỗng, không có chiều sâu kỹ thuật. | Đưa ra bản review chung chung, khen ngợi bề nổi mà không kiểm tra độ khả thi và các khuyết tật cụ thể trong sản phẩm của Dev. | Sinh viên phê bình nghiêm khắc: *"Bản nhận xét vừa rồi của bạn cực kỳ TỆ và mang nặng tính 'văn mẫu'..."*, bắt buộc soi kỹ từng file thực tế. |
| **Leader (Exchange #16, #20)** | Kịch bản Usability E2E mơ hồ, thiếu công cụ tính toán điểm số SUS chuẩn. | Đề xuất kịch bản chung chung, không có kịch bản nhiệm vụ mở (Goal-Oriented) và bỏ quên công cụ/script xử lý dữ liệu khảo sát SUS. | Sinh viên định hình cấu trúc hoàn chỉnh cho skill `usability-evaluator`: xây dựng Moderator Guide, Task Scenario và script Python tính điểm SUS. |
| **Developer (Exchange #8)** | Ảo tưởng mã nguồn tĩnh (Static Code Illusion). | Chỉ đọc lướt mã nguồn tĩnh `App.jsx`, suy diễn sai lệch trạng thái giao diện, sinh checklist có các nút bấm và luồng thao tác không hề tồn tại trên DOM. | Sinh viên mở trình duyệt trực quan đối soát thực tế, chỉ rõ các điểm lệch và bắt buộc Dev đối chiếu trực tiếp với SUT đang chạy. |
| **Developer (Exchange #12)** | Nhầm lẫn ranh giới giữa kiểm thử tự động (Playwright) và kiểm thử thủ công. | Lạm dụng Playwright cố viết script tự động hóa cả những tiêu chí giao diện mang tính trực quan thẩm mỹ và trạng thái cảm quan. | Sinh viên chấn chỉnh: bóc tách rành mạch những item nào Playwright tự động hóa được, item nào thuộc kiểm thử thủ công ghi chú để người thật tự kiểm. |
| **Developer (Exchange #15)** | Bất đồng bộ số liệu thống kê giữa các tài liệu. | Ghi phân bổ số lượng items cũ (12, 16, 8, 12) ở dòng 19 trong `README.md` lệch với bộ Checklist 48 items chuẩn (12, 12, 9, 15). | Sinh viên phát hiện sai lệch số liệu, yêu cầu cập nhật đồng bộ toàn bộ bảng phân bổ trên tất cả các báo cáo kỹ thuật. |
| **Developer (Exchange #16)** | Thiếu sót liên kết minh chứng ảnh Rule 9 trong checklist tra cứu nhanh. | Để file `GUI_Checklist.md` không có liên kết trực tiếp tới file ảnh chụp màn hình RAW trong thư mục `proof-image/`. | Sinh viên yêu cầu chèn trực tiếp liên kết markdown `([Ảnh](...))` vào cột Notes của Checklist để phục vụ chấm thi minh bạch. |

---

## 4. Khai Báo Năng Lực Bloom-AI (Bloom-AI Competency Framework)

| Cấp Độ Bloom-AI | Hoạt Động Cụ Thể Trong HW03 | Minh Chứng Trong Hồ Sơ |
|:---:|:---|:---|
| **G9.3: Analyse** *(Phân tích)* | • Độc lập phân tích khoảng trống kiểm thử (**AI Gap Analysis**) vạch rõ 8 khuyết tật mà AI bỏ sót khi sinh checklist.<br>• Phân định ranh giới phương pháp luận giữa kiểm thử tự động (Playwright E2E) và kiểm thử thủ công/trực quan.<br>• Chẩn đoán nguyên nhân gốc rễ và phân loại 4 nhóm lỗi giao diện/trạng thái trên EShop Web Admin (`BUG_ADM_01` đến `BUG_ADM_04`). | • Báo cáo thực thi & AI Gap: [`reports/01_GUI_Checklist_Report.md`](../reports/01_GUI_Checklist_Report.md)<br>• Hồ sơ lỗi: [`bugs/bug_reports.md`](../bugs/bug_reports.md)<br>• Bảng tương tác: [`AI_Audit.md`](AI_Audit.md) |
| **G9.4: Evaluate** *(Đánh giá)* | • Thẩm định chất lượng sinh mã, điều phối và chấn chỉnh hai tác tử Leader/Developer qua các phản biện kỹ thuật chuyên sâu.<br>• Thiết kế và điều phối thực nghiệm Usability Testing với **7 người dùng thật ngoài lớp học**, kiểm định độ tin cậy bằng thang đo chuẩn quốc tế SUS 10 câu hỏi của John Brooke.<br>• Đánh giá mức độ khả dụng đa nền tảng (Chrome Desktop, Firefox Desktop, Chrome Mobile qua LAN IP). | • Báo cáo Usability & SUS: [`reports/02_Usability_Evaluation_Report.md`](../reports/02_Usability_Evaluation_Report.md)<br>• Bảng tính điểm: [`usability/SUS_Responses.xlsx`](../usability/SUS_Responses.xlsx)<br>• Báo cáo Cross-Platform: [`reports/03_Cross_Platform_Report.md`](../reports/03_Cross_Platform_Report.md) |

---

## 5. Cam Kết Tuân Thủ Biểu Mẫu FIT@HCMUS

Sinh viên xác nhận toàn bộ quá trình sử dụng AI trong bài tập HW03 tuân thủ nghiêm ngặt các hướng dẫn và biểu mẫu chính thức của Khoa CNTT - Trường ĐH Khoa học Tự nhiên, ĐHQG-HCM:
* **[AI-01] AI Agreement:** Cam kết minh bạch và trung thực học thuật trong việc ứng dụng AI.
* **[AI-02] AI Audit Report:** Lưu trữ nhật ký tương tác đầy đủ, khách quan, phân tách rõ ràng Mục 1 (Leader) và Mục 2 (Developer) tại `AI_Audit.md`.
* **[AI-03] AI Disclosure Form:** Khai báo danh mục công cụ, mô hình, mục đích và phạm vi ứng dụng AI.
* **[AI-04] AI Reflective Statement:** Hoàn thành bài luận phản biện nhận thức (287 từ) về giới hạn và bài học cộng tác với AI.
* **[AI-05] AI Privacy Checklist:** Khử định danh, che giấu thông tin nhạy cảm và bảo mật mã nguồn theo quy định.
* **[AI-06] AI Student Acknowledgement:** Chịu trách nhiệm 100% trước Giảng viên về tính chính xác của toàn bộ sản phẩm kiểm thử.
