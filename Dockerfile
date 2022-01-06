FROM node:16.13.0-alpine


COPY package.json package-lock.json .
RUN npm install

COPY . .

CMD ["npm", "run", "start"]
