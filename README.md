# my-gym-locator
[Work in Progress] Web application to locate SATS gym centers on a map and see the available facilities

## Brief Description
The purpose is to make it easy to check whether your favorite SATS gym center is open, and also to check the available facilities, all of which in English and easy to access in one single map.

The application is deployed at [this link](https://my-gym-locator.herokuapp.com/)

The original SATS website are:
- [Sweden](https://www.sats.se/): [Centers JSON](https://www.sats.se/webapi/filteredcenters/sv/0/0)
- [Norway](https://www.sats.no/): [Centers JSON](https://www.sats.se/webapi/filteredcenters/no/0/0)
- [Denmark](https://www.sats.com/): [Centers JSON](https://www.sats.com/webapi/filteredcenters/da/0/0)
- [Finland](https://www.elixia.fi/) (Named Elixia): [Centers JSON](https://www.sats.se/webapi/filteredcenters/fi/0/0)

_N.B.:_ The map is provided externally, but if you want to have a self-hosted map then I have a script to deploy an OpenStreetMap server [here](https://github.com/redouane-dev/my-scripts/blob/master/install-openstreetmap-tile-server.sh).


## Specifications
This project uses [Mapbox](https://www.mapbox.com/) and is deployed via [Docker](https://www.docker.com/) on [Heroku](https://www.heroku.com).


## How to Start the Server

You can run the server via [Node JS](https://nodejs.org/en/) CLI or via a [Docker](https://www.docker.com/) container.

We'll start by cloning or downloading the project.

##### Clone Github repo

```bash
# Clone the Github repo
# cd to your project directory
cd <path-to-project-directory>

git clone https://github.com/redouane-dev/my-gym-locator.git
```

##### Download as ZIP

N.B.: By downloading instead of cloning, you will not have access to the Git branches, commits, ...etc.

```bash
# cd to your project directory
cd <path-to-project-directory>

# Download
wget "https://github.com/redouane-dev/my-gym-locator/archive/master.zip"

# Unzip
unzip master.zip

# Rename the project directory
mv my-gym-locator-master/ my-gym-locator/
```

### Starting the server

#### Node CLI

```bash
# Install the depedencies by going the project directory and installing with NPM
cd <path-to>/my-gym-locator
npm install

# For development mode (To add the changes to the server automatically without restarting during development)
npm install --no-save nodemon # You can add -g to install globally

# Start (You'll see something like "... Server listening on PORT ...")
node server.js

# For development mode
nodemon --ignore static/data server.js
```

#### Dockerized Application

```bash
# Build a new docker image and a new container base on it
# Notice the dot at the end
# Add --file <dockerfile-name> to specify non-default Dockerfile
docker build --tag <image-name> .

# Check that the image with name <image-name> has been successfully created
docker images

# We're going to set the external port to 4444 but any free port can work. The internal port is designed to be 4444.
docker run --detach -p 4444:4444 <image-name>
```

### Opening the app in localhost

After spinning the server, you can open your browser at http://localhost:4444/ to see the map

![Image displayed at localhost](./docs/images/localhost.png)


## Perspectives

- Improve the UX
- Add other gyms

## Resources
- [Building a store locator](https://docs.mapbox.com/help/tutorials/building-a-store-locator/)
- [Dockerizing a Node.js web app](https://nodejs.org/de/docs/guides/nodejs-docker-webapp/)
- [Build a Weather Website in 30 minutes with Node.js + Express + OpenWeather](https://codeburst.io/build-a-weather-website-in-30-minutes-with-node-js-express-openweather-a317f904897b)
- [Using EJS with Express](https://github.com/mde/ejs/wiki/Using-EJS-with-Express)

## Useful Docs
- [Mapbox Web applications](https://docs.mapbox.com/help/how-mapbox-works/web-apps/)
- [Style Specification](https://docs.mapbox.com/mapbox-gl-js/style-spec/)
- [Style-optimized vector tiles](https://docs.mapbox.com/help/glossary/style-optimized-vector-tiles/)
