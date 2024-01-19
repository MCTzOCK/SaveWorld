FROM node:18
LABEL authors="Ben Siebert"
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build
RUN npm start
ENTRYPOINT ["npm", "run", "ts:prod"]
