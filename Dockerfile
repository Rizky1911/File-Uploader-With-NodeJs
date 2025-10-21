    # Use a lightweight official Node.js image
    FROM node:alpine

    # Set the working directory in the container
    WORKDIR /app

    # Copy package.json and package-lock.json (if present)
    COPY package*.json ./

    # Install dependencies
    RUN npm install

    # Copy the rest of the application files
    COPY . .

    # Expose the port your application listens on
    EXPOSE 3001

    # Command to run the application
    CMD ["node", "server.js"]