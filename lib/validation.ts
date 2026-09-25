export const phonePattern = /^(?:\+84|0)(?:\d[ .-]?){8,10}$/;
export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function cleanText(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().replace(/[<>]/g, '').slice(0, maxLength) : '';
}

export function normalizePhone(value: string) {
  return value.replace(/[\s.-]/g, '').replace(/^\+84/, '0');
}

export function validatePassword(value: unknown) {
  return typeof value === 'string' && value.length >= 10 && /[A-Za-z]/.test(value) && /\d/.test(value);
}
