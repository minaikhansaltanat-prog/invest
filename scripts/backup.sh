#!/usr/bin/env bash
# Күнделікті сақтық көшірме (ТТ 14.1): PostgreSQL дампы + жүктелген файлдар (.data), 30 күн сақталады.
# Cron мысалы (күн сайын 03:15): 15 3 * * * cd /opt/kfca-portal && ./scripts/backup.sh >> backups/backup.log 2>&1
# Шифрлау: BACKUP_GPG_RECIPIENT берілсе, архив gpg-мен шифрланады (ТТ 14.1: көшірмелер шифрланады).
set -euo pipefail

cd "$(dirname "$0")/.."
COMPOSE="docker compose -f docker-compose.prod.yml"
STAMP="$(date +%Y%m%d-%H%M%S)"
DIR="backups"
mkdir -p "$DIR"

echo "[backup] $STAMP: PostgreSQL дампы"
$COMPOSE exec -T postgres pg_dump -U kfca -d kfca --format=custom --no-owner > "$DIR/db-$STAMP.dump"

echo "[backup] $STAMP: жүктелген файлдар (media, деректер бөлмесі)"
$COMPOSE exec -T app tar -C /app/.data -czf - . > "$DIR/files-$STAMP.tar.gz"

if [ -n "${BACKUP_GPG_RECIPIENT:-}" ]; then
  echo "[backup] шифрлау: $BACKUP_GPG_RECIPIENT"
  for file in "$DIR/db-$STAMP.dump" "$DIR/files-$STAMP.tar.gz"; do
    gpg --batch --yes --encrypt --recipient "$BACKUP_GPG_RECIPIENT" --output "$file.gpg" "$file" && rm -f "$file"
  done
fi

echo "[backup] 30 күннен ескі көшірмелерді өшіру"
find "$DIR" -type f \( -name 'db-*' -o -name 'files-*' \) -mtime +30 -delete
echo "[backup] дайын"
