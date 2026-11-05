# DEPLOY_VERCEL: corporate-lite нұсқасын Vercel preview-ге шығару

Қойылған мақсат: `corporate-lite` тармағын Vercel-де сынақ (preview) адресіне шығару. Дерекқор: сыртқы Postgres (Neon). Медиа: Vercel Blob. Режим: `PORTAL_MODE=corporate` (әдепкі). Қазақстандағы өндіріс орналастыруы осыдан бөлек: [DEPLOY.md](DEPLOY.md) (дербес деректер заңы үшін сервер Қазақстанда тұруы тиіс; Vercel/Neon тек сынақ).
Кім оқиды: сайтты орналастыратын әзірлеуші. Бұл файлда құпиялар жоқ, тек айнымалылардың атаулары.

## 1. Не дайын

| Талап | Қалай орындалған |
| --- | --- |
| Сыртқы Postgres (Neon) | `DATABASE_URL`; Vercel-де `pg` қосылым саны 5 (`DATABASE_POOL_MAX`), Neon pooler қалғанын басқарады |
| Медиа үшін Vercel Blob | `@payloadcms/storage-vercel-blob`: `BLOB_READ_WRITE_TOKEN` болса, `media` Blob-та; жоқ болса, `.data/media` (Vercel-де жұмыс істемейді) |
| `next build` дерекқорсыз | Сайт беттері әр сұраныста жасалады (`dynamic = 'force-dynamic'`), build кезінде дерекқорға қосылмайды (тексерілді) |
| Өндіріс миграциясы | Қосымша іске қосылғанда автоматты (`prodMigrations`) және бір команда: `npm run migrate` |
| `PORTAL_MODE=corporate` әдепкі | Айнымалы жоқ болса, corporate ([CORPORATE_MODE.md](CORPORATE_MODE.md)) |
| Preview-де noindex | `robots.txt` барлығын жабады, әр жауапта `X-Robots-Tag: noindex, nofollow, noarchive`, `<meta name="robots">`, `sitemap.xml` бос. Vercel production әдепкіде ашық, `ALLOW_INDEXING=false` жабады |
| `/admin` қорғалған | Кіру + міндетті 2FA (өндіріс режимі), 5 сәтсіз әрекеттен кейін 10 минут бұғат, бірінші әкімші ашық эндпойнтпен жасалмайды (`/api/admins/first-register` жабық), `/admin` noindex. Қосымша: Vercel Deployment Protection (6-тарау) |

## 2. Сервистерді дайындау

1. **Neon:** жоба құрыңыз, регионды Vercel функциясы регионына жақын таңдаңыз (`vercel.json` ішінде `fra1`, Neon үшін `aws-eu-central-1`). Екі мекенжай керек: **pooled** (хост атында `-pooler`) және **direct**. Нақты мәндерді репоға жазбаңыз.
2. **Vercel Blob:** Vercel жобасында Storage, Blob store жасап, жобаға қосыңыз: `BLOB_READ_WRITE_TOKEN` өздігінен қойылады. Токен `vercel_blob_rw_<store>_<кездейсоқ>` пішімінде болуы тиіс (әйтпесе қосымша журналға «Invalid token format» жазады).
3. **Құпиялар** (әрқайсысы бөлек, 64 hex таңба):
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   `PAYLOAD_SECRET`, `ALTCHA_HMAC_KEY`, `TWOFA_ENC_KEY` үшін үш рет орындаңыз. `TWOFA_ENC_KEY` кейін өзгертілмейді (қосылған 2FA кілттері оқылмай қалады).

## 3. Vercel жобасы

1. GitHub репосын импорттаңыз. Framework: Next.js (`vercel.json` бар), Install: `npm ci`, Build: `npm run build`, Node.js: **22.x** (Project Settings, General).
2. **Production Branch** репоның әдепкі тармағы болып қалсын (`night-build` немесе `main`); `corporate-lite` тармағына push Preview (`VERCEL_ENV=preview`) болады.
3. Environment Variables (Preview ортасы үшін; тек атаулары):

| Айнымалы | Міндетті | Мағынасы |
| --- | --- | --- |
| `DATABASE_URL` | иә | Neon pooled мекенжайы |
| `PAYLOAD_SECRET` | иә | сессия мен шифрлау негізі |
| `ALTCHA_HMAC_KEY` | иә | байланыс формасының PoW кілті |
| `TWOFA_ENC_KEY` | иә | 2FA құпияларын шифрлау |
| `BLOB_READ_WRITE_TOKEN` | иә | медиа қоймасы |
| `NEXT_PUBLIC_SITE_URL` | жоқ | берілмесе, `VERCEL_URL` (preview адресі) қолданылады |
| `PORTAL_MODE` | жоқ | `corporate` (әдепкі) немесе `full` |
| `ADMIN_2FA` | жоқ | өндірісте әдепкі `on`; `off` қоспаңыз |
| `ADMIN_SETUP_TOKEN` | жоқ | кемінде 16 таңба; бар болса, first-register `x-setup-token` тақырыбымен ашылады. Қажет емес: `npm run create-admin` жеткілікті |
| `ALLOW_INDEXING` | жоқ | `true`/`false` индекстеуді қолмен басады |
| `DATABASE_POOL_MAX` | жоқ | инстанс қосылымы (Vercel-де әдепкі 5) |
| `NOTIFY_EMAILS` | жоқ | жаңа өтініш туралы хабар алатындар (SMTP әлі жоқ: хаттар журналға жазылады) |

