import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, CalendarDays, Check, Clock3, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { services, specialties } from '@/lib/data';
import { DoctorShowcase, EditorialJournal } from './EditorialContent';
import { SectionHead } from './SiteShell';
import { spring, useMotionMode } from './motion/system';

function HomeReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { reduced } = useMotionMode();
  return <motion.div initial={reduced ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .16 }} transition={{ ...spring, delay }}>{children}</motion.div>;
}

function HomeHero() {
  const { reduced } = useMotionMode();
  return <section className="home-hero">
    <div className="home-hero-grid container">
      <div className="home-hero-copy">
        <HomeReveal><p className="eyebrow">Hoàng Khanh Medical <span/> Phòng khám chuyên khoa</p></HomeReveal>
        <HomeReveal delay={.04}><h1>Chăm sóc sức khỏe bắt đầu từ <em>lắng nghe.</em></h1></HomeReveal>
        <HomeReveal delay={.08}><p className="home-hero-intro">Tìm hiểu chuyên khoa, đội ngũ và dịch vụ; chủ động chọn khung giờ khám phù hợp với bạn.</p></HomeReveal>
        <HomeReveal delay={.12}><div className="home-hero-actions"><Link href="/dat-lich" className="button button-dark button-lg">Đặt lịch khám <ArrowUpRight aria-hidden="true" size={18}/></Link><Link href="/chuyen-khoa" className="home-text-link">Tìm chuyên khoa <ArrowRight aria-hidden="true" size={17}/></Link></div></HomeReveal>
        <div className="home-hero-meta"><span><MapPin aria-hidden="true"/> 621 Hùng Vương, Chư Sê, Gia Lai</span><a href="tel:0914010104"><Phone aria-hidden="true"/> 0914 010 104</a></div>
      </div>
      <motion.figure className="home-hero-visual" initial={reduced ? false : { opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...spring, delay: .12 }}>
        <div className="home-hero-image"><Image src="/images/doctor-hero.png" alt="Hình minh họa hoạt động chăm sóc y tế" fill priority sizes="(max-width: 900px) 100vw, 48vw"/></div>
        <figcaption><ShieldCheck aria-hidden="true"/><span>Ảnh minh họa; không phải bằng chứng về bác sĩ hoặc cơ sở thực tế.</span></figcaption>
        <span className="home-visual-index" aria-hidden="true">HKM <i/> GIA LAI</span>
      </motion.figure>
    </div>
  </section>;
}

function ClinicFacts() {
  return <section className="clinic-facts container" aria-label="Thông tin phòng khám">
    <div><span className="fact-icon"><MapPin aria-hidden="true"/></span><p><small>Địa điểm</small><b>621 Hùng Vương<br/>Chư Sê, Gia Lai</b></p></div>
    <div><span className="fact-icon"><Clock3 aria-hidden="true"/></span><p><small>Giờ tiếp nhận</small><b>Vui lòng gọi để xác nhận<br/>giờ khám phù hợp</b></p></div>
    <div><span className="fact-icon"><CalendarDays aria-hidden="true"/></span><p><small>Đặt lịch trực tuyến</small><b>Chọn ngày và khung giờ<br/>còn trống trong hệ thống</b></p></div>
  </section>;
}

function SpecialtyGrid() {
  return <section className="home-specialties home-section container">
    <SectionHead eyebrow="Chăm sóc đa chuyên khoa" title="Bắt đầu từ điều bạn đang cần." action={<Link href="/chuyen-khoa" className="home-text-link">Tất cả chuyên khoa <ArrowUpRight aria-hidden="true" size={17}/></Link>}/>
    <div className="home-specialty-grid">
      {specialties.map((specialty, index) => <HomeReveal key={specialty.slug} delay={index * .025}>
        <Link href={`/chuyen-khoa/${specialty.slug}`} className={`home-specialty-card${index === 0 ? ' is-featured' : ''}`}>
          <span className="home-card-number">0{index + 1}</span><span className="home-specialty-icon"><specialty.icon aria-hidden="true" strokeWidth={1.6}/></span>
          <span className="home-specialty-content"><small>{specialty.eyebrow}</small><b>{specialty.name}</b><span>{specialty.desc}</span></span><ArrowUpRight className="home-card-arrow" aria-hidden="true" size={19}/>
        </Link>
      </HomeReveal>)}
    </div>
  </section>;
}

