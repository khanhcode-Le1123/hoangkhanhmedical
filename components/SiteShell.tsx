import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowUpRight, CalendarDays, Menu, Phone, Search, X } from 'lucide-react';
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'motion/react';
import { spring, useMotionMode } from './motion/system';
import { RevealText } from './motion/Primitives';
import { nav } from '@/lib/data';

export function Brand({ light = false }: { light?: boolean }) {
  return <Link href="/" className={`brand ${light ? 'brand-light' : ''}`} aria-label="Hoàng Khanh Medical – Trang chủ">
    <span className="brand-mark"><span>H</span><span>K</span></span>
    <span className="brand-copy"><b>Hoàng Khanh</b><small>Medical</small></span>
  </Link>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled,setScrolled]=useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll(); const { reduced } = useMotionMode();
  const menuRef = useRef<HTMLDialogElement>(null); const menuTrigger = useRef<HTMLButtonElement>(null);
  useMotionValueEvent(scrollY, 'change', y => { setScrolled(y > 40); const delta = y - (scrollY.getPrevious() ?? y); if (Math.abs(delta) > 4) setHidden(y > 250 && delta > 0); });
  useEffect(() => { if (!open) return; const dialog = menuRef.current; dialog?.showModal(); const returnFocus = menuTrigger.current; const prior = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { dialog?.close(); document.body.style.overflow = prior; returnFocus?.focus(); }; }, [open]);
  return <motion.header initial={reduced ? false : { y: -20, opacity: 0 }} animate={{ y: hidden && !open && !reduced ? -100 : 0, opacity: 1 }} transition={spring} className={`site-header ${scrolled?'is-scrolled':''}`}>
    <div className="header-inner">
      <Brand />
      <nav className="desktop-nav" aria-label="Điều hướng chính">
        {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
      </nav>
      <div className="header-actions">
        <Link href="/tim-kiem" className="icon-button" aria-label="Tìm kiếm"><Search size={19} /></Link>
        <Link href="/dat-lich" className="button button-dark"><CalendarDays size={18} /> Đặt lịch</Link>
        <button ref={menuTrigger} className="menu-button" aria-label="Mở menu" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(true)}><Menu /></button>
      </div>
    </div>
    <AnimatePresence>{open && <motion.dialog ref={menuRef} onCancel={event => { event.preventDefault(); setOpen(false); }} id="mobile-navigation" className="mobile-menu" role="dialog" aria-modal="true" aria-label="Điều hướng di động" initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-16}}>
      <div className="mobile-menu-top"><Brand light /><button autoFocus aria-label="Đóng menu" onClick={() => setOpen(false)}><X /></button></div>
      <nav>{nav.map(([label, href], i) => <motion.div key={href} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:.05*i}}><Link href={href} onClick={() => setOpen(false)}>{label}<ArrowUpRight /></Link></motion.div>)}</nav>
      <Link href="/dat-lich" onClick={() => setOpen(false)} className="button button-lime">Đặt lịch khám</Link>
    </motion.dialog>}</AnimatePresence>
  </motion.header>;
}

function Footer() {
  return <footer className="footer">
    <div className="footer-lead">
      <p className="eyebrow light">Chăm sóc bắt đầu từ lắng nghe</p>
      <h2>Một cuộc hẹn nhỏ.<br/><em>Một thay đổi lớn.</em></h2>
      <Link href="/dat-lich" className="circle-link" aria-label="Đặt lịch khám"><ArrowUpRight /></Link>
    </div>
    <div className="footer-grid">
      <div><Brand light/><p>Phòng khám chuyên khoa tại Chư Sê, Gia Lai. Thông tin chuyên môn cần được đối chiếu hồ sơ trước khi công bố.</p></div>
      <div><b>Khám phá</b>{nav.slice(0,4).map(([l,h])=><Link key={h} href={h}>{l}</Link>)}</div>
      <div><b>Hỗ trợ</b><Link href="/faq">Câu hỏi thường gặp</Link><Link href="/benh-nhan">Dành cho bệnh nhân</Link><Link href="/lich-hen">Quản lý lịch hẹn</Link></div>
      <div><b>Liên hệ</b><a href="tel:0914010104">0914 010 104</a><span>621 Hùng Vương, Chư Sê, Gia Lai</span><span>Hằng ngày · 07:00–19:00</span></div>
    </div>
    <p className="footer-wordmark" aria-hidden>Hoàng Khanh.</p><div className="footer-bottom"><span>© 2026 Hoàng Khanh Medical</span><span className="legal-links"><Link href="/chinh-sach-bao-mat">Bảo mật</Link><Link href="/dieu-khoan-su-dung">Điều khoản</Link><Link href="/chinh-sach-dat-lich">Đặt lịch</Link></span></div>
  </footer>;
}

export function SiteShell({ children, bare = false }: { children: React.ReactNode; bare?: boolean }) {
  const { scrollYProgress } = useScroll();
  const router = useRouter(); const { reduced } = useMotionMode();
  const content = <AnimatePresence initial={false} mode="wait"><motion.div className="route-stage" key={router.asPath.split('?')[0]} initial={reduced ? false : { opacity: 0, clipPath: 'inset(0 0 2% 0)' }} animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .18 }}>{children}</motion.div></AnimatePresence>;
  if (bare) return content;
  return <><a className="skip-content" href="#main-content">Bỏ qua điều hướng</a><motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }}/><Header/><main id="main-content" tabIndex={-1}>{content}</main><a href="tel:0914010104" className="floating-call" aria-label="Gọi phòng khám 0914 010 104"><Phone size={18}/><span>Gọi phòng khám</span></a><Footer/></>;
}

export function PageHero({ eyebrow, title, copy }: { eyebrow:string; title:string; copy:string }) {
  return <section className="page-hero"><div className="ambient ambient-one"/><div className="container"><p className="eyebrow">{eyebrow}</p><h1><RevealText>{title}</RevealText></h1><p className="page-intro">{copy}</p></div></section>;
}

export function SectionHead({ eyebrow, title, action }: { eyebrow:string; title:string; action?:React.ReactNode }) {
  return <div className="section-head" data-reveal><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>{action}</div>;
}
