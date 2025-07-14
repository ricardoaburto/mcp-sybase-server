# Use a base image with Java JDK to compile and run the Sybase connector
FROM openjdk:11-jdk

# Install Node.js and npm
RUN apt-get update && \
    apt-get install -y nodejs npm

# Set the working directory inside the container
WORKDIR /app

# Copy all application files to the working directory
COPY . .

# Compile the Java source file for Sybase connectivity
RUN javac -cp "lib/jtds-1.3.1.jar" SybaseQuery.java

# Install Node.js dependencies and build the TypeScript project
# The "prepare" script in package.json will automatically run "npm run build"
RUN npm install

# Set the entrypoint to run the server when the container starts
ENTRYPOINT ["node", "dist/src/index.js"]