## 4. Neon-да миграция, seed және бірінші әкімші

Мұны **өз компьютеріңізден**, Neon **direct** мекенжайымен орындаңыз (pooled мекенжай миграцияға ұсынылмайды). `NODE_ENV=production` міндетті: әйтпесе Payload әзірлеу режимінде схеманы `push` арқылы өзгертеді. Жергілікті `npm run dev` серверін Neon-ға **қоспаңыз**.

PowerShell:
```powershell
$env:NODE_ENV = 'production'
$env:DATABASE_URL = '<neon direct мекенжайы>'
$env:PAYLOAD_SECRET = '<Vercel-дегі PAYLOAD_SECRET>'
$env:BLOB_READ_WRITE_TOKEN = '<Blob токені>'
npm run migrate        # кестелерді жасайды (initial, blob_prefix)
npm run seed           # 4 тілдегі бастапқы контент, суреттер Blob-қа жүктеледі
$env:ADMIN_EMAIL = 'info@...'; $env:ADMIN_PASSWORD = '<12+ таңба, әріп пен сан>'
npm run create-admin   # бірінші супер-администратор
```
bash:
```bash
export NODE_ENV=production DATABASE_URL='<neon direct>' PAYLOAD_SECRET='<...>' BLOB_READ_WRITE_TOKEN='<...>'
npm run migrate && npm run seed
ADMIN_EMAIL='info@...' ADMIN_PASSWORD='<...>' npm run create-admin
```

- `npm run migrate` бос дерекқорда екі миграцияны орындайды. Қосымша іске қосылғанда да күтіп тұрған миграция өздігінен орындалады, бірақ бірнеше инстанс бір мезгілде іске қосылса жарыс болмауы үшін алдын ала бір рет `npm run migrate` істеген дұрыс.
- `npm run seed` қайта іске қосуға болады (бар жазбалар жаңартылады). Токен берілмесе, суреттер жергілікті `.data/media` ішіне түседі де, Vercel-де көрінбейді.
- `create-admin` құпия сөзді экранға шығармайды; пошта бар болса, ештеңе өзгертпейді. Құпия сөз 12-128 таңба, әріп пен сан бар, ортақ емес және поштаға негізделмеген болуы тиіс.
- Кейін `/admin` арқылы кіріп, `/kk/account/2fa` бетінде 2FA қосыңыз (preview-де де міндетті).

## 5. Орналастыру және тексеру

`git push -u origin corporate-lite` (немесе Vercel-де Redeploy). Build дерекқорсыз өтеді. Содан кейін:

```bash
curl -sI https://<preview>/kk | grep -i x-robots-tag     # noindex, nofollow, noarchive
curl -s  https://<preview>/robots.txt                      # Disallow: /
curl -s -o /dev/null -w "%{http_code}\n" https://<preview>/kk/projects   # 404 (corporate)
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://<preview>/api/admins/first-register   # 403
```
- `/kk`, `/ru`, `/en`, `/zh` ашылады, ауыстырғыш ҚАЗ, РУС, ENG, 中文.
- `/admin`: кіру, 2FA, төрт топ (Мазмұн, Медиа, Өтініштер, Жүйе); «Медиафайлдар» ішіне сурет жүктеңіз: ол Blob store-да пайда болады.
- `/kk/contacts` формасын жіберіңіз: өтініш «Өтініштер» бөлімінде.

## 6. Preview-ді жасыру (ұсынылады)

Vercel Project Settings, Deployment Protection: **Vercel Authentication** (Standard Protection) preview-дің бәрін Vercel аккаунтына кірмей ашпайды. Бұл noindex-тен күшті: сынақ сайты тек команда мүшелеріне көрінеді. Қоғамдық көрсету керек болса, Protection-ды өшіріп, noindex-ке сүйеніңіз.

## 7. Шектеулер және ескертулер

- **Жүктеу өлшемі:** Vercel функциясына сұраныс денесі 4,5 МБ-тан аспауы тиіс, сондықтан админкаға үлкен суретті сығып жүктеңіз. Үлкен файлдар үшін кейін `clientUploads` қосылады (қосымша баптау, importMap-ты қайта жасау).
- **Rate limit** жад ішінде (әр инстанс бөлек): кіру бұғаты (5 әрекет) Payload дерекқорында, ал форма шектеуі инстансқа тәуелді. Өндіріске Redis/PG негізді шектеу керек.
- **Дербес деректер:** Vercel/Neon сервері Қазақстанда емес. Нақты дербес деректерді (өтініштер, әкімші email) сынақ ортасына салмаңыз, өндіріс үшін [DEPLOY.md](DEPLOY.md).
- **Email:** SMTP жоқ, хаттар журналға жазылады.
- **Схема өзгерсе:** `npm run migrate:create <атау>`, файлдарды commit-ке қосыңыз, `npm run migrate` (Neon direct) істеп, содан кейін push жасаңыз.
- **Қайту:** Vercel-де алдыңғы deployment-ке Instant Rollback; дерекқор миграциясын артқа қайтару автоматты емес.
- **Мәселелер:** «Invalid token format» (Blob токені дұрыс емес); бірінші сұраныста 500 (`DATABASE_URL` немесе Neon суық іске қосылуы, қайталап көріңіз); Payload «dev режимінде құрылған дерекқор» деп сұрап тұрып қалса, дерекқор `push` арқылы құрылған: таза дерекқор қолданыңыз.
