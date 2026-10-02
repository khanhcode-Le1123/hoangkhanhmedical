import Image from 'next/image';
import dynamic from 'next/dynamic';
import { DoctorShowcase, EditorialJournal } from './EditorialContent';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Plus } from 'lucide-react';
import { AnimatePresence, motion, useInView, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react';
import { services, specialties } from '@/lib/data';
import { SectionHead } from './SiteShell';
import { DepthSurface, ImageReveal, MagneticButton, RevealText } from './motion/Primitives';
import { depthSpring, editorial, spring, useMotionMode } from './motion/system';

const SpatialGallery = dynamic(() => import('./SpatialGallery'), { loading: () => <div className="spatial-gallery" aria-hidden><figure/><figure/><figure/></div> });

const imagery = ['/images/doctor-hero.png', '/images/medical-team.png', '/images/clinic-interior.png'];
const imageNote = 'Hình ảnh minh họa · Chưa xác nhận cơ sở thực tế';

function CinematicHero() {
  const ref = useRef<HTMLElement>(null); const { cinematic, reduced, pointer } = useMotionMode();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const p = useSpring(scrollYProgress, depthSpring);
  const scale = useTransform(p, [0, .8], [1, 1.17]);
  const clipPath = useTransform(p, [0, .6], ['inset(0% 4% 0% 4% round 160px 160px 12px 12px)', 'inset(0% 0% 0% 0% round 12px 12px 12px 12px)']);
  const copyY = useTransform(p, [0, .7], [0, -95]);
  const opacity = useTransform(p, [0, .6], [1, 0]);
  const floatY = useTransform(p, [0, 1], [0, -150]);
  const imageY = useTransform(p, [0, 1], [0, 55]);
  const px = useSpring(0, depthSpring), py = useSpring(0, depthSpring);
  return <section ref={ref} className="cinema-hero" onPointerMove={event => { if (!pointer) return; const r = event.currentTarget.getBoundingClientRect(); px.set((event.clientX / r.width - .5) * 12); py.set((event.clientY / r.height - .5) * 8); }} onPointerLeave={() => { px.set(0); py.set(0); }}>
    <div className="hero-coordinate" aria-hidden>GIA LAI, VIỆT NAM <span>14° N / 108° E</span></div>
    <div className="hero-halo" aria-hidden/>
    <div className="cinema-hero-grid container">
      <motion.div className="cinema-copy" style={cinematic ? { y: copyY, opacity } : {}}>
        <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .1 }}>Hoàng Khanh Medical · Phòng khám chuyên khoa</motion.p>
        <h1><RevealText>Chuyên môn.</RevealText><RevealText delay={.12}>Sự thấu hiểu.</RevealText><RevealText delay={.24}><em>Vì bạn.</em></RevealText></h1>
        <motion.div initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: .4 }}><p className="cinema-intro">Chăm sóc sức khỏe bắt đầu từ lắng nghe.<br/>Tìm chuyên khoa, gặp bác sĩ và chủ động<br className="desktop-break"/> sắp xếp một cuộc hẹn cho chính mình.</p><div className="cinema-actions"><MagneticButton href="/dat-lich">Đặt lịch khám</MagneticButton><Link href="/chuyen-khoa" className="text-link">Tìm chuyên khoa <ArrowRight size={16}/></Link></div></motion.div>
        <div className="hero-signature"><span className="tiny-cross">+</span><span>Y KHOA TẬN TÂM<br/><b>Gần bạn hơn, mỗi ngày.</b></span></div>
      </motion.div>
      <motion.div className="cinema-visual" style={cinematic ? { y: imageY } : {}}>
        <motion.div className="hero-photo" style={cinematic ? { clipPath, x: px, y: py } : {}} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={editorial}><motion.div className="image-fill" style={cinematic ? { scale } : {}}><Image src={imagery[0]} alt="Bác sĩ trong không gian y tế — hình ảnh minh họa" fill priority sizes="(max-width: 900px) 100vw, 55vw"/></motion.div><span className="image-disclaimer">Hình ảnh minh họa</span></motion.div>
        <motion.div className="hero-float" style={cinematic ? { y: floatY } : {}} initial={reduced ? false : { scale: .85, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ ...spring, delay: .65 }}><span className="cross-outline">+</span><div><small>MỘT ĐIỂM CHẠM</small><b>Một người đồng hành.</b></div><span className="float-line"/></motion.div>
        <span className="hero-vertical">LẮNG NGHE / THẤU HIỂU / ĐỒNG HÀNH</span>
      </motion.div>
    </div>
    <div className="hero-bottom container"><a href="#care-intro"><ArrowDown size={16}/> KHÁM PHÁ CÁCH CHÚNG TÔI CHĂM SÓC</a><span>621 Hùng Vương · Chư Sê · Gia Lai</span></div>
  </section>;
}

