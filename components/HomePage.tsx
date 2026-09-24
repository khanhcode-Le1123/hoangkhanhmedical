import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Clock3, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { articles, doctors, services, specialties } from '@/lib/data';
import { SectionHead } from './SiteShell';

export function HomePage() {
  return <>
    <section className="hero">
      <div className="hero-orb" />
      <div className="container hero-grid">
        <div className="hero-copy">
          <motion.p className="eyebrow" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>Chuyên khoa & xét nghiệm BSL-2 · Gia Lai</motion.p>
          <motion.h1 initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{delay:.08,duration:.8}}>Y khoa tận tâm.<br/><em>An tâm mỗi ngày.</em></motion.h1>
          <motion.p className="hero-text" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.16}}>Chăm sóc sức khỏe chuẩn mực, gần gũi và minh bạch — từ đội ngũ chuyên khoa giàu kinh nghiệm đến phòng xét nghiệm an toàn sinh học cấp 2.</motion.p>
          <motion.div className="hero-actions" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.3}}>
            <Link href="/dat-lich" className="button button-dark magnetic">Đặt lịch khám <ArrowUpRight size={18}/></Link>
            <Link href="/chuyen-khoa" className="text-link">Khám phá chuyên khoa <ArrowRight size={18}/></Link>
          </motion.div>
          <div className="trust-row">
            <span><ShieldCheck/>Quy trình chuẩn hóa</span><span><Clock3/>Phản hồi nhanh</span><span><HeartHandshake/>Theo dõi tận tâm</span>
          </div>
        </div>
        <motion.div className="hero-media" initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}} transition={{duration:1}}>
          <div className="hero-image-wrap"><Image src="/images/doctor-hero.png" alt="Bác sĩ Hoàng Khanh Medical" fill priority sizes="(max-width: 900px) 100vw, 50vw"/></div>
          <div className="glass-card glass-top"><span className="pulse-dot"/> Đang nhận lịch hôm nay</div>
          <div className="glass-card glass-bottom"><b>BSL–2</b><span>Phòng xét nghiệm<br/>an toàn sinh học</span></div>
        </motion.div>
      </div>
      <div className="scroll-cue"><ArrowDown size={16}/> Cuộn để khám phá</div>
    </section>

    <section className="numbers-band">
      <div className="container numbers-grid">
        {[['10+','Năm đồng hành'],['06','Chuyên khoa'],['20+','Dịch vụ y tế'],['07:00–19:00','Mở cửa mỗi ngày']].map(([n,l])=><div key={l} data-reveal><strong>{n}</strong><span>{l}</span></div>)}
      </div>
    </section>

    <section className="section specialties-section">
      <div className="container">
        <SectionHead eyebrow="Chăm sóc đa chuyên khoa" title="Đúng chuyên khoa. Đúng người. Đúng lúc." action={<Link className="text-link" href="/chuyen-khoa">Xem tất cả <ArrowRight/></Link>}/>
        <div className="specialty-grid">
          {specialties.map((item,i)=><Link href={`/chuyen-khoa/${item.slug}`} className="specialty-card" key={item.slug} data-reveal>
            <span className="card-index">0{i+1}</span><item.icon size={30}/><p>{item.eyebrow}</p><h3>{item.name}</h3><span>{item.desc}</span><div className="card-foot"><small>{item.metric}</small><i><ArrowUpRight/></i></div>
          </Link>)}
        </div>
      </div>
    </section>

    <section className="story-section">
      <div className="container story-grid">
        <div className="story-copy" data-reveal><p className="eyebrow light">Không gian chữa lành</p><h2>Y tế hiện đại vẫn có thể <em>ấm áp.</em></h2><p>Chúng tôi thiết kế từng điểm chạm để người bệnh thấy được tôn trọng: ít chờ đợi hơn, giải thích rõ ràng hơn và luôn có người đồng hành.</p><ul><li><Check/>Quy trình khám tinh gọn, dễ hiểu</li><li><Check/>Chi phí minh bạch trước khi thực hiện</li><li><Check/>Kết quả được lưu trữ và theo dõi</li></ul><Link href="/gioi-thieu" className="button button-lime">Câu chuyện của chúng tôi <ArrowRight/></Link></div>
        <div className="story-media"><Image data-parallax src="/images/clinic-interior.png" fill alt="Không gian phòng khám Hoàng Khanh Medical" sizes="(max-width: 900px) 100vw, 55vw"/><div className="story-caption"><Sparkles/><span><b>Không gian premium</b><small>Riêng tư · An toàn · Dễ tiếp cận</small></span></div></div>
      </div>
    </section>

    <section className="section doctors-section">
      <div className="container">
        <SectionHead eyebrow="Đội ngũ chuyên môn" title="Chuyên gia vững vàng. Người đồng hành tận tâm." action={<Link className="text-link" href="/bac-si">Gặp đội ngũ <ArrowRight/></Link>}/>
        <div className="doctor-feature" data-reveal>
          <div className="team-image"><Image src="/images/medical-team.png" fill alt="Đội ngũ y tế Hoàng Khanh Medical" sizes="(max-width: 900px) 100vw, 58vw"/></div>
          <div className="doctor-list">{doctors.map((d,i)=><Link href={`/bac-si/${d.slug}`} key={d.slug}><span>0{i+1}</span><div><b>{d.name}</b><small>{d.specialty} · {d.exp}</small></div><ArrowUpRight/></Link>)}</div>
        </div>
      </div>
    </section>

    <section className="section services-section">
      <div className="container"><SectionHead eyebrow="Dịch vụ nổi bật" title="Chăm sóc chủ động, thiết kế quanh bạn."/>
        <div className="service-row">{services.slice(0,4).map(s=><Link href={`/dich-vu/${s.slug}`} className="service-mini" key={s.slug} data-reveal><s.icon/><div><small>{s.category}</small><h3>{s.name}</h3><p>{s.desc}</p></div><b>{s.price}</b><ArrowUpRight/></Link>)}</div>
      </div>
    </section>

    <section className="booking-cta"><div className="container booking-cta-inner" data-reveal><div><p className="eyebrow light">Đặt lịch trong vài phút</p><h2>Chọn chuyên khoa.<br/>Chúng tôi lo phần còn lại.</h2></div><div><p>Không cần gọi điện. Chọn bác sĩ và khung giờ phù hợp, nhận xác nhận ngay sau khi hoàn tất.</p><Link href="/dat-lich" className="button button-lime">Bắt đầu đặt lịch <ArrowUpRight/></Link></div></div></section>

    <section className="section journal-section"><div className="container"><SectionHead eyebrow="Tạp chí sức khỏe" title="Hiểu cơ thể để sống tốt hơn." action={<Link className="text-link" href="/tin-tuc">Xem tất cả <ArrowRight/></Link>}/><div className="article-grid">{articles.map((a,i)=><Link href={`/tin-tuc/${a.slug}`} className="article-card" key={a.slug} data-reveal><div className={`article-art art-${i+1}`}><span>{a.category}</span></div><small>{a.date}</small><h3>{a.title}</h3><p>{a.excerpt}</p><span className="read-more">Đọc bài viết <ArrowRight/></span></Link>)}</div></div></section>
  </>;
}
