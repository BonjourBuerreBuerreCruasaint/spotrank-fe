# Node.js 기반 이미지에서 시작
FROM node:16 AS build

WORKDIR /app

# 필요한 파일들을 복사하고 의존성 설치
COPY package.json package-lock.json ./
RUN npm install

# 애플리케이션 코드 복사
COPY . .

# React 애플리케이션 빌드
RUN npm run build

# Nginx 설정을 위한 단계
FROM nginx:alpine

# Nginx 설정 파일 복사
COPY default.conf /etc/nginx/conf.d/default.conf

# 빌드된 React 애플리케이션을 Nginx에 복사
COPY --from=build /app/build /usr/share/nginx/html

# 환경 변수 설정
ENV REACT_APP_KAKAO_API_KEY=<your-api-key>

# Nginx 포트 노출
EXPOSE 80

# Nginx 서버 실행
CMD ["nginx", "-g", "daemon off;"]
