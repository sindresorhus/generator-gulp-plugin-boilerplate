'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('generator', function () {
	beforeEach(function (cb) {
		var deps = ['../app'];

		helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
			if (err) {
				return cb(err);
			}

			this.generator = helpers.createGenerator('gulp-plugin-boilerplate:app', deps);
			cb();
		}.bind(this));
	});

	it('generates expected files', function (cb) {
		var expected = [
			'index.js',
			'test.js',
			'package.json',
			'readme.md'
		];

		helpers.mockPrompt(this.generator, {
			pluginName: 'test',
			name: 'test'
		});

		this.generator.run({}, function () {
			helpers.assertFiles(expected);
			cb();
		});
	});
});
