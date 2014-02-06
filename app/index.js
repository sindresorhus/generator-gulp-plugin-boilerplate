'use strict';

var Generator = module.exports = function () {
	var cb = this.async();

	this.prompt([{
		name: 'pluginName',
		message: 'What do you want to name your gulp plugin?',
		default: this.appname.replace(/\s/g, '-'),
		filter: function (val) {
			return this._.slugify(val.replace(/^gulp-/, ''));
		}.bind(this)
	}, {
		name: 'githubUsername',
		message: 'What is your GitHub username?',
		validate: function (val) {
			return val.length > 0 ? true : 'You have to provide a username'
		}
	}], function (props) {
		this.pluginName = props.pluginName;
		this.camelPluginName = this._.camelize(props.pluginName);
		this.githubUsername = props.githubUsername;
		this.name = this.user.git.username;
		this.email = this.user.git.email;

		this.template('index.js');
		// needed so npm doesn't try to use it and fail
		this.template('_package.json', 'package.json');
		this.template('_readme.md', 'readme.md');
		this.template('test.js');

		cb();
	}.bind(this));
};

Generator.name = 'Gulp plugin boilerplate';