function RollingMetric({ value, label, detail }: { value: string; label: string; detail: string }) {
  const ref = useRef<HTMLDivElement>(null); const seen = useInView(ref, { once: true, amount: .6 }); const { reduced } = useMotionMode();
  return <div ref={ref} className="editorial-metric"><div className="metric-value" aria-label={value}>{value.split('').map((digit, i) => <span className="digit-window" aria-hidden key={i}><motion.span animate={{ y: seen || reduced ? '0%' : '-50%' }} transition={{ ...spring, delay: reduced ? 0 : i * .09 }}><span>{digit}</span><span>{digit}</span></motion.span></span>)}</div><h3>{label}</h3><p>{detail}</p><motion.i initial={{ scaleX: 0 }} animate={{ scaleX: seen ? 1 : 0 }} transition={editorial}/></div>;
}

function ManifestoLine({ children, progress, index }: { children: React.ReactNode; progress: MotionValue<number>; index: number }) {
  const { reduced } = useMotionMode();
  const color = useTransform(progress, [index * .16, index * .16 + .25], ['#a2afa5', '#163e31']);
  const y = useTransform(progress, [index * .16, index * .16 + .25], [12, 0]);
  return <motion.span style={reduced ? {} : { color, y }}>{children}</motion.span>;
}
function Manifesto() {
  const ref = useRef<HTMLElement>(null); const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 70%'] });
  return <section id="care-intro" className="manifesto container" ref={ref}><div className="manifesto-meta"><span className="section-number">01 / TRIẾT LÝ CHĂM SÓC</span><p>Sức khỏe là một hành trình.<br/>Bạn không cần đi một mình.</p><Plus size={40} strokeWidth={1}/></div><h2>{['Chăm sóc y khoa', 'không chỉ là điều trị.', 'Đó là sự thấu hiểu,', 'chính xác,', 'và đồng hành.'].map((line, i) => <ManifestoLine key={line} progress={scrollYProgress} index={i}>{i === 4 ? <em>{line}</em> : line}</ManifestoLine>)}</h2></section>;
}

