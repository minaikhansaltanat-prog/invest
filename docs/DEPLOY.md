# DEPLOY: Қазақстандағы VPS-ке Docker арқылы орналастыру

Бұл нұсқаулық ТТ 14.2 (дербес деректер базасы Қазақстан аумағындағы серверде) және 18.2 (10-кезең) бойынша жазылған.
**Ескерту:** Docker түнде жұмыс компьютерінде орнатылмаған, сондықтан `Dockerfile`, `docker-compose.prod.yml`, `deploy/Caddyfile`, `scripts/backup.sh`, `scripts/restore-test.sh` іске қосылып тексерілген жоқ. Алғашқы staging орналастыруында бұл файлдарды тексеріп, қате шықса түзету қажет.

## 1. Серверге талаптар

- Қазақстан аумағындағы VPS (деректер базасы мен жабық файлдар сол жерде тұруы тиіс; нақты талаптың ағымдағы редакциясын заңгер растайды).
- 2 vCPU, 4 ГБ RAM, 40 ГБ диск (бастапқы). Ubuntu 24.04, Docker Engine және `docker compose` плагині.
- Домен және DNS A жазбасы серверге бағытталған (Caddy Let's Encrypt сертификатын автоматты алады, 80 және 443 порт ашық).

## 2. Құпияларды жасау (`.env`)

`.env` файлы git-ке түспейді. Үлгі: `.env.example`. Серверде:

```bash
cp .env.example .env
# төрт кездейсоқ құпия (әрқайсысы бөлек):
openssl rand -hex 32   # PAYLOAD_SECRET
openssl rand -hex 32   # ALTCHA_HMAC_KEY
openssl rand -hex 32   # TWOFA_ENC_KEY
openssl rand -hex 24   # POSTGRES_PASSWORD
```

Міндетті мәндер: `POSTGRES_PASSWORD`, `PAYLOAD_SECRET`, `ALTCHA_HMAC_KEY`, `TWOFA_ENC_KEY`, `NEXT_PUBLIC_SITE_URL` (https://домен), `SITE_DOMAIN` (домен). `ADMIN_2FA` өндірісте әдепкіде `on`. `NOTIFY_EMAILS`: жаңа өтініш туралы хабар алатын қызметкерлер.
`TWOFA_ENC_KEY` өзгерсе, бұрын қосылған 2FA кілттері оқылмайды: оны жоғалтпаңыз және өзгертпеңіз.

## 3. Алғашқы іске қосу

```bash
docker compose -f docker-compose.prod.yml --env-file .env up -d --build
docker compose -f docker-compose.prod.yml exec app npm run seed   # бастапқы контент (4 тілде)
```

1. `https://домен/admin` ашыңыз: бірінші әкімші формасы шығады. Бірінші әкімші автоматты түрде супер-администратор болады.
2. Кіргеннен кейін `https://домен/kk/account/2fa` ашып, TOTP 2FA қосыңыз (өндірісте әкімші панелі 2FA-сыз жабық).
3. Әкімшілік панелінде қалған қызметкерлерді рөлдерімен қосыңыз (Әкімшілер). Өңірлік өкілге өңір көрсетіңіз.
4. «Баптаулар» (settings) ішінде нақты реквизиттерді, жұмыс уақытын, поштаны толтырыңыз.

## 4. Іске қосу алдындағы тізім (ТТ 14, 17, 21)

- [ ] **Аударма:** ru/en/zh мәтіндері түнгі жобалама. Ана тілді тілші тексеріп, `translationStatus` «бекітілді» қойғаннан кейін `settings.policy.translationPolicy` мәнін `approved-only` етіңіз.
- [ ] **Мысал деректер:** `isSample` белгісі бар жобалар мен жаңалықтарды нақтыға ауыстырыңыз немесе жойыңыз (сайтта «Мысал ретінде көрсетілген» белгісі бар).
- [ ] **Заңгер:** `/legal/*` беттерінің мәтіні (құпиялылық, шарттар, келісім, cookie, жауапкершілікті шектеу), келісім мәтінінің нұсқасы (`CONSENT_VERSION`), NDA шаблоны (`NDA_TEMPLATE_VERSION`).
- [ ] **Серіктес логотиптері:** тек жазбаша рұқсатпен (`showLogo`).
- [ ] **Негізатушы фотосы:** `people.photoConsent` жазбаша келісіммен расталған.
- [ ] **Email:** `npm i @payloadcms/email-nodemailer`, `payload.config.ts` ішіне `email` адаптері және `SMTP_*` (қазір хаттар консольге жазылады).
- [ ] **Тәуелсіз ену тесті (pentest)** және `npm audit` таза (CI-да `npm audit --omit=dev --audit-level=high`).
- [ ] **Файл антивирусы (ClamAV)**, деректер бөлмесіне PDF-ке су белгісін басу (`pdf-lib`), жүктеу қоймасы S3/MinIO (қазір жергілікті том `.data`).
- [ ] **Rate limit** көп инстансты болса, Redis/PG негізді шектеуге ауыстыру (қазір бір процесс жадында).
- [ ] **Қатаң CSP:** қазір `script-src 'unsafe-inline'`; `proxy.ts` ішінде nonce беріп, оны алып тастау.

## 4a. Деректер қоймасы

`appdata` томы `.data/media` (суреттер) мен `.data/dataroom` (деректер бөлмесі, жабық) қамтиды. Екеуі де сақтық көшірмеге кіреді (`scripts/backup.sh`).
Жабық файлдарға тікелей жария URL жоқ: тек `/api/portal/dataroom/file/<id>` арқылы, NDA, деңгей, вето және 2FA тексерілгеннен кейін.

## 5. Сақтық көшірме және қалпына келтіру (ТТ 14.1)

```bash
chmod +x scripts/backup.sh scripts/restore-test.sh
crontab -e
# күн сайын 03:15, 30 күн сақталады:
15 3 * * * cd /opt/kfca-portal && ./scripts/backup.sh >> backups/backup.log 2>&1
```

- Шифрлау: `BACKUP_GPG_RECIPIENT=<gpg кілті>` айнымалысын берсеңіз, архивтер gpg-мен шифрланады.
- **Айсайын** қалпына келтіру тесті: `./scripts/restore-test.sh` (соңғы дампты уақытша базаға қайтарып, кестелерді тексереді, өндіріс базасына тиіспейді).
- Қалпына келтіру (апат): `docker compose -f docker-compose.prod.yml exec -T postgres pg_restore -U kfca -d kfca --clean --no-owner < backups/db-<күн>.dump`, файлдар: `docker compose -f docker-compose.prod.yml exec -T app tar -C /app/.data -xzf - < backups/files-<күн>.tar.gz`.

## 6. Жаңарту және артқа қайту

```bash
git pull
docker compose -f docker-compose.prod.yml --env-file .env up -d --build
```

Алдымен `scripts/backup.sh` жасаңыз. Схема өзгерісі Payload миграциясымен жүреді (өндірісте `push` өшірулі, миграция файлдарын әзірлеу кезінде `payload migrate:create` арқылы жасаңыз). Қате болса, алдыңғы git тегіне оралып, қайта жинаңыз; дерекқорды дамптан қалпына келтіріңіз.

## 7. Тексеру

- `https://домен/robots.txt`, `https://домен/sitemap.xml` ашылады, hreflang баламалары бар.
- Жауап тақырыптарында `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`.
- `/admin` кіргеннен кейін «Басқару дашборды» көрінеді, ал 2FA-сыз әкімші `/kk/account/2fa` бетіне бағытталады.
- `curl -s https://домен/api/admins/init` жауабы `{"initialized":true}` болуы тиіс (бірінші әкімші жасалған).
