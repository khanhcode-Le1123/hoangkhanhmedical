import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowUpRight, CalendarDays, Menu, Phone, Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Lenis from 'lenis';
import { nav } from '@/lib/data';

export function Brand({ light = false }: { light?: boolean }) {
  return <Link href="/" className={`brand ${light ? 'brand-light' : ''}`} aria-label="Hoàng Khanh Medical – Trang chủ">
    <span className="brand-mark"><span>H</span><span>K</span></span>
    <span className="brand-copy"><b>Hoàng Khanh</b><small>Medical</small></span>
  </Link>;
}

function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <div className="header-inner">
      <Brand />
      <nav className="desktop-nav" aria-label="Điều hướng chính">
        {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
      </nav>
      <div className="header-actions">
        <Link href="/tim-kiem" className="icon-button" aria-label="Tìm kiếm"><Search size={19} /></Link>
        <Link href="/dat-lich" className="button button-dark"><CalendarDays size={18} /> Đặt lịch</Link>
        <button className="menu-button" aria-label="Mở menu" onClick={() => setOpen(true)}><Menu /></button>
      </div>
    </div>
    <AnimatePresence>{open && <motion.div className="mobile-menu" initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-16}}>
      <div className="mobile-menu-top"><Brand light /><button aria-label="Đóng menu" onClick={() => setOpen(false)}><X /></button></div>
      <nav>{nav.map(([label, href], i) => <motion.div key={href} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:.05*i}}><Link href={href} onClick={() => setOpen(false)}>{label}<ArrowUpRight /></Link></motion.div>)}</nav>
      <Link href="/dat-lich" className="button button-lime">Đặt lịch khám</Link>
    </motion.div>}</AnimatePresence>
  </header>;
}

function Footer() {
  return <footer className="footer">
    <div className="footer-lead">
      <p className="eyebrow light">Chăm sóc bắt đầu từ lắng nghe</p>
      <h2>Một cuộc hẹn nhỏ.<br/><em>Một thay đổi lớn.</em></h2>
      <Link href="/dat-lich" className="circle-link" aria-label="Đặt lịch khám"><ArrowUpRight /></Link>
    </div>
    <div className="footer-grid">
      <div><Brand light/><p>Hệ thống phòng khám chuyên khoa và xét nghiệm BSL-2 tại Gia Lai.</p></div>
      <div><b>Khám phá</b>{nav.slice(0,4).map(([l,h])=><Link key={h} href={h}>{l}</Link>)}</div>
      <div><b>Hỗ trợ</b><Link href="/faq">Câu hỏi thường gặp</Link><Link href="/benh-nhan">Dành cho bệnh nhân</Link><Link href="/lich-hen">Quản lý lịch hẹn</Link></div>
      <div><b>Liên hệ</b><a href="tel:0914010104">0914 010 104</a><span>621 Hùng Vương, Chư Sê, Gia Lai</span><span>Hằng ngày · 07:00–19:00</span></div>
    </div>
    <div className="footer-bottom"><span>© 2026 Hoàng Khanh Medical</span><span>Thiết kế vì sự an tâm của người bệnh.</span></div>
  </footer>;
}

export function SiteShell({ children, bare = false }: { children: React.ReactNode; bare?: boolean }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    let frame = 0;
    const raf = (time:number) => { lenis.raf(time); frame = requestAnimationFrame(raf); };
    frame = requestAnimationFrame(raf);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => gsap.fromTo(el,{opacity:0,y:36},{opacity:1,y:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}}));
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => gsap.to(el,{yPercent:10,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:true}}));
    });
    return () => { cancelAnimationFrame(frame); lenis.destroy(); ctx.revert(); };
  }, []);
  if (bare) return <>{children}</>;
  return <><Header/><main>{children}</main><a href="tel:0914010104" className="floating-call"><Phone size={18}/><span>Gọi phòng khám</span></a><Footer/></>;
}

export function PageHero({ eyebrow, title, copy }: { eyebrow:string; title:string; copy:string }) {
  return <section className="page-hero"><div className="ambient ambient-one"/><div className="container"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-intro">{copy}</p></div></section>;
}

export function SectionHead({ eyebrow, title, action }: { eyebrow:string; title:string; action?:React.ReactNode }) {
  return <div className="section-head" data-reveal><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>{action}</div>;
}
