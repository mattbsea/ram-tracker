FROM node:16-alpine AS builder

ARG REACT_APP_ENV="production"
ENV REACT_APP_ENV=${REACT_APP_ENV}
EXPOSE 3000

WORKDIR /app
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install react-scripts -g
RUN yarn install
COPY . .
RUN NODE_ENV=production REACT_APP_ENV=$REACT_APP_ENV yarn build

FROM node:16-alpine

WORKDIR /app
RUN rm -rf *
COPY --from=builder /app/build .
RUN npm install -g serve

CMD ["serve", "-s"]