// client-side js
// run by the browser each time your view template referencing it is loaded

console.log('insert.js loading...');

// name and properties of the collection (from /getCollectionInfo)
var name = "";
var properties = [];

// define variables that reference elements on our page

// form (including input text field and submit button)
const formDiv = document.getElementById("properties");
const itemForm = document.forms[0];

var secret = itemForm.elements['secret'];
//const secret = itemForm.elements['secret'];

const checkInsertedItem = function() {
	// parse our response (from /insertItems) to convert to JSON
	console.log(this.status);
	
	//check status
	if (this.status == 200) {
		alert('Item successfully inserted');
		// TODO load index.html
	}
	else {
		alert('Invalid secret');
	}

}

// Use XMLHttpRequest (XHR) objects to interact with servers
const GetInfoRequest = new XMLHttpRequest();
const InsertRequest = new XMLHttpRequest();

const displayInfo = function() {
	// parse our response (from /getCollectionInfo) to convert to JSON
	var info = JSON.parse(this.response);

	name = info.name;
	properties = info.properties;

	console.log(name);
	console.log(properties);

	// create inputs
	properties.forEach( (item) => {
		var input = document.createElement("input");
		input.type = "text";
		input.name = item;
		itemForm.appendChild(input);
	});
	secret = document.createElement("input");
	secret.type = "password";
	secret.name = "secret";
	itemForm.appendChild(secret);

	//create button
	var button = document.createElement("button");
	button.type = "submit";
	button.innerHTML = "Add item";
	itemForm.appendChild(button);
	//<button type="submit" id="add-item">Add item</button>
}

GetInfoRequest.onload = displayInfo;

InsertRequest.onload = checkInsertedItem;

// Get info for the collection
GetInfoRequest.open('get', '/getCollectionInfo');
GetInfoRequest.send();

// OWASP : Except for alphanumeric characters, escape all characters with ASCII values less than 256 with the &#xHH; format (or a named entity if available) to prevent switching out of the attribute.
const OWASPescape = (str) => {
	return str.replace(/[%*+,-/;<=>^|]/g, '-');
} 

// function that inserts an item into the database file
const insertItem = (apirequest) => {
	const url = '/insertItems';

	InsertRequest.open("POST", url);
	InsertRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

	InsertRequest.send(JSON.stringify(apirequest));
}

// listen for the form to be submitted and add a new item when it is
itemForm.onsubmit = function(event) {
	// stop our form submission from refreshing the page
	event.preventDefault();
	console.log("new item submitted");
	// get item value and add it to the list
	var item1 = {};

	properties.forEach( (item) => {
		item1[item] = itemForm.elements[item].value;
	});

	var apisecret = secret.value;

	var apirequest = {};
	apirequest.item = item1;
	apirequest.secret = apisecret;

	// call API to insert item into the database base
	insertItem(apirequest);

	// reset form
	properties.forEach( (item) => {
		itemForm.elements[item].value = '';
	});
	secret.value = '';
};

