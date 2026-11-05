#!/usr/bin/env bash
# Айлық қалпына келтіру тесті (ТТ 14.1): соңғы дампты ВРЕМЕННЫЙ базаға қалпына келтіреді де, кестелерді тексереді. Өндіріс базасына тиіспейді.
# Қолдану: ./scripts/restore-test.sh [backups/db-YYYYMMDD-HHMMSS.dump]
set -euo pipefail

cd "$(dirname "$0")/.."
COMPOSE="docker compose -f docker-compose.prod.yml"
DUMP="${1:-$(ls -1t backups/db-*.dump 2>/dev/null | head -n1)}"
[ -f "$DUMP" ] || { echo "[restore-test] дамп табылмады (шифрланған .gpg болса, алдымен ашыңыз)"; exit 1; }

TEST_DB="kfca_restore_test"
echo "[restore-test] дамп: $DUMP -> уақытша база $TEST_DB"
$COMPOSE exec -T postgres psql -U kfca -d postgres -c "DROP DATABASE IF EXISTS $TEST_DB" -c "CREATE DATABASE $TEST_DB"
$COMPOSE exec -T postgres pg_restore -U kfca -d "$TEST_DB" --no-owner --exit-on-error < "$DUMP"

COUNT="$($COMPOSE exec -T postgres psql -U kfca -d "$TEST_DB" -tAc "select count(*) from information_schema.tables where table_schema = 'public'")"
echo "[restore-test] қалпына келтірілген кесте саны: $COUNT"
[ "$COUNT" -gt 20 ] || { echo "[restore-test] ҚАТЕ: кесте саны тым аз"; exit 1; }

$COMPOSE exec -T postgres psql -U kfca -d postgres -c "DROP DATABASE $TEST_DB"
echo "[restore-test] СӘТТІ: көшірме қалпына келеді, уақытша база өшірілді"
