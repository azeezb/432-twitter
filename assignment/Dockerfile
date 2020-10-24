FROM node:12.18.3

COPY . /src

COPY package*.json ./

WORKDIR /src

RUN npm install

#expose port to the outside world
EXPOSE 8000

#start comand as per package.json
CMD ["npm", "start"]