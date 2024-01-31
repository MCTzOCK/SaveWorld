FROM node:20
LABEL authors="Ben Siebert"

WORKDIR /app
RUN mkdir -p /app/public
COPY . .

RUN npm install

ENTRYPOINT ["node", "."]
