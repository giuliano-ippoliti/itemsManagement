// client-side js
// run by the browser each time your view template referencing it is loaded

console.log('display.js loading...');

// Start with an empty array
let items = [];

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

// request the items from our app's JSON database

// Use XMLHttpRequest (XHR) objects to interact with servers
const DisplayRequest = new XMLHttpRequest();

// XMLHttpRequest.onload = callback;
// callback is the function to be executed when the request completes successfully.
// The value of this (i.e. the context) is the same XMLHttpRequest this callback is related to.
DisplayRequest.onload = displayItems;

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

function escapeHtml(text) {
	var map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};
 
	return text.replace(/[&<>"']/g, function(m) { return map[m]; });
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
		txt += "<b>" + escapeHtml(x) + "</b>: " + escapeHtml(item[x]) + "<br>";
		//txt += "<b>" + x + "</b>: " + item[x] + "<br>";
	}
	txt += "<br>" ;
	return txt;
}
