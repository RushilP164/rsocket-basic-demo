const { RSocketServer } = require("rsocket-core");
const { WebsocketServerTransport } = require("rsocket-websocket-server");
const WebSocket = require("ws");

const port = 9090;

const server = new RSocketServer({
	transport: new WebsocketServerTransport({
		wsCreator: (options) => {
			return new WebSocket.Server({
				port: port,
			});
		},
	}),
	acceptor: {
		accept: async () => ({
			requestResponse: (payload, responderStream) => {
				const data = payload.data.toString();
				console.log(`Received Request/Stream request: ${data}`);
				responderStream.onNext(
					{ data: Buffer.from("Request/Response message") },
					true
				);
				return {
					cancel: () => {
						console.log("Request/Response cancelled");
					},
					onExtension: () => {
						console.log("Received Extension request");
					},
				};
			},
			requestStream: (payload, _, responderStream) => {
				const data = payload.data.toString();
				console.log(`Received Request/Stream request: ${data}`);

				let count = 0;
				const interval = setInterval(() => {
					if (count < 5) {
						responderStream.onNext({
							data: Buffer.from(`Request/Stream message ${count}`),
						});
						count++;
					} else {
						responderStream.onComplete();
						clearInterval(interval);
					}
				}, 1000);

				return {
					cancel: () => {
						clearInterval(interval);
						console.log("Request/Stream cancelled");
					},
					onExtension: () => {
						console.log("Received Extension request");
					},
				};
			},
		}),
	},
});

(async () => {
	await server.bind();
	console.log(`Server listening on port ${port}`);
})();
