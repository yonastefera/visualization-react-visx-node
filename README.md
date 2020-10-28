#The app created by Create React App

###To run the app you have two ways:

1. Run it by docker `docker-compose up` and the app will start on `localhost:80`
2. Run it by `npm i` and `npm run start` and the app will start on `localhost:3000`

##Note:
In development of the app I used Material-UI, visx, node.js + express for server.

The app divided to two folders `server` and `src`.
In server folder you can see node.js server with dataManager for proceed travel data and calculate total amount of travels.

In src folder you can see React frontend app.

Main idea of frontend app architecture to keep data loading on top of the app and pass to children only result of requests. So Components doesn't know a source of data and that source of data could be changed in the future.

Folder Containers keeps one container called 'Dashboard' and could grow in the future if we'll want to add few more pages.
And folder Components keeps reusable components.
