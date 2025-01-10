# Step 1: Node.js를 사용한 빌드 단계
FROM node:18 AS build

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일을 복사하고 의존성 설치
COPY package.json package-lock.json ./
RUN npm install

# 애플리케이션 코드를 복사하고 빌드 실행
COPY ./ ./ 
RUN npm run build

# Step 2: Nginx를 사용하여 빌드된 파일을 서비스
FROM nginx:1.24

# 커스텀 Nginx 설정 파일 복사
COPY default.conf /etc/nginx/conf.d/default.conf

# 빌드된 파일을 Nginx의 기본 디렉토리로 복사
COPY --from=build /app/build /usr/share/nginx/html

# 기본 Nginx 포트 노출
EXPOSE 80

# Nginx 시작
CMD ["nginx", "-g", "daemon off;"]