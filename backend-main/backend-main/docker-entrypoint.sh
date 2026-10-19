#!/bin/sh
set -e

# Генерируем RSA-ключи для JWT при первом запуске.
# При использовании docker-compose ключи монтируются в volume,
# поэтому они сохраняются между перезапусками контейнера.
if [ ! -f /app/keys/private_key.pem ]; then
  echo "[entrypoint] Generating RSA key pair for JWT..."
  mkdir -p /app/keys
  openssl genpkey -algorithm RSA \
    -out /app/keys/private_key.pem \
    -pkeyopt rsa_keygen_bits:2048
  openssl rsa -pubout \
    -in /app/keys/private_key.pem \
    -out /app/keys/public_key.pem
  echo "[entrypoint] RSA keys generated successfully."
fi

# Применяем миграции / создаём схему БД (безопасно для существующих данных)
echo "[entrypoint] Running database schema update..."
node -e "
const { MikroORM } = require('@mikro-orm/core');
const config = require('./dist/mikro-orm.config');

async function migrate() {
  const orm = await MikroORM.init(config.default || config);
  const generator = orm.getSchemaGenerator();
  await generator.updateSchema();
  await orm.close();
  console.log('[entrypoint] Database schema ready.');
}

migrate().catch(err => { console.error('[entrypoint] Migration failed:', err); process.exit(1); });
"

exec node dist/main.js
