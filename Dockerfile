FROM node:8.11.2
WORKDIR /www
RUN mkdir /www/file_store
COPY ./package.json /www/
RUN npm install --production
COPY ./ /www/
RUN npm run prestart:prod
CMD ["node","dist/main.js"]
EXPOSE 3000