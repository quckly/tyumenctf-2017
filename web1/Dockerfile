FROM node

ENV PORT 80

COPY package.json /usr/src/app/package.json
RUN cd /usr/src/app && npm install
COPY . /usr/src/app

WORKDIR /usr/src/app

EXPOSE 80

CMD ["npm", "start"]
