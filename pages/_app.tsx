import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import '@/styles/editorial.css';
import { MotionConfig } from 'motion/react';
import { MotionModeProvider } from '@/components/motion/system';

export default function App({ Component, pageProps }: AppProps) {
  return <MotionConfig reducedMotion="user"><MotionModeProvider><Component {...pageProps} /></MotionModeProvider></MotionConfig>;
}
