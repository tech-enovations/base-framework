FROM node:20-alpine3.17
WORKDIR /app/
COPY ["package.json", "package-lock.json*", "./"]
ENV NODE_OPTIONS=--max_old_space_size=2048
RUN npm install --force
COPY . .
RUN npm run build
EXPOSE 3333
CMD ["npm", "run", "start:prod"]