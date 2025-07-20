# Use slim image for smaller size
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Install dependencies required for native builds
RUN apt-get update && apt-get install -y \
  python3 \
  make \
  g++ \
  && rm -rf /var/lib/apt/lists/*

# Copy dependency files and set ownership directly
COPY --chown=node:node package*.json yarn.lock ./

# Install dependencies (as root here)
RUN yarn install && npm install -g pm2

# Copy app code and set ownership directly
COPY --chown=node:node . .


# Build app (still as root for native builds)
RUN yarn build && ls -al dist/

# Switch to non-root user (no need for chown -R anymore)
USER node

# Expose app port
EXPOSE 8080

# Start app with PM2
CMD ["pm2-runtime", "start", "dist/src/main.js", "--name", "jobsboard-be"]