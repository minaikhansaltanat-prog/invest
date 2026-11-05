# Қауымдастық порталы: өндіріс образы (ТТ 13.1, 18.2 10-кезең).
# Ескерту: Docker сол компьютерде орнатылмаған, сондықтан бұл файл түнде жинап тексерілген жоқ. Staging-те алғашқы `docker compose build` кезінде тексеріңіз.
# Node нұсқасы: Payload 3.93 `^22.23.4 || >=24.22.1` талап етеді.

FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci

FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Құпия кілттер құрастыру кезінде керек емес: placeholder тек next build үшін, образға түспейді (runtime-та өзгертіледі)
ENV NEXT_TELEMETRY_DISABLED=1 \
    PAYLOAD_SECRET=build-time-placeholder-not-used-at-runtime \
    DATABASE_URL=postgresql://build:build@127.0.0.1:5432/build
RUN npm run build

FROM node:22-bookworm-slim AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000
RUN groupadd -r kfca && useradd -r -g kfca -d /app kfca \
    && mkdir -p /app/.data/media /app/.data/dataroom && chown -R kfca:kfca /app/.data
COPY --from=build --chown=kfca:kfca /app ./
USER kfca
EXPOSE 3000
# Жүктелетін файлдар (media, деректер бөлмесі) тұрақты томда: /app/.data (docker-compose.prod.yml)
CMD ["npm", "run", "start"]
