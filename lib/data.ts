import { Baby, Bone, Ear, HeartPulse, Microscope, Scan, Stethoscope, Venus } from 'lucide-react';

export const specialties = [
  { slug: 'noi-tong-quat', name: 'Nội tổng quát', eyebrow: 'Chăm sóc toàn diện', icon: Stethoscope, desc: 'Thăm khám, chẩn đoán và quản lý sức khỏe lâu dài cho người trưởng thành.', metric: '20+ bệnh lý' },
  { slug: 'nhi-khoa', name: 'Nhi khoa', eyebrow: 'Đồng hành cùng trẻ', icon: Baby, desc: 'Chăm sóc trẻ từ sơ sinh đến thiếu niên trong một không gian thân thiện.', metric: '0–16 tuổi' },
  { slug: 'san-phu-khoa', name: 'Sản phụ khoa', eyebrow: 'An tâm làm mẹ', icon: Venus, desc: 'Khám phụ khoa, quản lý thai kỳ và tư vấn sức khỏe sinh sản riêng tư.', metric: 'Thai kỳ 360°' },
  { slug: 'tim-mach', name: 'Tim mạch', eyebrow: 'Nhịp sống khỏe', icon: HeartPulse, desc: 'Sàng lọc nguy cơ, điện tim, siêu âm tim và quản lý bệnh mạn tính.', metric: 'Theo dõi dài hạn' },
  { slug: 'tai-mui-hong', name: 'Tai mũi họng', eyebrow: 'Thăm khám chuyên sâu', icon: Ear, desc: 'Nội soi và điều trị các vấn đề tai, mũi, họng ở cả trẻ em và người lớn.', metric: 'Nội soi HD' },
  { slug: 'chan-doan-hinh-anh', name: 'Chẩn đoán hình ảnh', eyebrow: 'Rõ hơn để đúng hơn', icon: Scan, desc: 'Siêu âm tổng quát, tim mạch và thai 4D với quy trình kiểm soát chất lượng.', metric: 'Hình ảnh độ nét cao' },
];

export const doctors = [
  { slug: 'le-van-phuc', name: 'BS. CKI Lê Văn Phúc', specialty: 'Nội tổng quát', exp: '18 năm kinh nghiệm', focus: 'Nội khoa · Tim mạch · Bệnh mạn tính', quote: 'Lắng nghe kỹ là bước đầu của một chẩn đoán đúng.' },
  { slug: 'nguyen-bao-ngoc', name: 'BS. Nguyễn Bảo Ngọc', specialty: 'Nhi khoa', exp: '10 năm kinh nghiệm', focus: 'Nhi tổng quát · Dinh dưỡng', quote: 'Mỗi em bé cần một cách tiếp cận riêng.' },
  { slug: 'tran-thi-hong', name: 'BS. CKI Trần Thị Hồng', specialty: 'Sản phụ khoa', exp: '14 năm kinh nghiệm', focus: 'Thai kỳ · Sức khỏe phụ nữ', quote: 'An tâm của người bệnh là một phần của điều trị.' },
  { slug: 'dang-anh-tuan', name: 'ThS. BS Đặng Anh Tuấn', specialty: 'Tim mạch', exp: '12 năm kinh nghiệm', focus: 'Siêu âm tim · Tăng huyết áp', quote: 'Phòng ngừa luôn tốt hơn can thiệp muộn.' },
];

export const services = [
  { slug: 'kham-noi-tong-quat', name: 'Khám nội tổng quát', category: 'Khám lâm sàng', price: '200.000đ', icon: Stethoscope, desc: 'Đánh giá sức khỏe toàn diện, tư vấn xét nghiệm và kế hoạch theo dõi.' },
  { slug: 'goi-tam-soat-tim-mach', name: 'Gói tầm soát tim mạch', category: 'Gói chăm sóc', price: '1.250.000đ', icon: HeartPulse, desc: 'Khám chuyên khoa, điện tim, siêu âm tim và xét nghiệm nguy cơ.' },
  { slug: 'sieu-am-thai-4d', name: 'Siêu âm thai 4D', category: 'Chẩn đoán hình ảnh', price: '350.000đ', icon: Scan, desc: 'Theo dõi sự phát triển của thai với hình ảnh độ phân giải cao.' },
  { slug: 'xet-nghiem-tong-quat', name: 'Xét nghiệm tổng quát', category: 'Xét nghiệm BSL-2', price: 'Từ 490.000đ', icon: Microscope, desc: 'Các chỉ số nền tảng với quy trình lấy mẫu và trả kết quả rõ ràng.' },
  { slug: 'kham-co-xuong-khop', name: 'Khám cơ xương khớp', category: 'Khám chuyên khoa', price: '220.000đ', icon: Bone, desc: 'Đánh giá đau và vận động, cá nhân hóa kế hoạch phục hồi.' },
];

export const articles = [
  { slug: 'hieu-dung-ve-tang-huyet-ap', category: 'Tim mạch', date: '18.09.2026', title: 'Hiểu đúng về tăng huyết áp: điều cần biết trước khi quá muộn', excerpt: 'Nhận biết các chỉ số, yếu tố nguy cơ và thời điểm cần gặp bác sĩ.' },
  { slug: 'cham-soc-tre-khi-giao-mua', category: 'Nhi khoa', date: '12.09.2026', title: 'Chăm sóc trẻ khi giao mùa: một hướng dẫn thực tế', excerpt: 'Giấc ngủ, dinh dưỡng và dấu hiệu cảnh báo phụ huynh không nên bỏ qua.' },
  { slug: 'kham-suc-khoe-dinh-ky', category: 'Y học dự phòng', date: '05.09.2026', title: 'Khám sức khỏe định kỳ không chỉ để tìm bệnh', excerpt: 'Một cuộc hẹn đúng lúc giúp bạn hiểu cơ thể và chủ động hơn mỗi ngày.' },
];

export const nav = [
  ['Giới thiệu', '/gioi-thieu'], ['Chuyên khoa', '/chuyen-khoa'], ['Dịch vụ', '/dich-vu'],
  ['Bác sĩ', '/bac-si'], ['Kiến thức', '/tin-tuc'], ['Liên hệ', '/lien-he'],
];

export const routePaths = [
  '', 'gioi-thieu', 'chuyen-khoa', ...specialties.map(x => `chuyen-khoa/${x.slug}`),
  'dich-vu', ...services.map(x => `dich-vu/${x.slug}`),
  'bac-si', ...doctors.map(x => `bac-si/${x.slug}`), 'dat-lich',
  'tin-tuc', ...articles.map(x => `tin-tuc/${x.slug}`), 'tim-kiem', 'lien-he', 'faq',
  'benh-nhan', 'dang-nhap', 'dang-ky', 'lich-hen', 'admin', 'admin/bac-si',
  'admin/chuyen-khoa', 'admin/dich-vu', 'admin/lich-kham', 'admin/bai-viet',
  'admin/benh-nhan', 'admin/noi-dung'
];
