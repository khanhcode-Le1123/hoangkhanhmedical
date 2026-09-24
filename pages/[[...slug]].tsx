import Head from 'next/head';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { HomePage } from '@/components/HomePage';
import { SiteShell } from '@/components/SiteShell';
import { AboutPage, AdminPage, BookingPage, ContactPage, DetailPage, ListingPage, PatientPage, SearchPage } from '@/components/InnerPages';
import { routePaths } from '@/lib/data';

type Props = { path: string };

const adminMap:Record<string,string> = {'admin':'Tổng quan','admin/bac-si':'Bác sĩ','admin/chuyen-khoa':'Chuyên khoa','admin/dich-vu':'Dịch vụ','admin/lich-kham':'Lịch khám','admin/bai-viet':'Bài viết','admin/benh-nhan':'Bệnh nhân','admin/noi-dung':'Nội dung'};

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
  else if (path in adminMap) { page = <AdminPage section={adminMap[path]}/>; bare = true; }
  else page = <HomePage/>;
  return <><Head><title>Hoàng Khanh Medical — Y khoa tận tâm</title><meta name="description" content="Hệ thống phòng khám chuyên khoa và xét nghiệm BSL-2 tại Chư Sê, Gia Lai."/><meta name="viewport" content="width=device-width, initial-scale=1"/><link rel="icon" href="/favicon.svg"/></Head><SiteShell bare={bare}>{page}</SiteShell></>;
}

export const getStaticPaths:GetStaticPaths = async () => ({ paths: routePaths.map(path => ({ params: { slug: path ? path.split('/') : [] } })), fallback: false });
export const getStaticProps:GetStaticProps<Props> = async ({ params }) => ({ props: { path: Array.isArray(params?.slug) ? params.slug.join('/') : '' } });
