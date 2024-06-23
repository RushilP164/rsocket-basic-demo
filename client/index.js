import { RSocketConnector } from "rsocket-core";
import { WebsocketClientTransport } from "rsocket-websocket-client";

(async () => {
	const outputDiv1 = document.querySelector("#output1");
	const outputDiv2 = document.querySelector("#output2");

	const connector = new RSocketConnector({
		transport: new WebsocketClientTransport({
			url: "ws://localhost:9090",
			wsCreator: (url) => new WebSocket(url),
		}),
	});

	const rsocket = await connector.connect();

	rsocket.requestResponse(
		{
			data: Buffer.from(
				"Hello World (from Request/Response interaction model)"
			),
		},
		{
			onError: (e) => console.error(e),
			onNext: (payload, isComplete) => {
				const div = document.createElement("div");
				div.textContent = `[${new Date().toISOString()}] payload[data: ${
					payload.data
				}; metadata: ${payload.metadata}] | isComplete: ${isComplete}`;
				outputDiv1.appendChild(div);
			},
			onComplete: () => {
				const div = document.createElement("div");
				div.textContent = `Request-Response completed...`;
				outputDiv1.appendChild(div);
			},
			onExtension: () => {},
		}
	);

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
				}; metadata: ${payload.metadata}] | isComplete: ${isComplete}`;
				outputDiv2.appendChild(div);
			},
			onComplete: () => {
				const div = document.createElement("div");
				div.textContent = `Request-Stream completed...`;
				outputDiv2.appendChild(div);
			},
			onExtension: () => {},
		}
	);
})();
