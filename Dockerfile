FROM node:20-alpine AS base

WORKDIR /app

# prod-deps for production, dev-deps - for build
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the app
COPY . .

# Generate Prisma
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Production image
FROM node:20-alpine AS prod

WORKDIR /app

COPY --from=base /app ./

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]