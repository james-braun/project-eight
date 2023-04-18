// JavaScript source code

// includes express framework in project.
const express = require('express');
var sequelize = require("./models").sequelize;

// creates an express application.
const app = express();
const port = process.env.PORT || 3000;

// parse the databse data so it's readable.
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))

// create a icon in the tab of the webpage.
var favicon = require('serve-favicon');
var path = require('path');
app.use(favicon(path.join(__dirname, 'public/img', 'favicon.ico')))

// add css static assets.
app.use('/static', express.static('public'));

// installs pug templating engine.
app.set('view engine', 'pug');

// use seperate file for routes.
const routes = require('./routes');

app.use(routes);

// if route has made it this far without 
// matching a route. create an error object.
// create an error status and goto
// 'error handling funtion'
app.use((req, res, next) => {
    const err = new Error('404 - Path Not Found');
    err.status = 404;
    next(err);
});

// use 'error handling function' to print
// error to the console and render 
// error page.
app.use((err, req, res, next) => {

    // create an error status code
    res.status(err.status);

    // create an error page.
    console.log(err.message);
    if (err.status === 404) {
        res.render('page_not_found', { title: "Page Not Found" });
    } else if (err.status === 500) {
        res.render('error', { title: "Server Error" });
    }
});
// sets up the development server.
// the callback function tells what port
// the server is running on but first 
// sync the database.
sequelize.sync().then(function () {
    app.listen(port, () => {
        console.log(`The application is running on localhost:${port}!`);
    });
});