function SpecialtyPanel({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const item = specialties[index]; const { cinematic } = useMotionMode();
  const center = index / (specialties.length - 1);
  const scale = useTransform(() => 1 - Math.min(1, Math.abs(progress.get() - center) / .2) * .06);
  const opacity = useTransform(() => 1 - Math.min(1, Math.abs(progress.get() - center) / .25) * .35);
  return <motion.article className={`specialty-panel specialty-tone-${index % 3}`} style={cinematic ? { scale, opacity } : {}}><div className="specialty-panel-top"><span>0{index + 1}</span><small>{item.eyebrow}</small><item.icon strokeWidth={1}/></div><div className="specialty-panel-image"><Image src={imagery[index % 3]} alt={`${item.name} — hình ảnh minh họa`} fill sizes="(max-width: 900px) 80vw, 40vw"/><span>Hình ảnh minh họa</span></div><div className="specialty-panel-copy"><h3>{item.name}</h3><p>{item.desc}</p><Link href={`/chuyen-khoa/${item.slug}`} className="panel-link">Tìm hiểu chuyên khoa <ArrowUpRight/></Link></div></motion.article>;
}
function SpecialtiesGallery() {
  const ref = useRef<HTMLElement>(null); const viewportRef = useRef<HTMLDivElement>(null); const trackRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0); const { cinematic } = useMotionMode();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);
  useEffect(() => { const measure = () => { if (trackRef.current && viewportRef.current) setTravel(Math.max(0, trackRef.current.scrollWidth - viewportRef.current.clientWidth)); }; const observer = new ResizeObserver(measure); if (viewportRef.current) observer.observe(viewportRef.current); if (trackRef.current) observer.observe(trackRef.current); measure(); return () => observer.disconnect(); }, []);
  return <section className={`horizontal-specialties ${cinematic ? 'is-cinematic' : ''}`} ref={ref} aria-label="Các chuyên khoa"><div className="specialties-sticky"><div className="container gallery-heading"><div><p className="eyebrow">02 / Chăm sóc đa chuyên khoa</p><h2>Đúng nơi.<br/><em>Đúng sự chăm sóc.</em></h2></div><div><p>Mỗi nhu cầu, một hướng tiếp cận riêng.</p><Link href="/chuyen-khoa" className="text-link">Tất cả chuyên khoa <ArrowUpRight/></Link><a className="skip-gallery" href="#facilities">Bỏ qua bộ sưu tập <ArrowDown size={13}/></a></div></div><div ref={viewportRef} className="specialty-window" tabIndex={0} aria-label="Bộ sưu tập chuyên khoa; cuộn hoặc vuốt để khám phá"><motion.div ref={trackRef} className="specialty-track" style={cinematic ? { x } : {}}>{specialties.map((s, i) => <SpecialtyPanel key={s.slug} index={i} progress={scrollYProgress}/>)}</motion.div></div><div className="gallery-progress container"><span>KHÁM PHÁ CHUYÊN KHOA</span><div><motion.i style={{ scaleX: cinematic ? scrollYProgress : 1 }}/></div><span>06</span></div></div></section>;
}

function Facilities() {
  const ref = useRef<HTMLElement>(null); const { cinematic, reduced } = useMotionMode();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const p = useSpring(scrollYProgress, depthSpring);
  const clipPath = useTransform(p, [0, .5], ['inset(0% 15% 0% 15% round 36px)', 'inset(0% 0% 0% 0% round 0px)']);
  const scale = useTransform(p, [0, 1], [1.04, 1.14]); const y = useTransform(p, [0, 1], [30, -35]);
  return <section id="facilities" ref={ref} className="facility-scene"><motion.div className="facility-frame" style={reduced ? {} : { clipPath }}><motion.div className="image-fill" style={cinematic ? { scale } : {}}><Image src={imagery[2]} alt="Không gian phòng khám — hình ảnh minh họa" fill sizes="100vw"/></motion.div><div className="facility-shade"/><motion.div className="facility-caption container" style={cinematic ? { y } : {}}><p className="eyebrow light">03 / Không gian chăm sóc</p><h2>Một khoảng lặng.<br/><em>Để thấy an tâm.</em></h2><Link href="/gioi-thieu" className="text-link">Khám phá Hoàng Khanh <ArrowUpRight/></Link></motion.div><small className="facility-note">{imageNote}</small></motion.div></section>;
}

