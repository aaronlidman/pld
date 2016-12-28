var fs = require('fs');
var split = require('binary-split');

function setVars() {
    if (!process.env.file) throw new Error('missing file env var');
    if (!process.env.readStart) throw new Error('missing readStart env var');
    if (!process.env.readEnd) throw new Error('missing readEnd env var');

    return {
        file: process.env.file,
        readStart: parseInt(process.env.readStart),
        readEnd: parseInt(process.env.readEnd)
    };
}

var env = setVars();
if (!env) throw new Error('missing env vars');

var bytes = -1;
var readLimit = env.readEnd - env.readStart;
var reading = true;

var readStream = fs.createReadStream(env.file, {
    start: env.readStart
});

readStream.pipe(split('\n'))
.on('data', function (data) {
    if (!reading) return;
    bytes += data.length + 1; // + 1 for the newline that was stripped

    if (bytes < readLimit) {
        data = data.toString();
        var validBegin = data[0] === '{';
        // because we start reading at an arbitrary point in the file there's no guarantee
        // we get clean line breaks, so we check and process lines with a known good first char
        if (validBegin) processLine(data);
    } else {
        // flush the current line
        processLine(data.toString());
        reading = false;
        this.end();
    }
}).on('end', function () {
    readStream.destroy();
    console.log(count);
});

var count = 0;

function processLine(line) {
    count++;
}
