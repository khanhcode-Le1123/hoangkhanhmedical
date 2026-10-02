import Image from 'next/image';
import Link from 'next/link';
import { useId, useRef, useState, type ReactNode } from 'react';
import { ArrowUpRight, Plus } from 'lucide-react';
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform, type MotionStyle } from 'motion/react';
import { depthSpring, editorial, spring, useMotionMode } from './system';

export function RevealText({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const { reduced } = useMotionMode();
  return <span className="text-mask"><motion.span initial={reduced ? false : { y: '110%', rotate: 2 }} whileInView={{ y: 0, rotate: 0 }} viewport={{ once: true }} transition={{ ...editorial, delay }}>{children}</motion.span></span>;
}

export function MagneticButton({ href, children, light = false }: { href: string; children: ReactNode; light?: boolean }) {
  const { pointer } = useMotionMode();
  const x = useSpring(0, spring), y = useSpring(0, spring);
  return <motion.span className="magnetic-wrap" style={{ x, y }} onPointerMove={event => {
    if (!pointer) return;
    const box = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - box.left - box.width / 2) * .07); y.set((event.clientY - box.top - box.height / 2) * .12);
  }} onPointerLeave={() => { x.set(0); y.set(0); }}><Link className={`button ${light ? 'button-lime' : 'button-dark'}`} href={href}>{children}<ArrowUpRight size={18}/></Link></motion.span>;
}

export function DepthSurface({ children, className = '', tilt = false }: { children: ReactNode; className?: string; tilt?: boolean }) {
  const { pointer } = useMotionMode();
  const px = useMotionValue(50), py = useMotionValue(50);
  const x = useSpring(px, depthSpring), y = useSpring(py, depthSpring);
  const rotateX = useTransform(y, [0, 100], [4, -4]);
  const rotateY = useTransform(x, [0, 100], [-4, 4]);
  const followX = useTransform(x, [0, 100], ['-5px', '5px']);
  const followY = useTransform(y, [0, 100], ['-4px', '4px']);
  const background = useMotionTemplate`radial-gradient(450px circle at ${x}% ${y}%, rgba(214,239,204,.27), transparent 70%)`;
  const style = pointer ? { '--pointer-x': followX, '--pointer-y': followY, ...(tilt ? { rotateX, rotateY, transformPerspective: 1200 } : {}) } as MotionStyle : {};
  return <motion.div className={`depth-surface ${className}`} style={style} onPointerMove={event => {
    if (!pointer) return;
    const rect = event.currentTarget.getBoundingClientRect(); px.set((event.clientX - rect.left) / rect.width * 100); py.set((event.clientY - rect.top) / rect.height * 100);
  }} onPointerLeave={() => { px.set(50); py.set(50); }}>
    {children}{pointer && <motion.div className="cursor-light" style={{ background }} aria-hidden/>}
  </motion.div>;
}

export function ImageReveal({ src, alt, className = '', vertical = false }: { src: string; alt: string; className?: string; vertical?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced, cinematic } = useMotionMode();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const clipPath = useTransform(scrollYProgress, [0, 1], [vertical ? 'inset(18% 0% 18% 0% round 32px)' : 'inset(0% 18% 0% 18% round 32px)', 'inset(0% 0% 0% 0% round 4px)']);
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  return <motion.div ref={ref} className={`image-reveal ${className}`} style={reduced ? {} : { clipPath }}><motion.div className="image-fill" style={cinematic ? { scale } : {}}><Image src={src} alt={alt} fill sizes="(max-width: 900px) 100vw, 60vw"/></motion.div></motion.div>;
}

export function Accordion({ title, children, category }: { title: string; children: ReactNode; category?: string }) {
  const [open, setOpen] = useState(false); const id = useId(); const { reduced } = useMotionMode();
  return <motion.div layout={!reduced} className="motion-faq"><motion.button layout="position" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={id}><span>{category && <small>{category}</small>}{title}</span><motion.span animate={{ rotate: open ? 45 : 0 }} transition={spring}><Plus size={20}/></motion.span></motion.button><AnimatePresence initial={false}>{open && <motion.div id={id} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduced ? 0 : .25 }}><p>{children}</p></motion.div>}</AnimatePresence></motion.div>;
}

export function SuccessMark() {
  const { reduced } = useMotionMode();
  return <motion.div className="confirm-icon" initial={reduced ? false : { scale: .8 }} animate={{ scale: 1 }} transition={spring}><svg viewBox="0 0 40 40" fill="none" aria-label="Thành công" role="img"><motion.path d="M10 21l7 7L31 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: reduced ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: .6, delay: .1 }}/></svg></motion.div>;
}
