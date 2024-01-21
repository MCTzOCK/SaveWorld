FROM node:20
LABEL authors="Ben Siebert"

WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npx tsc

ENTRYPOINT ["node", "."]
