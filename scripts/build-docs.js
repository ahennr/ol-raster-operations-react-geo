'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');
const { exec } = require('child_process');
console.log('Building JSDoc...');
exec('jsdoc --package ./package.json --readme ./README.md -c .jsdoc', (err, stdout, stderr) => {
  console.log(stdout);
  if (err) {
    // node couldn't execute the command
    console.log(err, stderr);
    return;
  }
  console.log('Finished building JSDoc');
});
