'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the polished ' + chalk.red('UnlogAngular') + ' generator!'
    ));

    var prompts = [{
      name: 'appName',
      message: 'What is the name of this application?',
      default: 'myApp'
    }, {
      type: 'confirm',
      name: 'isCordova',
      message: 'Is this a cordova application?',
      default: true
    }, {
      name: 'port',
      message: 'What number is localhost port?',
      default: 8901
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.mkdir('test');

      this.mkdir('www');
      this.mkdir('www/views');
      this.mkdir('www/scripts');
      this.mkdir('www/scripts/vendor');
      this.mkdir('www/styles');
      this.mkdir('www/styles/less');

      this.template('index.html', 'index.html');

      this.copy('app.less', 'www/styles/less/app.less');
      this.copy('package.json', 'package.json');
      this.copy('bower.json', 'bower.json');

      if (this.props.isCordova) {
        this.copy('config.xml', 'config.xml');
      }

    },

    projectfiles: function () {

      this.template('gulpfile.js', 'gulpfile.js');

      this.copy('.editorconfig', '.editorconfig');
      this.copy('.jshintrc', '.jshintrc');
      this.copy('circle.yml', 'circle.yml');
      this.copy('.bowerrc', '.bowerrc');
      this.copy('.gitignore', '.gitignore');
      this.copy('karma.conf.js', 'karma.conf.js');
      this.copy('README.md', 'README.md');
      this.copy('.jsbeautifyrc', '.jsbeautifyrc');

    }
  },

  install: function () {
    this.installDependencies();
  }
});
