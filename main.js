
const fs = require('fs');
const https = require('https');
var inpath;
var outpath;

function download(filename, url) {
	let file = fs.createWriteStream(filename);
	https.get(url, function(response) {
		let stream = response.pipe(file);
		stream.on("finish", function() {
			file.close();
		});
	});
}

let prom = new Promise(getInput).then(main);

function getInput(resolve,reject) {
	const readline = require("readline").createInterface({
	    input: process.stdin,
	    output: process.stdout
	});
	readline.question("Insert the relative pathname of the CSV file: ", function(inp) {
		inpath = inp;
	    readline.question("Insert the relative pathname of the directory where you want to store the data: ", function(outp) {
	    	outpath = outp;
	        readline.close();
	        resolve();
	    });
	});
}


function main () {
	fs.readFile(__dirname + "/" + inpath + "/data.csv", "UTF-8", function(err, text) {
		let lines = text.split("\n");
		lines = lines.slice(1);
		for (let line of lines) {
			if (!line)
				return;

			let params = line.split(";");
			let dir = params[0];

			fs.mkdirSync(outpath + "/" + dir, { recursive: true });
			params = params.slice(2);

			for (let string of params) {
				if (string.startsWith('"'))
					string = string.slice(1);
				if (string.endsWith('"'))
					string = string.slice(0,-1);

				let filenameArr = string.split("/");
				let filename = filenameArr[filenameArr.length - 1];

				console.log(filename);

				download(outpath + "/" + dir + "/" + filename, string);
			}
		}
	});
}
