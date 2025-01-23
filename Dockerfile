# Node.js 기반 이미지에서 시작
FROM node:18 AS build

WORKDIR /app

# UTF-8 인코딩 설정
ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8

# 필요한 파일들을 복사하고 의존성 설치
COPY package.json package-lock.json ./ 
RUN npm install

# 애플리케이션 코드 복사
COPY . .

# React 애플리케이션 빌드
RUN npm run build

# Nginx 설정을 위한 단계
FROM nginx:1.24

# UTF-8 인코딩 설정 (Nginx에도 적용)
ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8

# Nginx 설정 파일 복사
COPY default.conf /etc/nginx/conf.d/default.conf

# 빌드된 React 애플리케이션을 Nginx에 복사
COPY --from=build /app/build /usr/share/nginx/html

# .env 파일을 컨테이너에 복사하여 환경 변수로 사용할 수 있도록 설정
COPY .env /app/.env

# Nginx 포트 노출
EXPOSE 80

# Nginx 서버 실행
CMD ["nginx", "-g", "daemon off;"]
