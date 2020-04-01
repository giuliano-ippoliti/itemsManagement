// client-side js
// run by the browser each time your view template referencing it is loaded

console.log('client.js loading...');

// Start with an empty array
let items = [];

// define variables that reference elements on our page

// unordered (bulleted) list
//const dreamsList = document.getElementById('dreams');

// form (including input text field and submit button)
const itemForm = document.forms[0];

// input text fields
const key1 = itemForm.elements['key1'];
const key2 = itemForm.elements['key2'];

// a helper function to call when our request for dreams is done (callback triggered after the completion of the XMLHttpRequest)
// cf itemsRequest.onload = getItemsListener;
const getItemsListener = function() {
	// parse our response (from /getItems) to convert to JSON

  // this: XMLHttpRequest to /getDreams
  // the response property is text : [{"dream":"Find and count some sheep"}, ... ]
  // dreams is an array of objects : [0] -> { dream: "Find and count some sheep" }, ...
	items = JSON.parse(this.response);

  	// iterate through every item and add it to our page
  	items.forEach( (item) => {
    		appendNewItem(item);
  	});
}

// request the items from our app's JSON database

// Use XMLHttpRequest (XHR) objects to interact with servers
const itemsRequest = new XMLHttpRequest();

// XMLHttpRequest.onload = callback;
// callback is the function to be executed when the request completes successfully.
// The value of this (i.e. the context) is the same XMLHttpRequest this callback is related to.
itemsRequest.onload = getItemsListener;

// XMLHttpRequest.open(method, url[, async[, user[, password]]])
itemsRequest.open('get', '/getItems');

// send the request to the server.
// If the request is asynchronous (which is the default), this method returns as soon as the request is sent
// and the result is delivered using events (cf: onload)
itemsRequest.send();

// OWASP : Except for alphanumeric characters, escape all characters with ASCII values less than 256 with the &#xHH; format (or a named entity if available) to prevent switching out of the attribute.
const OWASPescape = (str) => {
	return str.replace(/[%*+,-/;<=>^|]/g, '-');
} 

// a helper function that creates a list item for a given dream
const appendNewItem = (item) => {
	const newDiv = document.createElement('div');

	// Brutal way of converting object to text. Some work to do here. TODO
	var itemText = JSON.stringify(item, null, '  ');

	// beware of XSS!
	// https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet
	console.log(itemText);
	var sanitizedItem = OWASPescape(itemText);
	console.log(sanitizedItem);
	newDiv.innerHTML = sanitizedItem;

	document.body.appendChild(newDiv);
}

// function that inserts an item into the database file
const insertItem = (item) => {
	const http = new XMLHttpRequest();
	const url = '/insertItems';

	http.open("POST", url);
	http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

	console.log(item);  

	http.send(JSON.stringify(item));
}

// listen for the form to be submitted and add a new item when it is
itemForm.onsubmit = function(event) {
	// stop our form submission from refreshing the page
	event.preventDefault();

	// get item value and add it to the list
	var item1 = {};				// IMPROVE
	item1.key1 = key1.value;
	item1.key2 = key2.value;
	items.push(item1);			// TODO
	appendNewItem(item1);

	// call API to insert dream into the database
	insertItem(item1);

	// reset form
	key1.value = '';
	key1.focus();
	key2.value = '';
	key2.focus();
};

