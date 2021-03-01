const Wiegand = require('node-wiegand');
const w = new Wiegand();

module.exports = function (RED) {
	function WiegandNode(config) {
		RED.nodes.createNode(this, config);
		var node = this;
		
		w.begin({ d0: 5, d1: 6 });

		w.on('ready', () => {
			node.log('Ready');
			var msg = {
				topic:'ready',
				payload: 'Ready'
			};
			node.send(msg);
			node.status({fill:"green",shape:"ring",text:"Ready"});
		});

		w.on('data', (data) => {
			node.log(`Recvd ${data.length} bits`);
			var msg = {
				topic:'bits',
				payload: {
					length: data.length
				}
			};
			node.send(msg);
		});
		w.on('reader', (id) => {
			node.log(`Read ${id.toString(16)}`);
			var msg = {
				topic: 'data',
				payload: {
					int: id,
					hex: id.toString(16),
					oct: id.toString(8)
				}
			}
		});
	}

	RED.nodes.registerType("wiegand-reader", WiegandNode);
}
