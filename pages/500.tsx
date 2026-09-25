import Link from 'next/link';
import Head from 'next/head';

export default function ErrorPage() {
  return <><Head><title>Đã có lỗi | Hoàng Khanh Medical</title><meta name="robots" content="noindex"/></Head><main className="not-found container"><p className="eyebrow">Không thể tải trang</p><h1>Vui lòng thử lại sau.</h1><p>Nếu bạn cần hỗ trợ đặt lịch, vui lòng gọi hotline của phòng khám.</p><Link href="/" className="button button-dark">Về trang chủ</Link></main></>;
}
