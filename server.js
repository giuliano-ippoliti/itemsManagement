// server.js
// where your node app starts

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

// From .env file
const SECRET = process.env.SECRET;
const COLLECTION_NAME = process.env.COLLECTION_NAME;
const COLLECTION_PROPERTIES = process.env.COLLECTION_PROPERTIES;

// array of property names for the collection
const collection_props = JSON.parse(COLLECTION_PROPERTIES);

// array of objects (items)
var items = [];

var dbFile = 'items.json';	// TODO customize

// Functions
const saveToDbFile = () => {
	// converting to JSON for storing in db file
	var initJsonStr = JSON.stringify(items, null, '  ');

	fs.writeFile(dbFile, initJsonStr, function(err) {
		if (err) {
			console.log(err);
		}
	});
}

// Loading items
var exists = fs.existsSync(dbFile);

if (exists) {
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

// endpoint to get collection's details
app.get('/getCollectionInfo', (request, response) => {
	var collection = {};
	collection.name = COLLECTION_NAME;
	collection.properties = collection_props;

	response.send(JSON.stringify(collection));
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

