# Base on offical Node.js Alpine image
FROM node:alpine

# Set working directory
WORKDIR /usr/app

# Install PM2 globally
RUN npm install --global pm2 --registry=https://registry.npm.taobao.org

# Copy package.json and package-lock.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY ./package*.json ./

# Copy all files
COPY ./ ./

# Build app
RUN yarn config set registry https://registry.npm.taobao.org/
RUN yarn
RUN yarn build

# Run container as non-root (unprivileged) user
# The node user is provided in the Node.js Alpine base image
USER node
EXPOSE 8888

RUN ls -alh

# Run npm start script with PM2 when container starts
CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]