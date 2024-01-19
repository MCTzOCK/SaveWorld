FROM node:18
LABEL authors="Ben Siebert"
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build
ENTRYPOINT ["npm", "start"]