function CareSteps() {
  const steps = [
    ['01', 'Chọn nhu cầu', 'Tìm chuyên khoa và bác sĩ phù hợp với nhu cầu thăm khám.', '/chuyen-khoa'],
    ['02', 'Chọn thời gian', 'Xem khung giờ hiện có và chọn lịch thuận tiện cho bạn.', '/dat-lich'],
    ['03', 'Xác nhận lịch', 'Kiểm tra lại lựa chọn trước khi gửi yêu cầu đặt lịch.', '/dat-lich'],
  ];
  return <section className="home-care-band"><div className="container home-care-layout">
    <div className="home-care-intro"><p className="eyebrow light">Một hành trình rõ ràng</p><h2>Từng bước nhỏ,<br/><em>chủ động hơn.</em></h2><p>Thông tin và các bước đặt lịch được trình bày trước khi bạn xác nhận.</p><Link href="/dat-lich" className="button button-lime">Bắt đầu đặt lịch <ArrowUpRight aria-hidden="true" size={18}/></Link></div>
    <ol className="home-care-steps">{steps.map(([number, title, copy, href]) => <li key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p><Link href={href} aria-label={`${title} — xem chi tiết`}>Xem bước này <ArrowRight aria-hidden="true" size={16}/></Link></div><Check aria-hidden="true" className="home-step-check"/></li>)}</ol>
  </div></section>;
}

function ServiceGrid() {
  return <section className="home-services home-section container">
    <SectionHead eyebrow="Dịch vụ y tế" title="Thông tin trước khi bạn lựa chọn." action={<Link href="/dich-vu" className="home-text-link">Tất cả dịch vụ <ArrowUpRight aria-hidden="true" size={17}/></Link>}/>
    <div className="home-service-grid">{services.slice(0, 4).map((service, index) => <HomeReveal key={service.slug} delay={index * .03}><Link className="home-service-card" href={`/dich-vu/${service.slug}`}>
      <span className="home-service-top"><span>{service.category}</span><ArrowUpRight aria-hidden="true" size={18}/></span><service.icon aria-hidden="true" className="home-service-icon" strokeWidth={1.5}/><h3>{service.name}</h3><p>{service.desc}</p><span className="home-service-price">{service.price}</span>
    </Link></HomeReveal>)}</div>
  </section>;
}

function BookingCallout() {
  return <section className="home-booking-callout container"><div className="home-booking-copy"><p className="eyebrow">Dành cho bệnh nhân</p><h2>Đặt lịch theo cách <em>thuận tiện với bạn.</em></h2><p>Chọn chuyên khoa, bác sĩ, ngày và khung giờ; bạn sẽ kiểm tra lại thông tin trước khi xác nhận.</p><Link href="/dat-lich" className="button button-dark">Xem các bước đặt lịch <ArrowUpRight aria-hidden="true" size={18}/></Link></div><div className="home-booking-list" aria-label="Các bước trong quy trình đặt lịch"><div><span>01</span><b>Chuyên khoa & bác sĩ</b><Check aria-hidden="true"/></div><div><span>02</span><b>Ngày & khung giờ</b><Check aria-hidden="true"/></div><div><span>03</span><b>Kiểm tra trước khi gửi</b><ArrowRight aria-hidden="true"/></div><p><ShieldCheck aria-hidden="true"/> Lịch chỉ được gửi sau khi bạn chủ động xác nhận.</p></div></section>;
}

export function HomePage() {
  return <div className="premium-home home-redesign">
    <HomeHero/><ClinicFacts/><SpecialtyGrid/><CareSteps/>
    <section className="home-doctors-wrap"><div className="container home-section-label"><p className="eyebrow">Đội ngũ chuyên môn</p><p>Hồ sơ hiển thị theo dữ liệu hiện có; thông tin cần xác minh được ghi chú rõ.</p></div><DoctorShowcase/></section>
    <ServiceGrid/><BookingCallout/>
    <section className="home-journal home-section container"><SectionHead eyebrow="Kiến thức y khoa" title="Hiểu cơ thể, sống chủ động hơn." action={<Link href="/tin-tuc" className="home-text-link">Tất cả bài viết <ArrowUpRight aria-hidden="true" size={17}/></Link>}/><p className="home-draft-note">Các bài viết trên website hiện ở trạng thái bản nháp và cần được duyệt y khoa trước khi công bố.</p><EditorialJournal/></section>
    <section className="home-final-cta"><div className="container"><div><p className="eyebrow light">Khi bạn cần được tư vấn</p><h2>Một cuộc hẹn bắt đầu<br/><em>bằng cuộc trò chuyện.</em></h2></div><div className="home-final-actions"><Link href="/dat-lich" className="button button-lime button-lg">Đặt lịch khám <ArrowUpRight aria-hidden="true" size={18}/></Link><a href="tel:0914010104"><Phone aria-hidden="true" size={18}/> Gọi 0914 010 104</a></div></div></section>
  </div>;
}
