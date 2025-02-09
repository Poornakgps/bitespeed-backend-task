# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy the rest of the application files
COPY . .

# Expose the port your app runs on (change if needed)
EXPOSE 5000

# Wait for PostgreSQL to be ready before starting the app
CMD ["sh", "-c", "sleep 5 && npm run dev"]
