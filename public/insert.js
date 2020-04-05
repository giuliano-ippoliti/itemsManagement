// client-side js
// run by the browser each time your view template referencing it is loaded

console.log('insert.js loading...');

// define variables that reference elements on our page

// form (including input text field and submit button)
const itemForm = document.forms[0];

// input text fields
const key1 = itemForm.elements['key1'];
const key2 = itemForm.elements['key2'];
const secret = itemForm.elements['secret'];

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
const InsertRequest = new XMLHttpRequest();

InsertRequest.onload = checkInsertedItem;

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

