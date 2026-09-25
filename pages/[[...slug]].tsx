import Head from 'next/head';
import type { GetServerSideProps } from 'next';
import { HomePage } from '@/components/HomePage';
import { SiteShell } from '@/components/SiteShell';
import { AboutPage, AdminPage, BookingPage, ContactPage, DetailPage, LegalPage, ListingPage, PatientPage, SearchPage } from '@/components/InnerPages';
import { articles, doctors, routePaths, services, specialties } from '@/lib/data';
import { readSessionToken } from '@/lib/auth';

type Props = { path: string };

const adminMap:Record<string,string> = {'admin':'Tổng quan','admin/bac-si':'Bác sĩ','admin/chuyen-khoa':'Chuyên khoa','admin/dich-vu':'Dịch vụ','admin/lich-kham':'Lịch khám','admin/bai-viet':'Bài viết','admin/benh-nhan':'Bệnh nhân','admin/noi-dung':'Nội dung'};

function pageMeta(path:string) {
  const base = 'Hoàng Khanh Medical';
  const staticMeta:Record<string,[string,string]> = {
    '': [`${base} | Phòng khám chuyên khoa tại Gia Lai`, 'Thông tin chuyên khoa, dịch vụ và đặt lịch tại Hoàng Khanh Medical.'],
    'gioi-thieu': [`Giới thiệu | ${base}`, 'Câu chuyện, định hướng và tiêu chuẩn chất lượng của Hoàng Khanh Medical.'],
    'chuyen-khoa': [`Chuyên khoa | ${base}`, 'Tìm hiểu các chuyên khoa và lựa chọn nơi thăm khám phù hợp.'],
    'dich-vu': [`Dịch vụ y tế | ${base}`, 'Thông tin dịch vụ, chuẩn bị và quy trình thăm khám.'],
    'bac-si': [`Đội ngũ bác sĩ | ${base}`, 'Tra cứu hồ sơ chuyên môn đã được phòng khám xác minh.'],
    'tin-tuc': [`Kiến thức y khoa | ${base}`, 'Thông tin sức khỏe tham khảo, không thay thế tư vấn trực tiếp.'],
    'dat-lich': [`Đặt lịch khám | ${base}`, 'Chọn chuyên khoa, bác sĩ và khung giờ còn trống.'],
    'lien-he': [`Liên hệ | ${base}`, 'Liên hệ Hoàng Khanh Medical tại Chư Sê, Gia Lai.'],
    'faq': [`Câu hỏi thường gặp | ${base}`, 'Thông tin chung về đặt lịch, khám bệnh, xét nghiệm và kết quả.'],
    'benh-nhan': [`Cổng bệnh nhân | ${base}`, 'Khu vực riêng tư để quản lý thông tin và lịch hẹn.'],
    'lich-hen': [`Quản lý lịch hẹn | ${base}`, 'Xem và quản lý lịch hẹn của bạn.'],
    'dang-nhap': [`Đăng nhập | ${base}`, 'Đăng nhập an toàn vào cổng bệnh nhân Hoàng Khanh Medical.'],
    'dang-ky': [`Đăng ký tài khoản | ${base}`, 'Tạo tài khoản để quản lý lịch hẹn riêng tư.'],
    'chinh-sach-bao-mat': [`Chính sách bảo mật | ${base}`, 'Bản dự thảo chính sách xử lý dữ liệu cần được rà soát pháp lý.'],
    'dieu-khoan-su-dung': [`Điều khoản sử dụng | ${base}`, 'Bản dự thảo điều khoản sử dụng website.'],
    'chinh-sach-dat-lich': [`Chính sách đặt lịch | ${base}`, 'Bản dự thảo chính sách đặt và thay đổi lịch khám.'],
  };
  if (staticMeta[path]) return staticMeta[path];
  const [group, slug] = path.split('/');
  const item = group === 'chuyen-khoa' ? specialties.find(x=>x.slug===slug) : group === 'dich-vu' ? services.find(x=>x.slug===slug) : group === 'bac-si' ? doctors.find(x=>x.slug===slug) : group === 'tin-tuc' ? articles.find(x=>x.slug===slug) : undefined;
  const name = item && ('name' in item ? item.name : item.title);
  const desc = item ? ('desc' in item ? item.desc : 'excerpt' in item ? item.excerpt : item.focus) : undefined;
  return name ? [`${name} | ${base}`, desc || 'Thông tin từ Hoàng Khanh Medical.'] : [`${base}`, 'Thông tin chăm sóc sức khỏe.'];
}

