var fs = require('fs');
var exec = require('child_process').exec;
var args = require('minimist')(process.argv.slice(2));
var cores = args.c || args.C || args.cores || require('os').cpus().length || 1;
var file = args._[0]; // or stdin, eventually
var node = process.argv[0];
var childScript = './child.js'; // configurable or some small subset, eventually

if (!args._.length || args.help) {
    var help = [
        '• must specify a line-delimited file',
        JSON.stringify(args, null, 2)
    ].join('\n');
    return console.log(help);
}

var stats = fs.statSync(file);
var chunkSize = stats.size / cores;
var command = [node, childScript].join(' ');

for (var i = 1; i <= cores; i++) {
    var beginning = Math.ceil(chunkSize * (i - 1));
    var end = Math.floor(chunkSize * i);

    var options = {
        env: {
            file: file,
            readStart: beginning,
            readEnd: end
        }
    };

    exec(command, options, function (err, stdout) {
        if (err) return console.log(err);
        console.log(stdout);
    });
}
