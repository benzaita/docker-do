var dockerdo = require('.')

dockerdo({
	command: process.argv.slice(2).join(' '),
	workdir: process.cwd()
}, function(error, stdout, stderr) {
	if (error) {
		console.error(error)
		process.exit(1)
	} else {
		stdout.pipe(process.stdout)
		stderr.pipe(process.stderr)
	}
})
