FROM node:slim

ADD . /app
RUN cd /app && yarn install --prod --frozen-lockfile

WORKDIR /app

CMD [ "node", "lib/cdk8s-server.js" ]