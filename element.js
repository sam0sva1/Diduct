/** @jsx Diduct.createElement */

const Diduct = require('./main');

const element = (
  <div id="container">
    <input value="foo" type="text" />
    <a href="/bar">bar</a>
    <button onClick={() => (console.log('Hi'))}>click me</button>
  </div>
);


module.exports = element;
