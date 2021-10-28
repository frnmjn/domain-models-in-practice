FROM node:12-slim AS build

WORKDIR /app

ADD . .
RUN npm install -g npm
RUN npm i
RUN npm run build

FROM node:12-alpine AS app

WORKDIR /app

COPY --from=build /app/dist ./dist
# COPY --from=build /app/*pem ./
COPY --from=build /app/package* ./
COPY --from=build /app/node_modules ./node_modules

ENTRYPOINT ["/bin/sh", "-c" , "npm start"]

EXPOSE 3004
