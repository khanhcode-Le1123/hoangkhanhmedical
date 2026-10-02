import { createContext, createElement, useContext, useEffect, useState, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';

export const ease = [0.22, 1, 0.36, 1] as const;
export const editorial = { duration: 0.9, ease };
export const spring = { type: 'spring' as const, stiffness: 310, damping: 29 };
export const depthSpring = { stiffness: 130, damping: 28, restDelta: 0.001 };

const MotionModeContext = createContext({ reduced: true, cinematic: false, pointer: false });

// One pair of media-query subscriptions for the entire application.
export function MotionModeProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [desktop, setDesktop] = useState(false);
  const [pointer, setPointer] = useState(false);
  useEffect(() => {
    const screen = matchMedia('(min-width: 901px)');
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => { setDesktop(screen.matches); setPointer(fine.matches); };
    update(); screen.addEventListener('change', update); fine.addEventListener('change', update);
    return () => { screen.removeEventListener('change', update); fine.removeEventListener('change', update); };
  }, []);
  return createElement(MotionModeContext.Provider, {
    value: { reduced: !!reduced, cinematic: desktop && reduced === false, pointer: pointer && reduced === false },
  }, children);
}

export function useMotionMode() { return useContext(MotionModeContext); }
