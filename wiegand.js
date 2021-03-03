const Gpio = require('onoff').Gpio;

module.exports = function (RED) {
	var D0 = false;
	var D1 = false;
	var buffer = [];

	function WiegandNode(config) {
		RED.nodes.createNode(this, config);
		var node = this;
		// which pins to use
		pinD0 = 5;
		pinD1 = 6;
		// set up the pins for rising trigger
		this.D0 = new Gpio(pinD0, 'in', 'rising');
		this.D1 = new Gpio(pinD1, 'in', 'rising');

		this.D0.watch((err,value)=>{
			node.buffer.push(0);
			node.log(`D0 Buffered: ${buffer.length}`);
		});
		this.D1.watch((err,value)=>{
			node.buffer.push(1);
			node.log(`D1 Buffered: ${buffer.length}`)
		});

		node.status({ fill: "green", shape: "ring", text: "Ready" });
		node.log('Ready');

		node.on('close', () => {
			unwatchAll();
			node.status({ fill: "red", shape: "ring", text: "Stopped" });
			node.log('Stopped');
		});
	}

	RED.nodes.registerType("wiegand-reader", WiegandNode);
}
