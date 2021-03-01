const Wiegand = require('node-wiegand');
const w = new Wiegand();

module.exports = function (RED) {
	function WiegandNode(config) {
		RED.nodes.createNode(this, config);
		var node = this;
		
		w.begin({ d0: 5, d1: 6 });
		w.on('data', (data) => {
			var msg = {
				topic:'msg',
				payload: data.length
			};
			node.send(msg);
		});
		w.on('reader', (id) => {
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
