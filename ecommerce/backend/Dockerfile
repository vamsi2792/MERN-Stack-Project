FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Build React app if part of the same repo
# RUN npm run build

# Expose the backend port (e.g., 5000)
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
