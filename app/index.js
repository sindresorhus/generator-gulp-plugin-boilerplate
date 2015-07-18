'use strict';
var path = require('path');
var fs = require('fs');
var superb = require('superb');
var normalizeUrl = require('normalize-url');
var humanizeUrl = require('humanize-url');
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
			}
		}, {
			name: 'githubUsername',
			message: 'What is your GitHub username?',
			store: true,
			validate: function (val) {
				return val.length > 0 ? true : 'You have to provide a username';
			}
		}, {
			name: 'website',
			message: 'What is the URL of your website?',
			store: true,
			validate: function (val) {
				return val.length > 0 ? true : 'You have to provide a website URL';
			},
			filter: function (val) {
				return normalizeUrl(val);
			}
		}], function (props) {
			var tpl = {
				pluginName: props.pluginName,
				camelPluginName: _s.camelize(props.pluginName),
				githubUsername: props.githubUsername,
				name: this.user.git.name(),
				email: this.user.git.email(),
				website: props.website,
				humanizedWebsite: humanizeUrl(props.website),
				superb: superb()
			};

			var mv = function (from, to) {
				this.fs.move(this.destinationPath(from), this.destinationPath(to));
			}.bind(this);

			// workaround npm issue
			fs.writeFileSync(path.join(this.sourceRoot(), '.gitignore'), 'node_modules\n');

			this.fs.copyTpl([
				this.templatePath() + '/**',
				this.templatePath() + '/**/.*',
				'!**/{readme.md,.git}'],
			this.destinationPath(), tpl);

			mv('_package.json', 'package.json');
			mv('_readme.md', 'readme.md');

			cb();
		}.bind(this));
	},
	install: function () {
		this.installDependencies({bower: false});
	}
});