const chapters = [
  ['Đặt lịch', 'Bắt đầu theo cách của bạn.', 'Chọn chuyên khoa, bác sĩ và khung giờ khả dụng. Kiểm tra thông tin trước khi gửi yêu cầu.', 'Chọn lịch phù hợp', imagery[0]],
  ['Tiếp nhận', 'Được lắng nghe ngay từ đầu.', 'Chia sẻ lý do khám, thông tin cần thiết và các kết quả đã có để chuẩn bị cho buổi gặp bác sĩ.', 'Chuẩn bị thông tin', imagery[2]],
  ['Thăm khám', 'Hiểu rõ điều cơ thể đang nói.', 'Trao đổi cùng bác sĩ về triệu chứng và những điều bạn quan tâm. Cùng xác định bước tiếp theo.', 'Trao đổi cùng bác sĩ', imagery[0]],
  ['Chẩn đoán', 'Mỗi chỉ định, một lý do.', 'Xét nghiệm và chẩn đoán hình ảnh được cân nhắc theo tình trạng cụ thể. Hãy xác nhận cách chuẩn bị và chi phí.', 'Theo chỉ định chuyên môn', imagery[1]],
  ['Theo dõi', 'Sự chăm sóc còn tiếp nối.', 'Ghi nhớ hướng dẫn, lịch tái khám và cách liên hệ khi cần giải đáp sau buổi khám.', 'Đồng hành sau buổi khám', imagery[2]],
];
function CareJourney() {
  const ref = useRef<HTMLElement>(null); const [active, setActive] = useState(0); const { cinematic, reduced } = useMotionMode();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 25%', 'end 80%'] });
  useMotionValueEvent(scrollYProgress, 'change', p => setActive(Math.min(4, Math.floor(p * 5))));
  return <section className="care-journey container" ref={ref}><div className="care-stage"><p className="eyebrow">04 / Hành trình chăm sóc</p><h2>Từng bước rõ ràng.<br/><em>Từng lần an tâm.</em></h2><div className="care-stage-image"><AnimatePresence initial={false} mode="sync"><motion.div className="care-image-layer" key={cinematic ? active : 0} initial={reduced ? false : { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.06 }} animate={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }} exit={{ opacity: 0, scale: .98 }} transition={{ ...editorial, duration: .6 }}><Image src={chapters[cinematic ? active : 0][4]} alt="Hành trình chăm sóc — hình ảnh minh họa" fill sizes="(max-width: 900px) 100vw, 45vw"/><div className="care-image-overlay"><span>0{(cinematic ? active : 0) + 1}</span><b>{chapters[cinematic ? active : 0][3]}</b></div></motion.div></AnimatePresence><small className="image-disclaimer">Hình ảnh minh họa</small></div><div className="care-track"><motion.i style={{ scaleX: reduced ? 1 : scrollYProgress }}/></div></div><div className="care-chapters">{chapters.map(([label, title, body], i) => <article key={label} className={active === i ? 'active' : ''}><span className="chapter-index">0{i + 1} <i/> {label}</span><h3>{title}</h3><p>{body}</p>{i === 0 && <Link href="/dat-lich" className="text-link">Bắt đầu đặt lịch <ArrowUpRight size={17}/></Link>}</article>)}</div></section>;
}


function DeferredSpatialGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, margin: '700px' });
  return <div ref={ref} className="spatial-gallery-boundary">{visible ? <SpatialGallery/> : <div className="spatial-gallery" aria-label="Bộ ảnh minh họa không gian"><figure/><figure/><figure/></div>}</div>;
}

function Technology() {
  const ref = useRef<HTMLElement>(null); const { reduced } = useMotionMode(); const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 70%'] });
  return <section ref={ref} className="technology-scene"><div className="container technology-heading"><p className="eyebrow light">06 / Khoa học & sự chăm sóc</p><h2>Chính xác trong từng bước.<br/><em>Tận tâm trong từng nhịp.</em></h2><p>Từ thăm khám đến xét nghiệm, mỗi kết quả cần được đặt trong bối cảnh sức khỏe của bạn.</p><Link href="/dich-vu/xet-nghiem-tong-quat" className="text-link">Tìm hiểu quy trình xét nghiệm <ArrowUpRight/></Link></div><svg className="medical-path" viewBox="0 0 1200 150" fill="none" aria-hidden><path d="M0 80H340L365 60L390 100L425 15L465 135L500 80H1200" stroke="currentColor" opacity=".15"/><motion.path d="M0 80H340L365 60L390 100L425 15L465 135L500 80H1200" stroke="currentColor" strokeWidth="2" style={{ pathLength: reduced ? 1 : scrollYProgress }}/></svg><DeferredSpatialGallery/><p className="technology-note">Bộ ảnh minh họa định hướng không gian · Không phải bằng chứng về cơ sở hoặc thiết bị thực tế.</p></section>;
}

