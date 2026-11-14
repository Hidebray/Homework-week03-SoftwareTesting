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
| **1** | **Task 1 — GUI Checklist** *(design + execution + bug report)* | • Thiết kế hoàn thiện bộ checklist gồm **48 items** (vượt mức tối thiểu 40 items), bao phủ đủ 4 khía cạnh: `IA-01` (12), `IA-02` (12), `IA-03` (9), `IA-04` (15).<br>• Phân tích khoảng trống AI (**AI Gap Analysis**) làm rõ các khía cạnh AI bỏ sót.<br>• Thực thi trên SUT thật, ghi chú Pass/Fail kèm ảnh chụp lỗi RAW Rule 9.<br>• Báo cáo bug trên Markdown và đồng bộ GitHub Issues.<br>📂 *Minh chứng:* [`reports/01_GUI_Checklist_Report.md`](reports/01_GUI_Checklist_Report.md), [`checklist/GUI_Checklist.xlsx`](checklist/GUI_Checklist.xlsx), [`bugs/bug_reports.md`](bugs/bug_reports.md). | 30 | **30** |
| **2** | **Task 2 — Usability Evaluation** *(task scenario + 7 sessions + analysis)* | • Thiết kế kịch bản mục tiêu mở (Goal-Oriented) cho nhân viên quản lý cửa hàng.<br>• Tiến hành 1 buổi Pilot + **7 buổi kiểm thử trực tiếp với 7 người dùng thật** ngoài lớp học (che 4 số giữa SĐT/Zalo để bảo mật danh tính, sẵn sàng thẩm định).<br>• Đo lường bằng thang đo quốc tế **SUS (System Usability Scale)** 10 câu hỏi của John Brooke kết hợp phỏng vấn sâu 4 khía cạnh.<br>• Phân tích định lượng (Mean SUS) và định tính (phân nhóm Pain points & ma trận mức độ nghiêm trọng).<br>📂 *Minh chứng:* [`reports/02_Usability_Evaluation_Report.md`](reports/02_Usability_Evaluation_Report.md), [`usability/SUS_Responses.xlsx`](usability/SUS_Responses.xlsx). | 40 | **40** |
| **3** | **Task 3 — Cross-Browser / Cross-Platform** *( $\ge$ 3 platforms)* | • Thực thi kiểm thử trên **3 nền tảng độc lập**:<br>  1. Google Chrome Desktop (Windows 11)<br>  2. Mozilla Firefox Desktop (Windows 11)<br>  3. Google Chrome trên điện thoại thật (kết nối qua IP LAN)<br>• Ảnh bằng chứng chụp RAW theo Rule 9, có **watermark email `23120256@student.hcmus.edu.vn`** và hiển thị rõ URL trình duyệt.<br>📂 *Minh chứng:* [`reports/03_Cross_Platform_Report.md`](reports/03_Cross_Platform_Report.md), [`proof-image/cross-platform/`](proof-image/cross-platform/). | 20 | **20** |
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
- **Mật khẩu:** `admin123`

---

## 3. Bảng Điều Khiển Tổng Kết & Liên Kết Nhanh (Dashboard)

