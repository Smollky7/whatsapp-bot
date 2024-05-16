const { generateQRCode } = require('./src/loader/qrCodeGenerator');
const client = generateQRCode(); 

const clientLoader = require('./src/loader/clientLoader');
clientLoader();

