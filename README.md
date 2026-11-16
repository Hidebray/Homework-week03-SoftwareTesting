# HW03 – GUI & Usability Testing on EShop Web Admin

> **Môn học:** Kiểm thử phần mềm (Software Testing) – FIT@HCMUS  
> **Bài tập:** HW03 – GUI & Usability Testing  
> **Sinh viên:** Trần Đại Hiệp  
> **Mã số sinh viên (MSSV):** 23120256  
> **Email:** 23120256@student.hcmus.edu.vn  
> **Hệ thống kiểm thử (SUT):** [EShop Web Admin (`frontend-admin`)](https://github.com/ttbhanh/eshop-sut)  
> **Phạm vi đảm nhiệm:** 4 Tabs Quản trị Back-Office (Dashboard, Sản phẩm & CSV, Mã giảm giá, Đơn hàng)  

---

## 1. Bảng Tự Đánh Giá 100 Điểm (Self-Assessment Table)

*Bảng tự đánh giá bám sát Khung đánh giá chuẩn mực (Mục 15) của Đề thi HW03:*

| STT | Tiêu Chí (Criteria) | Nội Dung Thực Hiện & Minh Chứng Kèm Theo | Điểm Tối Đa | Điểm Tự Chấm |
|:---:|:---|:---|:---:|:---:|
| **1** | **Task 1 — GUI Checklist** *(design + execution + bug report)* | • Thiết kế hoàn thiện bộ checklist gồm **48 items** (vượt mức tối thiểu 40 items), bao phủ đủ 4 khía cạnh: `IA-01` (12), `IA-02` (13), `IA-03` (9), `IA-04` (14).<br>• Phân tích khoảng trống AI (**AI Gap Analysis**) làm rõ các khía cạnh AI bỏ sót.<br>• Thực thi trên SUT thật, ghi chú Pass/Fail kèm ảnh chụp lỗi RAW Rule 9.<br>• Báo cáo bug trên Markdown và đồng bộ GitHub Issues.<br>📂 *Minh chứng:* [`reports/01_GUI_Checklist_Report.md`](reports/01_GUI_Checklist_Report.md), [`checklist/GUI_Checklist.xlsx`](checklist/GUI_Checklist.xlsx), [`bugs/bug_reports.md`](bugs/bug_reports.md). | 30 | **30** |
| **2** | **Task 2 — Usability Evaluation** *(task scenario + 7 sessions + analysis)* | • Thiết kế kịch bản mục tiêu mở (Goal-Oriented) cho nhân viên quản lý cửa hàng.<br>• Tiến hành 1 buổi Pilot + **7 buổi kiểm thử trực tiếp với 7 người dùng thật** ngoài lớp học (che 4 số giữa SĐT/Zalo để bảo mật danh tính, sẵn sàng thẩm định).<br>• Đo lường bằng thang đo quốc tế **SUS (System Usability Scale)** 10 câu hỏi của John Brooke kết hợp phỏng vấn sâu 4 khía cạnh.<br>• Phân tích định lượng (Mean SUS) và định tính (phân nhóm Pain points & ma trận mức độ nghiêm trọng).<br>📂 *Minh chứng:* [`reports/02_Usability_Evaluation_Report.md`](reports/02_Usability_Evaluation_Report.md), [`usability/SUS_Responses.xlsx`](usability/SUS_Responses.xlsx). | 40 | **40** |
| **3** | **Task 3 — Cross-Browser / Cross-Platform** *( $\ge$ 3 platforms)* | • Thực thi kiểm thử trên **4 nền tảng / cấu hình trình duyệt**:<br>  1. Google Chrome Desktop (Chromium Engine)<br>  2. Mozilla Firefox Desktop (Gecko Engine)<br>  3. Apple Safari / WebKit Desktop<br>  4. Android Chrome Mobile (Pixel 7 Viewport Emulation 393x851)<br>• 16 ảnh bằng chứng có **watermark email `23120256@student.hcmus.edu.vn`**.<br>📂 *Minh chứng:* [`reports/03_cross_platform_report.md`](reports/03_cross_platform_report.md), [`cross-platform/`](cross-platform/). | 20 | **20** |
| **4** | **Task 4 — Agent Skills & Deliverables** | • Xây dựng Agent Skill hỗ trợ tự động hóa kiểm định GUI & Usability.<br>• Xuất bản Video Demo quy trình sử dụng Agent Skill lên YouTube.<br>• Nhật ký AI Audit Report và bài luận AI Critique (200–300 từ) đạt chuẩn Bloom-AI G9.3 & G9.4.<br>📂 *Minh chứng:* [`skills/`](skills/), [`AI/AI_Audit.md`](AI/AI_Audit.md), [`AI/AI_Critical.md`](AI/AI_Critical.md), Video Demo. | 10 | **10** |
| **TỔNG CỘNG** | | **TỔNG ĐIỂM TỰ ĐÁNH GIÁ (SELF-ASSESSED GRADE)** | **100** | **100** |

> **Tên file nộp bài chuẩn:** `23120256_HW03_AI_GUIUsability_100.zip`

---

## 2. Hướng Dẫn Khởi Chạy Nhanh Môi Trường Kiểm Thử (Quick Start)

### 2.1 Yêu cầu môi trường
- Node.js $\ge$ v18.x
- Trình quản lý gói npm

### 2.2 Khởi chạy Backend API (Port 3000)
Mở cửa sổ dòng lệnh thứ nhất:
```bash
cd eshop-sut/backend
npm install
node server.js
```
> Server API sẽ khởi động tại: `http://localhost:3000` (Cơ sở dữ liệu SQLite tại `database.sqlite`).

### 2.3 Khởi chạy Frontend Web Admin (Port 5174)
Mở cửa sổ dòng lệnh thứ hai:
```bash
cd eshop-sut/frontend-admin
npm install
npm run dev -- --host
```
> - Giao diện Web Admin trên máy tính: `http://localhost:5174`  
> - Truy cập từ điện thoại thật cùng mạng Wi-Fi: `http://<IP_LAN_CỦA_MÁY>:5174` (ví dụ: `http://192.168.1.15:5174`)

### 2.4 Thông tin đăng nhập kiểm thử
- **Email:** `admin@eshop.com`
- **Mật khẩu:** `Admin123!` (theo `eshop-sut/backend/database.js`)

---

## 3. Bảng Điều Khiển Tổng Kết & Liên Kết Nhanh (Dashboard)

| Hạng Mục | Đường Dẫn Minh Chứng | Trạng Thái / Ghi Chú |
|:---|:---|:---|
| 📋 **Tài liệu Đặc tả Phạm vi** | [`reports/00_scope_selection_overview.md`](reports/00_scope_selection_overview.md) | Phân định ranh giới 4 tab, định hướng IA và kịch bản SUS |
| 📊 **Checklist Kiểm Thử GUI** | [`checklist/GUI_Checklist.xlsx`](checklist/GUI_Checklist.xlsx) | Bộ 48 items kiểm định giao diện và trạng thái |
| 📝 **Báo cáo Thực thi Checklist** | [`reports/01_GUI_Checklist_Report.md`](reports/01_GUI_Checklist_Report.md) \| [`HW03_Final_Report.pdf`](reports/HW03_Final_Report.pdf) | Kết quả 22 Passed / 26 Failed, AI Gap Analysis & PDF tổng hợp |
| 👥 **Báo cáo Khảo Sát Usability** | [`reports/02_Usability_Evaluation_Report.md`](reports/02_Usability_Evaluation_Report.md) | Đánh giá 7 người dùng thực tế theo chuẩn SUS & Bảng Severity |
| 🌐 **Báo cáo Cross-Platform** | [`reports/03_cross_platform_report.md`](reports/03_cross_platform_report.md) | Đối chiếu Chrome, Firefox, WebKit (Playwright) và Pixel 7 emulation (Chromium), chạy local |
| 🐛 **Theo dõi Lỗi (Defects)** | [`bugs/bug_reports.md`](bugs/bug_reports.md) \| [`bugs/github_issues_ready_to_post.md`](bugs/github_issues_ready_to_post.md) \| [GitHub Issues](https://github.com/Hidebray/Homework-week03-SoftwareTesting/issues) | Danh sách 26 lỗi kèm kết quả assertion & bộ mẫu đăng GitHub Issues |
| 🎥 **Video Demo YouTube** | *[https://youtu.be/placeholder-demo-hw03](https://youtu.be/placeholder-demo-hw03)* | Video minh họa quy trình sử dụng Agent Skill |
| 🤖 **Hồ sơ Tuân thủ AI (MD + PDF)** | [`AI/AI_Audit.md`](AI/AI_Audit.md) ([`PDF`](AI/AI_Audit.pdf)) \| [`AI/AI_Critical.md`](AI/AI_Critical.md) ([`PDF`](AI/AI_Critical.pdf)) | Minh bạch quy trình cộng tác AI Bloom-AI |

---

## 4. Cấu Trúc Cây Thư Mục Nộp Bài (Project Tree Map)

```text
Homework/Week03/
├── .git/                                                # Git local repository
├── .gitignore                                           # Cấu hình bỏ qua file rác, file tạm
├── git-commit-log.txt                                   # Lịch sử Git commit chi tiết từng giai đoạn
├── README.md                                            # Bảng điều khiển trung tâm & Test Summary Report
├── requirement/                                         # Đề bài và văn bản trích xuất yêu cầu
│   ├── 2026.HW03.GUI Usability_En.pdf
│   └── extracted_requirement.txt
├── reports/                                             # Các báo cáo kỹ thuật tổng hợp (Markdown + PDF)
│   ├── 00_scope_selection_overview.md                   # Tổng quan phạm vi, kịch bản Usability & Cross-Platform
│   ├── 01_GUI_Checklist_Report.md                       # Báo cáo thực thi GUI Checklist & AI Gap
│   ├── 02_Usability_Evaluation_Report.md                # Báo cáo đánh giá trải nghiệm 7 người dùng
│   ├── 03_cross_platform_report.md                      # Báo cáo kiểm thử đa nền tảng
│   └── HW03_Final_Report.pdf                            # Bản PDF xuất bản hoàn chỉnh
├── checklist/                                           # Bảng kiểm thử GUI Checklist
│   ├── GUI_Checklist.xlsx                               # File Excel 48 checklist items (22 Pass / 26 Fail)
│   └── GUI_Checklist.md                                 # Bản Markdown tra cứu nhanh
├── usability/                                           # Hồ sơ thực nghiệm Usability
│   ├── 01_usability_plan.md                             # Kế hoạch & kịch bản 3 nhiệm vụ Goal-Oriented
│   ├── 02_participants_and_pilot.md                     # Hồ sơ 7 người tham gia (che 4 số giữa) & Pilot P00
│   ├── 03_observation_notes.md                          # Ghi chép quan sát từng ca kiểm thử & 4 Probes
│   ├── 04_sus_scoring_matrix.xlsx                       # Bảng tính điểm SUS 7 người dùng (giá trị tính sẵn)
│   └── SUS_Responses.xlsx                               # Bản đồng bộ bảng điểm SUS
├── cross-platform/                                      # Ảnh chụp 4 nền tảng kèm email watermark
│   └── *.png                                            # 16 ảnh (Chrome, Firefox, WebKit, Mobile Emulation)
├── bugs/                                                # Hồ sơ quản lý lỗi phần mềm
│   ├── bug_reports.md                                   # Chi tiết 26 defect, log lỗi, root cause
│   └── github_issues_ready_to_post.md                   # Bộ 26 mẫu GitHub Issues sẵn sàng đăng tải
├── proof-image/                                         # Kho ảnh bằng chứng
│   └── checklist/                                       # 26 ảnh minh chứng độc lập cho 26 items Failed
├── tests/                                               # Bộ kiểm thử tự động Playwright
│   ├── gui_checklist_execution.spec.js                  # Test suite có assertion thật & seed dữ liệu qua API
│   ├── manual_test_guide.md                             # Hướng dẫn kiểm thử thủ công
│   └── results/gui_checklist_results.json               # Kết quả thực thi JSON
├── skills/                                              # 2 Agent Skills phục vụ kiểm thử tự động
│   ├── gui-checklist-tester/
│   └── usability-evaluator/
├── AI/                                                  # Minh chứng tuân thủ chính sách AI (Markdown + PDF)
│   ├── AI_Audit.md
│   ├── AI_Audit.pdf
│   ├── AI_Critical.md
│   └── AI_Critical.pdf
└── ai-templates/                                        # 6 Biểu mẫu AI tuân thủ FIT@HCMUS
```

---

## 5. Cam Kết Liêm Chính Học Thuật & Quy Chuẩn Kiểm Thử

Sinh viên **Trần Đại Hiệp** (MSSV: 23120256) xin cam kết:
1. **Minh Bạch Hình Ảnh Bằng Chứng:** Toàn bộ 26 hình ảnh trong `proof-image/checklist/` là ảnh chụp trực tiếp từ phiên chạy SUT thật qua API viewport của Playwright (mỗi lỗi một ảnh độc lập, khoanh đỏ phần tử lỗi bằng CSS trực tiếp trên DOM, không qua chỉnh sửa ảnh rời; do dùng API viewport của Playwright nên ảnh không bao gồm thanh URL của hệ điều hành). Ảnh kiểm thử Task 3 trong `cross-platform/` mang watermark email chính thức `23120256@student.hcmus.edu.vn`.
2. **Dữ Liệu Người Dùng Thật 100%:** 7 người tham gia đánh giá Usability là người thật bên ngoài lớp học, bảo mật bằng cách che 4 số giữa liên lạc, sẵn sàng phối hợp khi Giảng viên hoặc TA gọi điện ngẫu nhiên 2 người để thẩm định.
3. **Sử Dụng AI Minh Bạch & Phản Biện:** Áp dụng AI theo cấp độ phân tích và hợp tác (Bloom-AI G9.3 & G9.4), con người trực tiếp rà soát và kiểm chứng thực tế, ghi lại toàn bộ lịch sử trong `AI/AI_Audit.md` và viết bài phê bình trong `AI/AI_Critical.md`.

---
*Báo cáo được biên soạn và bảo chứng bởi sinh viên Trần Đại Hiệp (MSSV: 23120256).*

---

## 6. Test Summary Report (theo §14 của đề)

| Chỉ số | Giá trị |
|:---|:---:|
| Số màn hình / tab đã kiểm thử (GUI checklist) | 4 (Dashboard, Sản phẩm & CSV, Mã giảm giá, Đơn hàng) |
| Số luồng usability | 1 (3 mục tiêu: tạo coupon → import CSV → xử lý đơn) |
| Checklist items: designed / executed / passed / failed | 48 / 48 / 22 / 26 |
| Phân bố IA-01 / IA-02 / IA-03 / IA-04 | 12 / 13 / 9 / 14 |
| Số bug | 26 (`BUG_ADMIN_01` → `28`, trừ `17` và `20` đã rút lại), xem `bugs/bug_reports.md` |
| Số participants | 7 + 1 pilot |
| Nền tảng cross-platform | Chrome, Firefox, WebKit (Playwright) + Pixel 7 emulation, chạy local |
| Demo video | **Chưa có** (cần quay và dán link YouTube thật) |
| GitHub Issues | **26 Issues đã đăng kèm ảnh** tại [`Hidebray/Homework-week03-SoftwareTesting/issues`](https://github.com/Hidebray/Homework-week03-SoftwareTesting/issues) ([Ảnh chụp trang Issues](proof-image/github_issues_list.png)) |

> Lưu ý trung thực: Task 3 hiện dùng trình duyệt giả lập cục bộ, không phải BrowserStack/LambdaTest hay thiết bị thật.
