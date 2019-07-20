FROM node:10

WORKDIR /my-gym-locator

# Install app dependencies
# We use a wildcard to make sure both 'package.json' and 'package-lock.json' are copied
COPY package*.json ./

RUN npm install

# For production
# RUN npm ci --only=production

COPY . .

# This instruction does NOT mean that the image will listen on the indicated port
# It serves only as documentation to indicate on which port the application was designed to listen
EXPOSE 80

CMD ["node", "server.js"]