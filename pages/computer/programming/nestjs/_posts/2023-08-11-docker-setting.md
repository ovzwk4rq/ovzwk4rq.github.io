---
layout: post
title: 도커 개발환경 세팅
---
먼저 다음과 같은 디렉토리 구조를 만든다. (아래 표기는 ls -R의 출력과 비슷한 형식으로 작성된 것이고, /가 우리 프로젝트의 루트를 의미한다).
```
/:
docker-compose.yml .env backend/

/backend/:
Dockerfile dockerinit.sh app/

/backend/app/:
```

docker-compose.yml의 내용은 다음과 같다.
```
services:
  backend:
    build: backend
    volumes:
      - ./backend/app:/app
    ports:
      - ${BACKEND_PORT}:3000
```

.env의 내용은 다음과 같다.
```
BACKEND_PORT=3000
```

Dockerfile의 내용은 다음과 같다.
```
FROM node:latest
ENTRYPOINT ["tail", "-f"]
```

dockerinit.sh의 내용은 다음과 같다.
```
#!/bin/sh
npm install
exec npm run start:dev
```

위 내용대로 디렉토리 구조를 만들었다면, 그 다음은 프로젝트 루트에서
```
docker compose up --build -d
```
를 실행시켜서 이미지를 빌드하고 컨테이너를 실행시킨 다음,
```
docker exec -it <해당 컨테이너 id> sh
```
를 통해 컨테이너 안으로 들어간다. 그런 다음,
```
npm i -g @nestjs/cli
```
와
```
nest new app
```
을 실행하면 /app 디렉토리 안에 많은 파일들이 생겨난 것을 확인할 수 있다. 그런 다음,
```
git config --global --add safe.directory /app
```
을 실행하고 `exit`명령어를 통해 컨테이너 밖으로 나오면, /backend/app/ 디렉토리의 내용이 컨테이너 안의 /app 디렉토리와 같아진 것을 확인할 수 있다.

그 다음에는 Dockerfile의 내용을 다음과 같이 바꿔야 한다.
```
FROM node:latest
COPY dockerinit.sh /
RUN chmod u+x dockerinit.sh
WORKDIR /app
ENTRYPOINT ["/dockerinit.sh"]
```

그리고 /backend/ 디렉토리에서 다음 명령어를 실행한다.
```
sudo chown -R <유저>:<그룹> app
```

이후 개발 중에 새로운 패키지를 설치할 때는 호스트에서 설치하지 말고 위에서처럼 컨테이너 안에서 해야한다.

### 이렇게 하는 이유

backend 디렉토리 안의 내용들이 프로젝트 루트에 있어도 되지만 굳이 backend 디렉토리를 따로 만든 이유는 나중에 frontend 등 다른 컨테이너들이 추가될 것을 고려하였기 때문이다.

nestjs 설치나 기타 npm 패키지들을 설치할 때 컨테이너 안에서 하는 이유는, 패키지들이 컨테이너 안의 환경에 맞는 버전이 설치되어야지 호스트 환경에 맞는 버전이 설치되면 안되기 때문이다.

마지막에 chown 을 하는 이유는, 그렇게 하지 않으면 파일들의 소유자가 root로 되어 있어 파일 수정을 할 수가 없기 때문이다. 근데 sudo를 쓸수 없는 상황에선 어떻게 해야 할지 잘 모르겠다.

git config를 하는 이유는, 테스트를 할 때 필요한 npm test:watch 명령어가 git을 사용하는데, 해당 config 없이는 chown을 하는 것과 관련해 무언가 꼬여서 git을 사용할 수 없기 때문이다.
