const debug = require('debug')('docker-do')
const dnif = require('dnif')
const path = require('path')
const fs = require('fs')
const child_process = require('child_process')

const createComposeFileIfAbsent = function(dir, callback) {
	const composeFile = path.join(dir,'docker-compose.yml')
	const stats = fs.stat(composeFile, function(error, stats) {
		if (error) {
			debug('creating ' + composeFile)
			fs.writeFile(composeFile,
				`
runner:
    build: .
    dockerfile: ./Dockerfile
    volumes:
      - .:/workspace
`,
				function(error) {
					callback(error, error ? null : composeFile)
				})
		} else {
			callback(null, composeFile)
		}
	})
}

const dockerComposeRun = function(dir, command, callback) {
	const child = child_process.exec(
		`docker-compose run runner '${command}'`,
		{ cwd: dir })
	callback(null, child.stdout, child.stderr)
}

const dockerdo = function(options, callback) {
	debug('with options=' + JSON.stringify(options))
	if (!options.workdir) {
		options.workdir = __dirname
	}


	dnif({
		name: 'Dockerfile',
		startPath: options.workdir
	}, function(error, dir) {
		if (error) {
			callback(error)
		} else if (!dir) {
			callback(new Error('could not find Dockerfile'))
		} else {			
			debug('found Dockerfile in: ' + dir)

			createComposeFileIfAbsent(dir, (error, composeFile) => {
				if (error) {
					callback(error)
				} else {
					const relativeDir = path.relative(dir, options.workdir) || '.'
					const command = `cd ${relativeDir} && ${options.command}`

					debug('running in container: ' + command)
					dockerComposeRun(dir, command, callback)
				}
			})
		}
	})
}

module.exports = dockerdo
