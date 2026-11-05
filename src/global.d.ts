import type kk from '../messages/kk.json'

// next-intl кілттері қазақша файл бойынша типтеледі; басқа 3 тілдің кілттері бірдей екенін Vitest тексереді.
declare module 'next-intl' {
  interface AppConfig {
    Messages: typeof kk
    Locale: 'kk' | 'ru' | 'en' | 'zh'
  }
}
