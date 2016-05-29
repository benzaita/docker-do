var assert = require('assert')
var os = require('os')
var mktemp = require('mktemp')
var path = require('path')
var rmdir = require('rmdir')
var dockerdo = require('..')
const fs = require('fs')

const readAll = function(readable, callback) {
	var data = ''
	
	readable.on('data', chunk => data += chunk)
	readable.on('error', err => callback(err))
	readable.on('end', () => callback(null, data))
}

describe('docker-do', function() {
	const testContext = this

	beforeEach(function(done) {
		mktemp.createDir(path.join(os.tmpdir(),'XXXX'), function(err,dir) {
			testContext.workspace = dir
			fs.writeFile(
				path.join(testContext.workspace,'Dockerfile'),
				`
FROM busybox
ENTRYPOINT ["/bin/sh","-c"]
WORKDIR /workspace
`,
				(err) => done())
		})
	})

	afterEach(function(done) {
		rmdir(testContext.workspace, function(err) {
			testContext.workspace = undefined
			done()
		})
	})

	describe('#run()', function() {

		const findContainerWorkdir = function(callback) {
			dockerdo({
				command: 'pwd',
				workdir: testContext.workspace
			}, function(error, stdout, stderr) {
				assert.equal(null, error)
				readAll(stdout, callback)
			})
		}

		it('should run the command from the relative directory inside the container', function(done) {
			findContainerWorkdir((error, containerWorkdir) => {
				const workdirOnHost = path.join(testContext.workspace,'foo')
				const workdirInContainer = path.join(containerWorkdir, 'foo')

				fs.mkdir(workdirOnHost, function(error) {
					dockerdo({
						command: 'pwd',
						workdir: workdirOnHost
					}, function(error, stdout, stderr) {
						assert.equal(null, error)
						readAll(stdout, function(err, output) {
							assert.equal(workdirInContainer, output)
							done()
						})
					})
				})
			})
		})

	})

})
