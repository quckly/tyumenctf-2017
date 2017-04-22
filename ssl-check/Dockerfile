FROM node

ENV PORT 443

COPY package.json /usr/src/app/package.json
RUN cd /usr/src/app && npm install
COPY . /usr/src/app

WORKDIR /usr/src/app

EXPOSE 443

CMD ["npm", "start"]
