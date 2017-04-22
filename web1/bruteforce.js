var CRC32 = require('crc-32');

let password = 1;

while (true) {
	if (CRC32.str(password.toString(16)) === 0x3CC34518) {
		console.log({p: password}); // { p: 1032496241 } // 3d8aa471
		break;
	}
	
	if (password != 0 && password % 1000000 == 0) {
		console.log("Progress: " + password);
	}
	
	password++;
}
