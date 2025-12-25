FROM node:20.19-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy application files
COPY . .

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
