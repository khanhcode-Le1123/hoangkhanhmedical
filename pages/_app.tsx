import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import '@/styles/editorial.css';
import '@/styles/components.css';
import { MotionConfig } from 'motion/react';
import { MotionModeProvider } from '@/components/motion/system';
import { Be_Vietnam_Pro, Noto_Sans } from 'next/font/google';

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['400', '700'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-be-vietnam-pro',
  display: 'swap',
  preload: true,
});

const notoSans = Noto_Sans({
  weight: '400',
  subsets: ['latin', 'vietnamese'],
  variable: '--font-noto-sans',
  display: 'swap',
  preload: false,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${beVietnamPro.variable} ${notoSans.variable} app-fonts`}>
      <MotionConfig reducedMotion="user">
        <MotionModeProvider><Component {...pageProps} /></MotionModeProvider>
      </MotionConfig>
    </div>
  );
}
