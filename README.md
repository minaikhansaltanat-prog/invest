# Қазақстандық шетелдік капитал қауымдастығының порталы

Next.js 16 (App Router) + Payload CMS 3.93 + PostgreSQL. Төрт тіл: қазақша, орысша, ағылшынша, қытайша (`/kk`, `/ru`, `/en`, `/zh`).
Техникалық тапсырма: [docs/TZ.md](docs/TZ.md). Түнгі құрылыс есебі: [docs/MORNING.md](docs/MORNING.md), журнал: [docs/PROGRESS.md](docs/PROGRESS.md).

## Іске қосу

```bash
npm install
npm run db:dev     # embedded PostgreSQL (порт 54329), Docker қажет емес; өндіріс: docker-compose.yml / docker-compose.prod.yml
npm run seed       # бастапқы контент 4 тілде (қайта іске қосуға болады)
npm run dev        # http://localhost:3000, әкімші: /admin (бірінші әкімшіні өзіңіз жасайсыз)
```

Тексеру: `npm run lint && npm run typecheck && npm test` (Vitest) және `npm run test:e2e` (Playwright, corporate режимі) немесе `npm run test:e2e:full` (толық нұсқа); тесттер уақытша әкімші жасап, соңында жояды.

## Режимдер (corporate / full)

`PORTAL_MODE=corporate` (әдепкі) қарапайым корпоративтік сайт пен қарапайым әкімші панелін береді, инвестициялық модуль жасырын. `PORTAL_MODE=full` инвестициялық порталдың толық нұсқасы (`npm run dev:full`, `npm run test:e2e:full`). Ештеңе жойылмаған. Толығырақ: [docs/CORPORATE_MODE.md](docs/CORPORATE_MODE.md). Нұсқалар: `full-v1` (тег), `night-build` (толық), `corporate-lite` (осы тармақ).

Vercel preview (Neon + Blob): [docs/DEPLOY_VERCEL.md](docs/DEPLOY_VERCEL.md). Қазақстандағы өндіріс (Docker): [docs/DEPLOY.md](docs/DEPLOY.md).

Аударма толықтығын тексеру: `npm run audit:translations` (кілттер мен seed), `npm run audit:content` (дерекқор). Нәтиже: [docs/TRANSLATION_GAPS.md](docs/TRANSLATION_GAPS.md).

## Құрылым

| Жол | Мазмұны |
| --- | --- |
| `src/app/(site)/[locale]` | сайт беттері, `[...slug]` ішкі беттер, `account/*` кабинет |
| `src/app/(site)/api/portal` | форма, тіркелу, 2FA, NDA, деректер бөлмесі, KPI, есептер API |
| `src/app/(payload)` | Payload әкімші панелі мен REST/GraphQL |
| `src/collections`, `src/globals` | Payload жинақтары мен глобалдары (ТТ 13.3) |
| `src/migrations` | Payload DB миграциялары: өндірісте қосымша іске қосылғанда өздігінен орындалады |
| `src/hooks`, `src/access` | бизнес-ережелер мен рұқсат функциялары (сервер) |
| `src/lib/{scoring,investment,kpi}` | таза бизнес-логика: бағалау, жоба ережелері, NDA, сәйкестендіру, KPI |
| `src/lib/{security,forms,portal}` | ALTCHA, TOTP, rate limit, формалар, сессия көмекшілері |
| `src/components` | UI кітапханасы, бет блоктары, формалар, әкімші компоненттері |
| `content/seed` | бастапқы контент (`t(kk, ru, en, zh)`) |
| `messages/*.json` | интерфейс мәтіндері, төрт тілде бірдей кілттер |
| `tests/unit`, `tests/e2e` | Vitest және Playwright |
| `docs` | ТТ, журнал, глоссарий, орналастыру, скриншоттар |

## Негізгі ережелер

- Дизайн токендері CSS айнымалылары арқылы; жаңа түс немесе қаріп қосылмайды. Em dash (U+2014) мәтінде жоқ. Google Fonts/Maps/reCAPTCHA/YouTube жоқ.
- Құпия кілттер `.env` ішінде (git-ке түспейді), үлгі `.env.example`.
- Тексерілмеген жоба ашық каталогқа түспейді; төрт сома ешқашан қосылмайды; деректер бөлмесі тек NDA-дан кейін.
- Hook ішінде Local API шақыруына `req` беріледі (әйтпесе транзакция deadlock болады).
- Коллекция немесе өріс өзгерсе: `npm run payload -- migrate:create <атау>` және `src/migrations` commit-ке қосылады (әзірлеуде схема `push` арқылы өздігінен жаңарады, өндірісте тек миграциямен).
- Tailwind брейкпоинттері: `xs 390`, `md 768`, `lg 1080`, `xl 1440` (`sm` жоқ).
