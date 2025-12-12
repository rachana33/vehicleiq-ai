FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
# Copy SQL schema file to dist folder (TypeScript build doesn't copy non-TS files)
RUN mkdir -p dist/db && cp src/db/schema.sql dist/db/
EXPOSE 3001
CMD ["npm", "start"]
