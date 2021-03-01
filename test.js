const Wiegand = require('node-wiegand');
const w = new Wiegand();
w.begin({ d0: 5, d1: 6 });
w.on('data', (data) => {
  console.log('Got', data.length, 'bits from wiegand with data:');
});
w.on('reader', (id) => {
  console.log('Got', id, 'from RFID reader');
  console.log('Hex: ', id.toString(16));
});
