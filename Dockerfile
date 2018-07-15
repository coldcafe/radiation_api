FROM node:8.11.2
RUN mkdir /www
WORKDIR /www
COPY ./package.json /www/
RUN npm install --production
COPY ./ /www/
RUN npm run prestart:prod
CMD ["node","dist/main.js"]
EXPOSE 3000