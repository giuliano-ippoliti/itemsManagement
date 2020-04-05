// server.js
// where your node app starts

// init project

// Express web framework for Node.js: https://expressjs.com/
// express is a function
var express = require('express');

// Node.js body parsing middleware.
// Parse incoming request bodies in a middleware before your handlers, available under the req.body property
var bodyParser = require('body-parser');

// Read environment varibale in .env (PORT, ...)
const dotenv = require('dotenv');
dotenv.config();

// DB as JSON file
var fs = require('fs');

//API KEY
const SECRET = process.env.SECRET;

// array of objects (items)
var items = [];

var dbFile = 'items.json';

// Functions
const saveToDbFile = () => {
	// converting to JSON for storing in db file
	var initJsonStr = JSON.stringify(items, null, '  ');

	//console.log(initJsonStr);

	fs.writeFile(dbFile, initJsonStr, function(err) {
		if (err) {
			console.log(err);
		}
	});
}

// Loading items
var exists = fs.existsSync(dbFile);
if (!exists) {
	// initializing with a first item
	items.push({key1: "first key", key2: "Giuliano"});

	// store in db file
	saveToDbFile();
}
else {
	console.log('Database file is ready to go!');

	// read db file for storage in items
	var contents = fs.readFileSync(dbFile);

	// load items to items array
	items = JSON.parse(contents);

	//console.log('Loaded: ', items);
}

// Web application instance
var app = express();

// Express Middlewares

// parse URL-encoded forme
app.use(bodyParser.urlencoded({ extended: true }));

// parse JSON
app.use(bodyParser.json());

// http://expressjs.com/en/starter/static-files.html
// Now we can use files in the public folder, without prefix (cf: app.use('/static', express.static('public')); )
app.use(express.static('public'));

// Serve static html at "/"
// http://expressjs.com/en/starter/basic-routing.html
app.get('/', (request, response) => {
	response.sendFile(__dirname + '/views/index.html');
});

app.get('/insert', (request, response) => {
	response.sendFile(__dirname + '/views/insert.html');
});

// endpoint to get all the items in the database
app.get('/getItems', (request, response) => {
	response.send(JSON.stringify(items));
});

// endpoint to insert an item into the database
app.post('/insertItems', (request, response) => {
	// thanks to the json middleware, we are able to parse the body, which includes the new item
	const newItem = request.body.item;
	const apisecret = request.body.secret;

	if (apisecret == SECRET) {
		console.log('API key is ok, authentication succeded');

		// add new item to items array
		items.push(newItem);

		// save to db file
		saveToDbFile();

		// send response
		response.send(JSON.stringify(newItem));
	}
	else {
		console.log('API key is NOT ok, authentication failed');
		response.sendStatus(403);
	}
});

// listen for requests
var listener = app.listen(process.env.PORT, () => {
	console.log('Your app is listening on port ' + listener.address().port);
});

