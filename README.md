# ac-tracker
Assetto Corsa Laptime Tracking Application [MERN - MongoDB, ExpressJS, ReactJS, NodeJS]

***

AC Tracker contains both a ReactJS client project, and also a Node/Express backend project. The backend should be setup and started first, from the root of the project directory. Then the client can be setup and started from the '<root_directory>/client/' directory.

## How to Initialise / Run Backend Project

To start the backend/server, from the project directory, you can run:

### `npm i`

Loads all dependencies for the server, based on configuration in the <root_directory>/package.json.

### `npm run devStart`

Runs the server in development mode.<br />
The server uses nodemon and will reload if you make edits.

## How to Initialise / Run Frontend Project

To start the frontend/client, from the '<root_directory>/client/' directory, you can run:

### `npm i`

Loads all dependencies into the client directory, based on configuration in the <root_directory>/client/package.json.

### `npm start`

Runs the app in development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The client will reload if you make edits.

***

AC Tracker is a web application that stores and displays Laptimes, along with Notes and Video Replay links, for comparison between drivers.

![AC Tracker - Lap Records - Screenshot](https://seren1ty-github-images.s3-ap-southeast-2.amazonaws.com/ac-tracker/ac-tracker_1_small.png)


***

It allows adding of new laps (along with new Cars and Tracks) as well as editing of existing lap entries.

![AC Tracker - Edit Lap - Screenshot](https://seren1ty-github-images.s3-ap-southeast-2.amazonaws.com/ac-tracker/ac-tracker_2_small.png)