export default function CatchAllPage({ path }: Props) {
  let page: React.ReactNode;
  let bare = false;
  if (!path) page = <HomePage/>;
  else if (path === 'gioi-thieu') page = <AboutPage/>;
  else if (path === 'chuyen-khoa') page = <ListingPage type="specialties"/>;
  else if (path.startsWith('chuyen-khoa/')) page = <DetailPage kind="specialty" slug={path.split('/')[1]}/>;
  else if (path === 'dich-vu') page = <ListingPage type="services"/>;
  else if (path.startsWith('dich-vu/')) page = <DetailPage kind="service" slug={path.split('/')[1]}/>;
  else if (path === 'bac-si') page = <ListingPage type="doctors"/>;
  else if (path.startsWith('bac-si/')) page = <DetailPage kind="doctor" slug={path.split('/')[1]}/>;
  else if (path === 'tin-tuc') page = <ListingPage type="articles"/>;
  else if (path.startsWith('tin-tuc/')) page = <DetailPage kind="article" slug={path.split('/')[1]}/>;
  else if (path === 'dat-lich') { page = <BookingPage/>; bare = true; }
  else if (path === 'tim-kiem') page = <SearchPage/>;
  else if (path === 'lien-he') page = <ContactPage/>;
  else if (path === 'faq') page = <ContactPage faq/>;
  else if (path === 'benh-nhan') page = <PatientPage mode="portal"/>;
  else if (path === 'dang-nhap') { page = <PatientPage mode="login"/>; bare = true; }
  else if (path === 'dang-ky') { page = <PatientPage mode="register"/>; bare = true; }
  else if (path === 'lich-hen') page = <PatientPage mode="appointments"/>;
  else if (path === 'chinh-sach-bao-mat') page = <LegalPage type="privacy"/>;
  else if (path === 'dieu-khoan-su-dung') page = <LegalPage type="terms"/>;
  else if (path === 'chinh-sach-dat-lich') page = <LegalPage type="booking"/>;
  else if (path in adminMap) { page = <AdminPage section={adminMap[path]}/>; bare = true; }
  else page = <HomePage/>;
  const [title, description] = pageMeta(path);
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://hoangkhanhmedical.vercel.app';
  const canonical = `${origin}${path ? `/${path}` : ''}`;
  const clinicSchema = { '@context':'https://schema.org', '@type':'MedicalClinic', name:'Hoàng Khanh Medical', url:origin, telephone:'+84914010104', address:{'@type':'PostalAddress',streetAddress:'621 Hùng Vương',addressLocality:'Chư Sê',addressRegion:'Gia Lai',addressCountry:'VN'} };
  return <><Head><title>{title}</title><meta name="description" content={description}/><meta name="viewport" content="width=device-width, initial-scale=1"/><link rel="canonical" href={canonical}/><link rel="icon" href="/favicon.svg"/><meta property="og:type" content="website"/><meta property="og:title" content={title}/><meta property="og:description" content={description}/><meta property="og:url" content={canonical}/><meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content={title}/><meta name="twitter:description" content={description}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(clinicSchema)}}/></Head><SiteShell bare={bare}>{page}</SiteShell></>;
}

export const getServerSideProps:GetServerSideProps<Props> = async ({ params, req }) => {
  const path = Array.isArray(params?.slug) ? params.slug.join('/') : '';
  if (!routePaths.includes(path)) return { notFound: true };
  const token = req.cookies.hk_session;
  const session = token ? readSessionToken(token) : null;
  if ((path === 'benh-nhan' || path === 'lich-hen') && (!session || session.role !== 'PATIENT')) return { redirect: { destination: `/dang-nhap?next=/${path}`, permanent: false } };
  if (path in adminMap && (!session || !['ADMIN','EDITOR','DOCTOR'].includes(session.role))) return { redirect: { destination: '/dang-nhap?next=/admin', permanent: false } };
  return { props: { path } };
};
