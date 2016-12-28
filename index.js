var fs = require('fs');
var exec = require('child_process').exec;
var cores = require('os').cpus().length;
var file = process.argv[2]; // or stdin, eventually
var node = process.argv[0];
var child_script = './child.js'; // configurable or some small subset, eventually

var stats = fs.statSync(file);
var chunkSize = stats.size/cores;
var command = [node, child_script].join(' ');

for (var i = 1; i <= cores; i++) {
    var beginning = Math.ceil(chunkSize * (i - 1));
    var end = Math.floor(chunkSize * i);

    var options = {
        env: {
            file: file,
            read_start: beginning,
            read_end: end
        }
    };

    exec(command, options, function(err, stdout, stderr) {
        if (err) return console.log(err);
        console.log(stdout);
    });
}