| Hạng Mục | Đường Dẫn Minh Chứng | Trạng Thái / Ghi Chú |
|:---|:---|:---|
| 📋 **Tài liệu Đặc tả Phạm vi** | [`reports/00_scope_selection_overview.md`](reports/00_scope_selection_overview.md) | Phân định ranh giới 4 tab, định hướng IA và kịch bản SUS |
| 📊 **Checklist Kiểm Thử GUI** | [`checklist/GUI_Checklist.xlsx`](checklist/GUI_Checklist.xlsx) | Bộ 48 items kiểm định giao diện và trạng thái |
| 📝 **Báo cáo Thực thi Checklist** | [`reports/01_GUI_Checklist_Report.md`](reports/01_GUI_Checklist_Report.md) | Kết quả Passed/Failed, AI Gap Analysis |
| 👥 **Báo cáo Khảo Sát Usability** | [`reports/02_Usability_Evaluation_Report.md`](reports/02_Usability_Evaluation_Report.md) | Đánh giá 7 người dùng thực tế theo chuẩn SUS |
| 🌐 **Báo cáo Cross-Platform** | [`reports/03_Cross_Platform_Report.md`](reports/03_Cross_Platform_Report.md) | Đối chiếu Chrome, Firefox, Chrome Mobile qua LAN |
| 🐛 **Theo dõi Lỗi (Defects)** | [`bugs/bug_reports.md`](bugs/bug_reports.md) \| [GitHub Issues Tracker](https://github.com/ttbhanh/eshop-sut/issues) | Danh sách lỗi kèm log và ảnh Rule 9 |
| 🎥 **Video Demo YouTube** | *[https://youtu.be/placeholder-demo-hw03](https://youtu.be/placeholder-demo-hw03)* | Video minh họa quy trình sử dụng Agent Skill |
| 🤖 **Hồ sơ Tuân thủ AI** | [`AI/AI_Audit.md`](AI/AI_Audit.md) \| [`AI/AI_Critical.md`](AI/AI_Critical.md) | Minh bạch quy trình cộng tác AI Bloom-AI |

---

## 4. Cấu Trúc Cây Thư Mục Nộp Bài (Project Tree Map)

```text
Homework/Week03/
├── .git/                                                # Git local repository
├── .gitignore                                           # Cấu hình bỏ qua file rác, file tạm
├── git-commit-log.txt                                   # Lịch sử Git commit chi tiết từng giai đoạn
├── README.md                                            # Bảng điều khiển trung tâm & Tự đánh giá 100đ
├── requirement/                                         # Đề bài và văn bản trích xuất yêu cầu
│   ├── 2026.HW03.GUI Usability_En.pdf
│   └── extracted_requirement.txt
├── reports/                                             # Các báo cáo kỹ thuật tổng hợp
│   ├── 00_scope_selection_overview.md                   # Tổng quan phạm vi, kịch bản Usability & Cross-Platform
│   ├── 01_GUI_Checklist_Report.md                       # Báo cáo thực thi GUI Checklist & AI Gap
│   ├── 02_Usability_Evaluation_Report.md                # Báo cáo đánh giá trải nghiệm 7 người dùng
│   ├── 03_Cross_Platform_Report.md                      # Báo cáo kiểm thử đa nền tảng
│   └── HW03_Final_Report.pdf                            # Bản PDF xuất bản hoàn chỉnh
├── checklist/                                           # Bảng kiểm thử GUI Checklist
│   ├── GUI_Checklist.xlsx                               # File Excel 48 checklist items
│   └── GUI_Checklist.md                                 # Bản Markdown tra cứu nhanh
├── usability/                                           # Hồ sơ thực nghiệm Usability
│   ├── SUS_Responses.xlsx                               # Bảng tính điểm SUS 7 người dùng
│   ├── observation_notes.md                             # Ghi chép chi tiết từng ca kiểm thử
│   └── participants_list.md                             # Danh sách 7 người dùng (che 4 số giữa)
├── cross-platform/                                      # Báo cáo tương thích trình duyệt
│   └── cross_platform_matrix.md                         # Ma trận so sánh Chrome, Firefox, Edge
├── bugs/                                                # Hồ sơ quản lý lỗi phần mềm
│   └── bug_reports.md                                   # Chi tiết defect, log lỗi, root cause
├── proof-image/                                         # Kho ảnh bằng chứng nguyên bản Rule 9
│   ├── checklist/                                       # Ảnh minh chứng các items Failed
│   ├── usability/                                       # Ảnh/Video ghi hình thao tác người dùng
│   └── cross-platform/                                  # Ảnh chụp 3 trình duyệt kèm email watermark
├── skills/                                              # Agent Skills phục vụ kiểm thử tự động
│   ├── gui-checklist-tester/
│   │   └── SKILL.md
│   └── demo_guide.md                                    # Kịch bản demo quay video
├── AI/                                                  # Minh chứng tuân thủ chính sách AI
│   ├── AI_Audit.md                                      # Toàn bộ nhật ký đối thoại prompt-output
│   └── AI_Critical.md                                   # Bài luận phê bình AI (200-300 từ)
└── ai-templates/                                        # 6 Biểu mẫu AI tuân thủ FIT@HCMUS
    ├── [AI-01] - FIT@HCMUS - AI Agreement_En.docx
    ├── [AI-02] - FIT@HCMUS - AI Audit Report_En.docx
    ├── [AI-03] - FIT@HCMUS - AI Disclosure Form_En.docx
    ├── [AI-04] - FIT@HCMUS - AI Reflective Statement_En.docx
    ├── [AI-05] - FIT@HCMUS - AI Privacy Checklist_En.docx
    └── [AI-06] - FIT@HCMUS - AI Student Acknowledgement_En.docx
```

---

## 5. Cam Kết Liêm Chính Học Thuật & Quy Chuẩn Kiểm Thử

Sinh viên **Trần Đại Hiệp** (MSSV: 23120256) xin cam kết:
1. **Tuân thủ Tuyệt đối Rule 9 (Screenshot Integrity):** 100% hình ảnh trong `proof-image/` là ảnh RAW nguyên bản được chụp trực tiếp từ SUT thật, không cắt cúp làm mất thanh URL `localhost:5174`, không qua chỉnh sửa đồ họa hay dùng AI sinh ảnh. Ảnh kiểm thử Task 3 mang watermark email chính thức `23120256@student.hcmus.edu.vn`.
2. **Dữ Liệu Người Dùng Thật 100%:** 7 người tham gia đánh giá Usability là người thật bên ngoài lớp học, bảo mật bằng cách che 4 số giữa liên lạc, sẵn sàng phối hợp khi Giảng viên hoặc TA gọi điện ngẫu nhiên 2 người để thẩm định.
3. **Sử Dụng AI Minh Bạch & Phản Biện:** Áp dụng AI theo cấp độ phân tích và hợp tác (Bloom-AI G9.3 & G9.4), con người trực tiếp rà soát và kiểm chứng thực tế, ghi lại toàn bộ lịch sử trong `AI/AI_Audit.md` và viết bài phê bình trong `AI/AI_Critical.md`.

---
*Báo cáo được biên soạn và bảo chứng bởi sinh viên Trần Đại Hiệp (MSSV: 23120256).*
