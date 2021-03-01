const Wiegand = require('node-wiegand');

module.exports = function (RED) {
	var w = false;

	function WiegandNode(config) {
		RED.nodes.createNode(this, config);
		var node = this;
		node.w = (node.w) ? node.w : new Wiegand();
		
		node.w.begin({ d0: 5, d1: 6 });

		node.w.on('ready', () => {
			node.log('Ready');
			node.status({ fill: "green", shape: "ring", text: "Ready" });
		});

		node.w.on('data', (data) => {
			node.log(`Recvd ${data.length} bits`);
			if (data.length < 26) {
				node.status({ fill: "Failed", shape: "triangle", text: `Only ${data.length} bits` });
				var msg = {
					topic: 'bad',
					payload: {
						bits: data.length
					}
				}
				node.send(msg);
			}
		});
		node.w.on('reader', (id) => {
			node.log(`Read ${id.toString(16)}`);
			node.status({ fill: "green", shape: "ring", text: `Read ${id.toString(16)}` });
			var msg = {
				topic: 'good',
				payload: {
					int: id,
					hex: id.toString(16),
					oct: id.toString(8)
				}
			}
			node.send(msg);
		});

		node.on('close', () => {
			node.log(`Closing node, stopping IRQs`);
			w.stop();
		});
	}

	RED.nodes.registerType("wiegand-reader", WiegandNode);
}
