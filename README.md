# my-gym-locator
[Work in Progress] Web application to locate SATS gym centers on a map and see the available facilities

### Brief Description
The purpose is to make it easy to check whether your favorite SATS gym center is open, and also to check the available facilities, all of which in English and easy to access in one single map.

The original SATS website are:
- [Sweden](https://www.sats.se/)
- [Norway](https://www.sats.no/)
- [Denmark](https://www.sats.com/)
- [Finland](https://www.elixia.fi/) (Named Elixia)


### Specifications
This project uses [Mapbox](https://www.mapbox.com/) and is deployed via [Docker](https://www.docker.com/) on [Heroku](https://www.heroku.com) as a web application.


### Containerized Application

N.B.: We don't need a virtual environment for development in this case, as the application is dockerized.

#### Build the Image
```bash
# Build a new docker image and a new container base on it
docker build --file Dockerfile --tag <image-name> .

# Check that the image with name <image-name> has been successfully created
docker images
```

#### Run the Container
```bash
# We're going to set the external port to 8080 but any free port can work. The internal port is designed to be 5000.
docker run --detach -p 8080:5000 <image-name>
```

#### Open the Application

After running the container, you can open your browser at http://localhost:8080/ to see a map (You can customize your port number).

![Image displayed at localhost](./docs/images/localhost.png)


## Perspectives

- Validate deployment on Heroku
- Parse JSON/XML files from the gym's website
- Display markers on the map
- Add popups and information on the markers
- Automate the process of fetching/parsing/displaying as a CRON job or others.
- ...
