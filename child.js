var fs = require('fs');
var split = require('binary-split');

function setVars(obj) {
    if (!process.env.file) return false;
    if (!process.env.read_start) return false;
    if (!process.env.read_end) return false;

    var clean = {
        file: process.env.file,
        read_start: parseInt(process.env.read_start),
        read_end: parseInt(process.env.read_end)
    };

    return clean;
}

var env = setVars(process.env);
if (!env) process.exit(1);

var count = {
    success: 0,
    error: 0
};

// we need to leave `end` off and stop reading ourselves gracefully
// in order to always close on actual lines and not midway through one
    // which we're totally doing right now

fs.createReadStream(env.file, {
    start: env.read_start,
    end: env.read_end
})
.pipe(split())
.on('data', function(data) {
    var error = false;
    try {
        data = JSON.parse(data);
        // do the busy work here
    } catch(e) {
        error = true;
    }

    if (error) {
        count.error++;
    } else {
        count.success++;
    }
}).on('end', function() {
    console.log(JSON.stringify(count));
});
