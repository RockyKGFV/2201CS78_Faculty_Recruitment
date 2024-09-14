FROM node:latest
RUN npm install -g node-pre-gyp
RUN apt-get update && apt-get install -y make gcc g++
COPY . .
RUN npm install -g nodemon
RUN npm install
RUN npm rebuild bcrypt --build-from-source
EXPOSE 8000
CMD [ "node","index.mjs"]