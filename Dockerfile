FROM node:10
ADD ./src /code
WORKDIR /code
RUN npm install --production
CMD ["node", "index.js"]