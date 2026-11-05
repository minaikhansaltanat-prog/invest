import { z } from 'zod'

// Браузердегі CSP `script-src` eval-ға тыйым салады. Zod 4 схема құрғанда JIT үшін `new Function` сынайды:
// ұсталса да, браузер консольге «CSP violation: script-src blocked eval» қатесін жазады. Форма жұмыс істей береді, бірақ шу қалады.
// Сондықтан JIT тек браузерде өшіріледі (серверде CSP жоқ, JIT жылдамдығы сақталады).
// Бұл модуль схемалары бар файлдардан (definitions.ts, auth.ts) импортталуы тиіс: Zod JIT-ті схема құрылған сәтте таңдайды.
if (typeof window !== 'undefined') z.config({ jitless: true })
