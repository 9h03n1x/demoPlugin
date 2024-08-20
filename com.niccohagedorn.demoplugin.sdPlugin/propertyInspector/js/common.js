
// this is our global websocket, used to communicate from/to Stream Deck software
// and some info about our plugin, as sent by Stream Deck software
var websocket = null,
    uuid = null,
    actionInfo = {}
function connectElgatoStreamDeckSocket(inPort, inUUID, inRegisterEvent, inInfo, inActionInfo) {
    uuid = inUUID;
    // please note: the incoming arguments are of type STRING, so
    // in case of the inActionInfo, we must parse it into JSON first
    actionInfo = JSON.parse(inActionInfo); // cache the info
	console.log(inActionInfo);
	
	const e = new CustomEvent("setValuesInPI", {detail: actionInfo})
	document.dispatchEvent(e);
    websocket = new WebSocket('ws://localhost:' + inPort)
    // if connection was established, the websocket sends
    // an 'onopen' event, where we need to register our PI
    websocket.onopen = function () {
        var json = {
            event: inRegisterEvent,
            uuid: inUUID
        };
        // register property inspector to Stream Deck
        websocket.send(JSON.stringify(json));
    }
}

// our method to pass values to the plugin
function sendValueToPlugin(value, param) {
	console.log(`sendValueToPlugin called => ${param} : ${value}`)
    if (websocket) {
        const json = {
            "action": actionInfo['action'],
            "event": "sendToPlugin",
            "context": uuid,
            "payload": {
                [param]: value
            }
        };
        websocket.send(JSON.stringify(json));
    }
}

function sendToPropertyInspector(value, param){
	console.log("sendToPropertyInspector called")
	if (websocket) {
        const json = {
            "action": actionInfo['action'],
            "event": "sendToPropertyInspector",
            "context": uuid,
            "payload": {
                [param]: value
            }
        };
        websocket.send(JSON.stringify(json));
    }

}




