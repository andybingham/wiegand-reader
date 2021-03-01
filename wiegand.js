const Wiegand = require('node-wiegand');
const w = new Wiegand();

module.exports = function (RED) {
	function WiegandNode(config) {
		RED.nodes.createNode(this, config);
		var node = this;
		
		w.begin({ d0: 5, d1: 6 });

		w.on('ready', () => {
			node.log('Ready');
			node.status({fill:"green",shape:"ring",text:"Ready"});
		});

		w.on('data', (data) => {
			node.log(`Recvd ${data.length} bits`);
			if (data.length < 34) {
				node.status({fill:"Failed",shape:"ring",text:`Only ${data.length} bits`});
			}
		});
		w.on('reader', (id) => {
			node.log(`Read ${id.toString(16)}`);
			node.status({fill:"green",shape:"ring",text:`Read ${id.toString(16)}`});
			var msg = {
				topic: 'tag',
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
