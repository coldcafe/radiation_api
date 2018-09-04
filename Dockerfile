FROM node:8.11.2
WORKDIR /www
RUN mkdir /www/file_store
COPY ./package.json /www/
RUN npm install --production
COPY ./file_store/package.json /www/file_store/package.json
RUN cd /www/file_store && npm install && cd /www
COPY ./ /www/
RUN npm run prestart:prod
CMD ["node","dist/main.js"]
EXPOSE 3000