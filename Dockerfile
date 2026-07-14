FROM registry.access.redhat.com/ubi9/nodejs-22:latest AS builder
WORKDIR /opt/app-root/src
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM registry.access.redhat.com/ubi9/ubi-micro:latest
ARG DIST_PATH=/opt/app-root/src/dist
COPY --from=builder /opt/app-root/src/dist ${DIST_PATH}
