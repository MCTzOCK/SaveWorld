FROM node:18
LABEL authors="Ben Siebert"
WORKDIR /usr/src/app
COPY . .
RUN npm install
ENTRYPOINT ["npm", "run", "ts:start"]