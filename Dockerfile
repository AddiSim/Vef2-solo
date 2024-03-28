# Use an official Node runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to work directory
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Build the app
RUN npm run build

# Install serve to serve your app on port 3000
RUN npm install -g serve

# Inform Docker that the container listens on the specified port at runtime.
EXPOSE 3000

# Define the command to run your app using serve
CMD ["serve", "-s", "build", "-l", "3000"]