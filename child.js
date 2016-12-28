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

var count = {
    success: 0,
    error: 0
};

// we need to leave `end` off and stop reading ourselves gracefully
// in order to always close on actual lines and not midway through one
    // which we're totally doing right now

fs.createReadStream(env.file, {
    start: env.readStart,
    end: env.readEnd
})
.pipe(split())
.on('data', function (data) {
    var error = false;
    try {
        JSON.parse(data);
        // do the busy work here
    } catch (e) {
        error = true;
    }

    if (error) {
        count.error++;
    } else {
        count.success++;
    }
}).on('end', function () {
    console.log(JSON.stringify(count));
});
