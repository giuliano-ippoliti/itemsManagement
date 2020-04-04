// client-side js
// run by the browser each time your view template referencing it is loaded

console.log('client.js loading...');

// Start with an empty array
let items = [];

// define variables that reference elements on our page

// form (including input text field and submit button)
const itemForm = document.forms[0];

// input text fields
const key1 = itemForm.elements['key1'];
const key2 = itemForm.elements['key2'];
const secret = itemForm.elements['secret'];

// a helper function to call when our request for items is done (callback triggered after the completion of the XMLHttpRequest)
// cf DisplayRequest.onload = displayItems;
const displayItems = function() {
	// parse our response (from /getItems) to convert to JSON

	//check status
	//console.log('status:', this.status);

	// this: XMLHttpRequest to /getItems
	// items is an array of objects
	items = JSON.parse(this.response);

  	// iterate through every item and add it to our page
  	items.forEach( (item) => {
    		appendNewItem(item);
  	});
}

const displayInsertedItem = function() {
	// parse our response (from /insertItems) to convert to JSON
	console.log(this.status);
	
	//check status
	if (this.status == 200) {
		// this: XMLHttpRequest to /getItems
		// items is an array of objects
		item = JSON.parse(this.response);

	  	// display inserted item
		appendNewItem(item);
	}
	else {
		alert('Invalid secret');
	}

}

// request the items from our app's JSON database

// Use XMLHttpRequest (XHR) objects to interact with servers
const DisplayRequest = new XMLHttpRequest();
const InsertRequest = new XMLHttpRequest();

// XMLHttpRequest.onload = callback;
// callback is the function to be executed when the request completes successfully.
// The value of this (i.e. the context) is the same XMLHttpRequest this callback is related to.
DisplayRequest.onload = displayItems;
InsertRequest.onload = displayInsertedItem;

// XMLHttpRequest.open(method, url[, async[, user[, password]]])
DisplayRequest.open('get', '/getItems');

// send the request to the server.
// If the request is asynchronous (which is the default), this method returns as soon as the request is sent
// and the result is delivered using events (cf: onload)
DisplayRequest.send();

// OWASP : Except for alphanumeric characters, escape all characters with ASCII values less than 256 with the &#xHH; format (or a named entity if available) to prevent switching out of the attribute.
const OWASPescape = (str) => {
	return str.replace(/[%*+,-/;<=>^|]/g, '-');
} 

// a helper function that displays a new item
const appendNewItem = (item) => {
	const newDiv = document.createElement('div');

	// Brutal way of converting object to text. Some work to do here. TODO
	//var itemText = JSON.stringify(item, null, '  ');

	// HTML table from array of objects
	var itemText = JSON2HTMLtext(item);

	newDiv.innerHTML = itemText;

	document.body.appendChild(newDiv);
}

// function that inserts an item into the database file
const insertItem = (apirequest) => {
	const url = '/insertItems';

	InsertRequest.open("POST", url);
	InsertRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

	InsertRequest.send(JSON.stringify(apirequest));
}

const JSON2HTMLtable = (item) => {
	var txt = "";
	txt += "<table border='1'>";
	for (x in item) {
		// beware of XSS!
		// https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet
		//txt += "<tr><td>" + OWASPescape(x) + "</td><td>" + OWASPescape(item[x]) + "</td></tr>";
		txt += "<tr><td>" + x + "</td><td>" + item[x] + "</td></tr>";
	}
	txt += "</table><br>" ;
	return txt;
}

const JSON2HTMLtext = (item) => {
	var txt = "";
	for (x in item) {
		// beware of XSS!
		// https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet
		//txt += "<tr><td>" + OWASPescape(x) + "</td><td>" + OWASPescape(item[x]) + "</td></tr>";
		txt += "<b>" + x + "</b>: " + item[x] + "<br>";
	}
	txt += "<br>" ;
	return txt;
}

// listen for the form to be submitted and add a new item when it is
itemForm.onsubmit = function(event) {
	// stop our form submission from refreshing the page
	event.preventDefault();

	// get item value and add it to the list
	var item1 = {};
	item1.key1 = key1.value;
	item1.key2 = key2.value;

	// non, ça on ne devrait le faire qu'une fois la réponse validée !
	//appendNewItem(item1);

	var apisecret = secret.value;

	var apirequest = {};
	apirequest.item = item1;
	apirequest.secret = apisecret;

	// call API to insert item into the database base
	insertItem(apirequest);

	// reset form
	key1.value = '';
	key1.focus();
	key2.value = '';
	secret.value = '';
};

