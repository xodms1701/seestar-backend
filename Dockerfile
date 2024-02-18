# STEP 1
FROM node:18.16-alpine AS builder

WORKDIR /usr/src/app

COPY . .

RUN npm i

RUN npx prisma generate

RUN npm run build

# STEP2
FROM node:18.16-alpine

WORKDIR /usr/src/app

ENV NODE_ENV production

COPY --from=builder /usr/src/app ./

EXPOSE 3000

CMD npm run start:prod
