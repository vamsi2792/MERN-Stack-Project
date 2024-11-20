# Frontend Dockerfile
# Stage 1: Build the React app
FROM node:16 as builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Use Caddy to serve the built files
FROM caddy:latest

# Copy React build output to Caddy's web root
COPY --from=builder /app/build /usr/share/caddy

# Expose the default Caddy port
EXPOSE 443

# Default Caddyfile (can be overridden with a custom Caddyfile)
CMD ["caddy", "file-server", "--root", "/usr/share/caddy"]