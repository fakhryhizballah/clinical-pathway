# Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* ./
RUN npm install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./
COPY . ./

# Next.js collects completely anonymous telemetry data about usage.
# The Next.js team is always working to improve your experience.
#
# The telemetry is opt-out. You may opt-out by setting the NEXT_TELEMETRY_DISABLED environment variable to '1',
# both at build time and at run time.
#
# For more information, see the Next.js telemetry page at https://nextjs.org/telemetry
#
# Ws. In the example below, we disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./
COPY --from=builder /app/package.json ./

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
