'use strict';
var path = require('path');
var fs = require('fs');
var superb = require('superb');
var yeoman = require('yeoman-generator');
var _s = require('underscore.string');

module.exports = yeoman.generators.Base.extend({
	init: function () {
		var cb = this.async();

		this.prompt([{
			name: 'pluginName',
			message: 'What do you want to name your gulp plugin?',
			default: this.appname.replace(/\s/g, '-'),
			filter: function (val) {
				return _s.slugify(val.replace(/^gulp-/, ''));
			}.bind(this)
		}, {
			name: 'githubUsername',
			message: 'What is your GitHub username?',
			validate: function (val) {
				return val.length > 0 ? true : 'You have to provide a username';
			}
		}], function (props) {
			this.pluginName = props.pluginName;
			this.camelPluginName = _s.camelize(props.pluginName);
			this.githubUsername = props.githubUsername;
			this.name = this.user.git.name();
			this.email = this.user.git.email();
			this.superb = superb();

			// workaround npm issue
			fs.writeFileSync(path.join(this.sourceRoot(), '.gitignore'), 'node_modules\n');

			this.template('.editorconfig');
			this.template('.gitattributes');
			this.template('.gitignore');
			this.template('.jshintrc');
			this.template('.travis.yml');
			this.template('index.js');
			this.template('license');
			// needed so npm doesn't try to use it and fail
			this.template('_package.json', 'package.json');
			this.template('_readme.md', 'readme.md');
			this.template('test.js');

			cb();
		}.bind(this));
	}
});
