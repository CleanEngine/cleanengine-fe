#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

backend_dir_name="cleanengine-be"
backend_repo_url="https://github.com/CleanEngine/${backend_dir_name}.git"


DEMO_KAKAO_CLIENT_ID=2e063b83bf69bf8e54db000d056539b2
DEMO_JWT_SECRET=my-super-secret-key-for-jwt-generation-in-investfuture-project
DEMO_MARIADB_ROOT_PASSWORD=1234
DEMO_MARIADB_DATABASE=if
DEMO_MARIADB_USER=localuser
DEMO_MARIADB_PASSWORD=localpass
DEMO_SPRING_DATASOURCE_URL=jdbc:mariadb://mariadb:3306/if
DEMO_SPRING_DATASOURCE_USERNAME=localuser
DEMO_SPRING_DATASOURCE_PASSWORD=localpass


root_demo_dir="${SCRIPT_DIR}/../.."
backend_dir="${root_demo_dir}/${backend_dir_name}"


function build_backend(){

  if [ ! -f "${backend_dir}/docker/local.properties" ]; then
    echo "local.properties 파일이 없습니다. 해당 파일을 생성하겠습니다."
    touch "${backend_dir}/docker/local.properties"
    echo "KAKAO_CLIENT_ID=${DEMO_KAKAO_CLIENT_ID}" >> "${backend_dir}/docker/local.properties"
    echo "JWT_SECRET=${DEMO_JWT_SECRET}" >> "${backend_dir}/docker/local.properties"
    echo "MARIADB_ROOT_PASSWORD=${DEMO_MARIADB_ROOT_PASSWORD}" >> "${backend_dir}/docker/local.properties"
    echo "MARIADB_DATABASE=${DEMO_MARIADB_DATABASE}" >> "${backend_dir}/docker/local.properties"
    echo "MARIADB_USER=${DEMO_MARIADB_USER}" >> "${backend_dir}/docker/local.properties"
    echo "MARIADB_PASSWORD=${DEMO_MARIADB_PASSWORD}" >> "${backend_dir}/docker/local.properties"
    echo "SPRING_DATASOURCE_URL=${DEMO_SPRING_DATASOURCE_URL}" >> "${backend_dir}/docker/local.properties"
    echo "SPRING_DATASOURCE_USERNAME=${DEMO_SPRING_DATASOURCE_USERNAME}" >> "${backend_dir}/docker/local.properties"
    echo "SPRING_DATASOURCE_PASSWORD=${DEMO_SPRING_DATASOURCE_PASSWORD}" >> "${backend_dir}/docker/local.properties"
  fi

  cd "${backend_dir}"
  ./gradlew clean bootJar
  cd -
}

function run_docker(){
  if ! docker info > /dev/null 2>&1; then
    echo "Docker 엔진이 실행되지 않고 있습니다. Docker Desktop을 시작해주세요."
    exit 1
  fi

  docker compose -f "${backend_dir}/docker/docker-compose.yml" up -d
}


cd "${root_demo_dir}"

if [ ! -d "${backend_dir}" ]; then
  echo "백엔드 레포지토리가 없습니다. 해당 레포지토리를 클론하겠습니다."
  git clone "${backend_repo_url}"
  cd "${backend_dir}"
  git checkout main
else
  echo "백엔드 레포지토리가 있습니다. 최신 버전으로 업데이트하겠습니다."
  cd "${backend_dir}"
  git pull origin main
  git checkout main
fi

build_backend
run_docker
