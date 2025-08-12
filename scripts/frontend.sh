#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

DEMO_VITE_APP_SECRET=s3cret1
DEMO_VITE_OAUTH_URL=http://localhost:8080/api/oauth2/authorization/kakao
DEMO_VITE_API_URL=http://localhost:8080
DEMO_VITE_STOMP_URL=ws://localhost:8080

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

git checkout main

git pull origin main

cd "${SCRIPT_DIR}/.."

if [ ! -f ".env" ]; then
  echo ".env 파일이 없습니다. 해당 파일을 생성하겠습니다."
  touch .env
  echo "VITE_APP_SECRET=${DEMO_VITE_APP_SECRET}" > .env
  echo "VITE_OAUTH_URL=${DEMO_VITE_OAUTH_URL}" >> .env
  echo "VITE_API_URL=${DEMO_VITE_API_URL}" >> .env
  echo "VITE_STOMP_URL=${DEMO_VITE_STOMP_URL}" >> .env
fi

# 기존 빌드파일 삭제
if [ -d "build" ]; then
  echo "build 폴더가 있습니다. 해당 폴더를 삭제하겠습니다."
  rm -rf build
fi

yarn install --frozen-lockfile && yarn build && yarn start