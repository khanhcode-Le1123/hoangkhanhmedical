import Link from 'next/link';
import Head from 'next/head';
import { ArrowLeft } from 'lucide-react';
import { SiteShell } from '@/components/SiteShell';

export default function NotFoundPage() {
  return <><Head><title>Không tìm thấy trang | Hoàng Khanh Medical</title><meta name="robots" content="noindex"/></Head><SiteShell><section className="not-found container"><p className="eyebrow">404 · Không tìm thấy</p><h1>Trang này không còn ở đây.</h1><p>Đường dẫn có thể đã thay đổi. Bạn có thể quay về trang chủ hoặc tìm kiếm nội dung cần xem.</p><Link href="/" className="button button-dark"><ArrowLeft/> Về trang chủ</Link></section></SiteShell></>;
}
