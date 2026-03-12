#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

ENV_FILE="${1:-${REPO_ROOT}/.env}"
TABLE_LIST_FILE="${REPO_ROOT}/config/db/demo_content_tables.txt"
STAMP="$(date -u +%Y%m%d)"
OUT_DIR="${REPO_ROOT}/dumps/selective/${STAMP}"
SCHEMA_FILE="${OUT_DIR}/public_schema.sql"
DATA_FILE="${OUT_DIR}/demo_content_data.sql"
TABLE_RECORD_FILE="${OUT_DIR}/included_tables.txt"
NOTES_FILE="${OUT_DIR}/README.txt"

if [[ -f "${ENV_FILE}" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "${ENV_FILE}"
  set +a
fi

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL is not set. Pass an env file path or export DATABASE_URL first." >&2
  exit 1
fi

if [[ ! -f "${TABLE_LIST_FILE}" ]]; then
  echo "Missing table list: ${TABLE_LIST_FILE}" >&2
  exit 1
fi

mkdir -p "${OUT_DIR}"

mapfile -t TABLES < <(grep -v '^[[:space:]]*#' "${TABLE_LIST_FILE}" | sed '/^[[:space:]]*$/d')

if [[ "${#TABLES[@]}" -eq 0 ]]; then
  echo "No tables configured for selective dump." >&2
  exit 1
fi

LOCAL_TABLE_ARGS=()

for table in "${TABLES[@]}"; do
  LOCAL_TABLE_ARGS+=("--table=public.${table}")
done

dump_with_local_pg_dump() {
  pg_dump \
    --schema-only \
    --schema=public \
    --no-owner \
    --no-privileges \
    "${DATABASE_URL}" > "${SCHEMA_FILE}"

  pg_dump \
    --data-only \
    --inserts \
    --column-inserts \
    --no-owner \
    --no-privileges \
    "${LOCAL_TABLE_ARGS[@]}" \
    "${DATABASE_URL}" > "${DATA_FILE}"
}

if ! command -v pg_dump >/dev/null 2>&1; then
  echo "pg_dump is required but not installed." >&2
  echo "Install PostgreSQL client tools first. Example (Ubuntu): sudo apt install -y postgresql-client" >&2
  exit 1
fi

dump_with_local_pg_dump

printf "%s\n" "${TABLES[@]}" > "${TABLE_RECORD_FILE}"

cat > "${NOTES_FILE}" <<EOF
Selective demo dump created on ${STAMP} (UTC).

Files:
- $(basename "${SCHEMA_FILE}"): public schema snapshot
- $(basename "${DATA_FILE}"): data-only snapshot for demo-safe content tables
- $(basename "${TABLE_RECORD_FILE}"): included table list

Restore order:
1. Restore public schema
2. Restore demo content data
3. Create or seed demo-only auth/admin users separately

This dump intentionally excludes runtime user data such as users, enrollments,
payments, notifications, visit logs, and comments.
EOF

echo "Selective dump written to ${OUT_DIR}"
