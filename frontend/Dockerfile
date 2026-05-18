FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build step if needed for production, but for dev we'll use npm run dev
# RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]
