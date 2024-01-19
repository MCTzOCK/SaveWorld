FROM node:20
LABEL authors="Ben Siebert"
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 3000
ENTRYPOINT ["node", "index.js"]
