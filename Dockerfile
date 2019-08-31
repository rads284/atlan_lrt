FROM alpine:3.7
EXPOSE 3000
ADD package.json /tmp/package.json
RUN apk add --update nodejs
RUN cd /tmp && npm install
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/
ADD . /opt/app
WORKDIR /opt/app/atlan_assignment
CMD ["node","app.js"]

