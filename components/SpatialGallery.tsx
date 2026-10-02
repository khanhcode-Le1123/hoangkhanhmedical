import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useVelocity } from 'motion/react';
import { useMotionMode } from './motion/system';
const imagery = ['/images/doctor-hero.png', '/images/medical-team.png', '/images/clinic-interior.png'];

export default function SpatialGallery() {
  const ref = useRef<HTMLDivElement>(null); const { cinematic } = useMotionMode();
  const { scrollYProgress, scrollY } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const velocity = useVelocity(scrollY); const smooth = useSpring(velocity, { stiffness: 80, damping: 25 });
  const skew = useTransform(smooth, [-1800, 0, 1800], [-2, 0, 2]);
  const left = useTransform(scrollYProgress, [0, .5, 1], [12, 0, -8]); const right = useTransform(left, v => -v);
  const scale = useTransform(scrollYProgress, [0, .5, 1], [.9, 1, .94]);
  return <div ref={ref} className="spatial-gallery"><motion.figure style={cinematic ? { rotateY: left, scale, skewY: skew } : {}}><Image src={imagery[2]} fill alt="Không gian tiếp nhận minh họa" sizes="(max-width: 900px) 80vw, 30vw"/><figcaption>01 / KHÔNG GIAN TIẾP NHẬN</figcaption></motion.figure><motion.figure style={cinematic ? { skewY: skew } : {}}><Image src={imagery[1]} fill alt="Đội ngũ y tế minh họa" sizes="(max-width: 900px) 80vw, 40vw"/><figcaption>02 / CON NGƯỜI</figcaption></motion.figure><motion.figure style={cinematic ? { rotateY: right, scale, skewY: skew } : {}}><Image src={imagery[0]} fill alt="Không gian tư vấn minh họa" sizes="(max-width: 900px) 80vw, 30vw"/><figcaption>03 / SỰ ĐỒNG HÀNH</figcaption></motion.figure></div>;
}
