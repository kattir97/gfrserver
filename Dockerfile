# Select a base image
FROM node:20.16-alpine3.20

# Create a directory  and go to the directory 
WORKDIR /app

# Copy the package.json file to my current directory to install the necessary dependence  
COPY package.json .

# Install the dependence
RUN npm install

# Copy other files to my current directory
COPY . .

# Build the TypeScript files
RUN npm run build

# Copy bash script
COPY start.sh .

# Make the script executable
RUN chmod +x start.sh

# Open the port for the express server
EXPOSE 10000

# Run Fastify in the foreground and generate types for the database
# CMD ["sh", "-c", "node dist/index.js & npm run generate:db:types"]

# Run the start-and-generate script
CMD ["./start-and-generate.sh"]
