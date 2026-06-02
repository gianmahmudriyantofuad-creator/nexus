FROM node:20-alpine

# Install curl biar bisa download Nexus CLI
RUN apk add --no-cache curl

WORKDIR /app

COPY package.json ./
RUN npm install --only=production

COPY . .

CMD ["npm", "start"]
