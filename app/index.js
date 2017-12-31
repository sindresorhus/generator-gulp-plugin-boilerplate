'use strict';
const path = require('path');
const fs = require('fs');
const superb = require('superb');
const normalizeUrl = require('normalize-url');
const humanizeUrl = require('humanize-url');
const Generator = require('yeoman-generator');
const _s = require('underscore.string');

module.exports = class extends Generator {
	init() {
		return this.prompt([{
			name: 'pluginName',
			message: 'What do you want to name your gulp plugin?',
			default: this.appname.replace(/\s/g, '-'),
			filter(val) {
				return _s.slugify(val.replace(/^gulp-/, ''));
			}
		}, {
			name: 'githubUsername',
			message: 'What is your GitHub username?',
			store: true,
			validate(val) {
				return val.length > 0 ? true : 'You have to provide a username';
			}
		}, {
			name: 'website',
			message: 'What is the URL of your website?',
			store: true,
			validate(val) {
				return val.length > 0 ? true : 'You have to provide a website URL';
			},
			filter(val) {
				return normalizeUrl(val);
			}
		}]).then(props => {
			const tpl = {
				pluginName: props.pluginName,
				camelPluginName: _s.camelize(props.pluginName),
				githubUsername: props.githubUsername,
				name: this.user.git.name(),
				email: this.user.git.email(),
				website: props.website,
				humanizedWebsite: humanizeUrl(props.website),
				superb: superb()
			};

			const mv = (from, to) => {
				this.fs.move(this.destinationPath(from), this.destinationPath(to));
			};

			// Workaround npm issue
			fs.writeFileSync(path.join(this.sourceRoot(), '.gitignore'), 'node_modules\n');

			this.fs.copyTpl(
				[
					`${this.templatePath()}/**`,
					`${this.templatePath()}/**/.*`,
					'!**/{readme.md,.git}'
				],
				this.destinationPath(),
				tpl
			);

			mv('_package.json', 'package.json');
			mv('_readme.md', 'readme.md');
		});
	}

	install() {
		this.installDependencies({bower: false});
	}
};