function ServicesBento() {
  return <section className="services-editorial container"><SectionHead eyebrow="07 / Dịch vụ y tế" title="Chủ động chăm sóc. Trọn vẹn mỗi ngày."/><div className="service-bento">{services.slice(0, 4).map((s, i) => <DepthSurface key={s.slug} className={`bento-item bento-${i}`}><Link href={`/dich-vu/${s.slug}`}><div className="bento-top"><small>{s.category}</small><ArrowUpRight/></div>{i === 0 && <ImageReveal src={imagery[2]} alt="Không gian thăm khám minh họa" className="bento-photo"/>}<div><s.icon size={30} strokeWidth={1}/><h3>{s.name}</h3><p>{s.desc}</p><small>{s.price}</small></div></Link></DepthSurface>)}</div></section>;
}
function PatientExperience() {
  return <section className="patient-experience container"><div><p className="eyebrow">08 / Trải nghiệm của bạn</p><h2>Ít băn khoăn hơn.<br/><em>Chủ động nhiều hơn.</em></h2><p>Một nơi để bắt đầu đặt lịch và xem lại lịch hẹn. Các khung giờ được lấy từ hệ thống khi bạn lựa chọn.</p><MagneticButton href="/benh-nhan">Khám phá cổng bệnh nhân</MagneticButton></div><div className="patient-preview"><div className="preview-toolbar"><span className="tiny-cross">+</span><b>LỊCH HẸN CỦA BẠN</b><span>Giao diện minh họa</span></div><p>Bước đầu cho<br/><em>một ngày an tâm.</em></p>{['Chọn chuyên khoa phù hợp', 'Tìm bác sĩ đồng hành', 'Xác nhận ngày & giờ'].map((line, i) => <div className="preview-step" key={line}><span>0{i + 1}</span><b>{line}</b>{i < 2 ? <Check size={16}/> : <ArrowRight size={16}/>}</div>)}<Link href="/dat-lich" className="preview-link">Tạo lịch hẹn của bạn <ArrowUpRight/></Link></div></section>;
}


export function HomePage() {
  return <div className="premium-home"><CinematicHero/><section className="editorial-metrics container" aria-label="Thông tin trên website"><RollingMetric value="06" label="Chuyên khoa" detail="Danh mục thông tin trên website"/><RollingMetric value="05" label="Bước chăm sóc" detail="Từ đặt lịch đến hướng dẫn theo dõi"/><RollingMetric value="01" label="Điều luôn hướng đến" detail="Sự an tâm của người bệnh"/></section><Manifesto/><SpecialtiesGallery/><Facilities/><CareJourney/><DoctorShowcase/><Technology/><ServicesBento/><PatientExperience/><section className="journal-editorial-section container"><SectionHead eyebrow="09 / Tạp chí sức khỏe" title="Hiểu cơ thể. Sống tốt hơn." action={<Link href="/tin-tuc" className="text-link">Tất cả bài viết <ArrowUpRight/></Link>}/><EditorialJournal/></section><section className="final-invitation"><div className="container"><p className="eyebrow">Sẵn sàng khi bạn cần</p><h2><RevealText>Một cuộc hẹn nhỏ.</RevealText><RevealText><em>Dành cho chính mình.</em></RevealText></h2><MagneticButton href="/dat-lich">Bắt đầu đặt lịch khám</MagneticButton><a href="tel:0914010104">Hoặc gọi 0914 010 104 <ArrowUpRight size={16}/></a></div></section></div>;
}
