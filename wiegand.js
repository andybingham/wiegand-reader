const Wiegand = require('node-wiegand');
const w = new Wiegand();

module.exports = function (RED) {
	function WiegandNode(config) {
		RED.nodes.createNode(this, config);
		var node = this;
		
		w.begin({ d0: 5, d1: 6 });
		w.on('data', (data) => {
			node.log(`Got ${data.length} bits from wiegand with data`);
		});
		w.on('reader', (id) => {
			node.log(`Got ${id.toString(16)} from RFID reader`);
			node.send(id.toString(16));
		});
	}

	RED.nodes.registerType("wiegand-reader", WiegandNode);
}
