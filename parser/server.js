/**
* @brief Does the request to the prolog server
* @param asker the entite that askes to do the request
* @param requestString the requet
* @param onSuccess the function to call when the request is successful (may not be told)
* @param onError the function to call when the request is fails (may not be told)
* @param port the port of the request (may not be told)
**/
function getPrologRequest(asker,requestString, onSuccess, onError, port) {
	var requestPort = port || 8081
	var request = new XMLHttpRequest();
	request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

	request.asker = asker;
	request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
	request.onerror = onError || function(){console.log("Error waiting for response");};

	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send();
}
/**
* @brief Creates a request
**/
function makeRequest() {
	// Get Parameter Values
	var requestString = document.querySelector("#query_field").value;
	// Make Request
	getPrologRequest(requestString, handleReply);
}
