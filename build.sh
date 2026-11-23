#!/bin/bash
set -e

echo "[DOCKER CONTAINER] Avvio ambiente di build..."

if [ -n "$SSH_PRIVATE_KEY" ]; then
    echo "[DOCKER CONTAINER] Iniezione della chiave SSH..."
    mkdir -p /root/.ssh
    echo "$SSH_PRIVATE_KEY" > /root/.ssh/id_rsa
    chmod 600 /root/.ssh/id_rsa
fi

ssh-keyscan -H github.com >> /root/.ssh/known_hosts 2>/dev/null || true

GIT_URL=${GIT_REPO_URL:-"git@github.com:OmarSilano/Memorrachare.git"}
echo "[DOCKER CONTAINER] Download della repo da: $GIT_URL"
git clone "$GIT_URL" /workspace/src

cd /workspace/src

echo "[DOCKER CONTAINER] Avvio del comando 'make'..."

# Disabilita temporaneamente 'set -e' per catturare il log anche se make fallisce
set +e
COMPILE_LOG=$(make 2>&1)
BUILD_STATUS=$?
set -e

echo "================ OUTPUT DI BUILD ================"
echo "$COMPILE_LOG"
echo "================================================="

if [ $BUILD_STATUS -eq 0 ]; then
    echo "[SUCCESS] Build completata con successo!"
else
    echo "[ERROR] Build fallita con codice: $BUILD_STATUS"
    exit $BUILD_STATUS
fi
