#!/bin/bash

export SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

chmod +x "${SCRIPT_DIR}/backend.sh"

"${SCRIPT_DIR}/backend.sh"

if lsof -i :3000 > /dev/null 2>&1; then
  echo "3000번 포트가 사용 중입니다. 해당 프로세스를 종료하시겠습니까? (y/n)"
  read -r answer
  if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
    echo "프로세스를 종료합니다."
    kill -9 $(lsof -ti :3000)
  else
    echo "프로세스 종료를 취소했습니다. 스크립트를 종료합니다."
    exit 1
  fi
fi

yarn start