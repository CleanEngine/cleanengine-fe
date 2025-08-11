#!/bin/bash

export SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

chmod +x "${SCRIPT_DIR}/backend.sh"

# 백엔드 빌드 및 실행
"${SCRIPT_DIR}/backend.sh"

# 3000번 포트가 사용중인지 확인
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

# 프로젝트 폴더로 이동
cd "${SCRIPT_DIR}/.."

git checkout main

git pull origin main

# 기존 빌드파일 삭제
if [ -d "build" ]; then
  echo "build 폴더가 있습니다. 해당 폴더를 삭제하겠습니다."
  rm -rf build
fi

yarn build && yarn start