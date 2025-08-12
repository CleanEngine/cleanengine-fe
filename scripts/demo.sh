#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

chmod +x "${SCRIPT_DIR}/backend.sh"
chmod +x "${SCRIPT_DIR}/frontend.sh"

# 백엔드 빌드 및 실행
"${SCRIPT_DIR}/backend.sh"

# 프론트엔드 빌드 및 실행
"${SCRIPT_DIR}/frontend.sh"
