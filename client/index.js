import { RSocketConnector } from "rsocket-core";
import { WebsocketClientTransport } from "rsocket-websocket-client";

const connector = new RSocketConnector({
  transport: new WebsocketClientTransport({
    url: "ws://localhost:9090",
    wsCreator: (url) => new WebSocket(url),
  }),
});
const rsocket = await connector.connect();


// Buttons handle
const button1 = document.getElementById('requestResponse');
button1.addEventListener('click', requestResponse);

const button2 = document.getElementById('requestStream1');
button2.addEventListener('click', () => requestStream(1));

const button3 = document.getElementById('requestStream2');
button3.addEventListener('click', () => requestStream(2));


function requestResponse() {
	const outputDiv = document.querySelector("#output1");
	outputDiv.appendChild(Object.assign(document.createElement('div'), { textContent: 'Request sent!' }));

	rsocket.requestResponse(
		{
			data: Buffer.from("Hello World (from Request/Response interaction model)"),
		},
		{
			onError: (e) => console.error(e),
			onNext: (payload, isComplete) => {
				const div = document.createElement("div");
				div.textContent = `[${new Date().toISOString()}] payload[data: ${
					payload.data
				}; metadata: ${payload.metadata}] | isComplete: ${isComplete}`;
				outputDiv.appendChild(div);
			},
			onComplete: () => {
				const div = document.createElement("div");
				div.textContent = `Request-Response completed...`;
				outputDiv.appendChild(div);
			},
			onExtension: () => {},
		}
	);
}

function requestStream(id) {
	const outputDiv = document.querySelector(`#stream${id}`);
	outputDiv.appendChild(Object.assign(document.createElement('div'), { textContent: 'Request sent!' }));

	rsocket.requestStream(
		{
			data: Buffer.from("Hello World (from Request/Stream interaction model)"),
		},
		5, // requesting 5 items
		{
			onError: (e) => console.error(e),
			onNext: (payload, isComplete) => {
				const div = document.createElement("div");
				div.textContent = `[${new Date().toISOString()}] payload[data: ${
					payload.data
				}; metadata: ${payload.metadata}] | isComplete: ${isComplete} | stream: ${id}`;
				outputDiv.appendChild(div);
			},
			onComplete: () => {
				const div = document.createElement("div");
				div.textContent = `Request-Stream completed...`;
				outputDiv.appendChild(div);
			},
			onExtension: () => {},
		}
	);
}
