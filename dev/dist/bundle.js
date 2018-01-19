/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _index = __webpack_require__(1);

woven.connect();

window.onload = function () {
  // Add 10 functionality
  var add10Button = document.getElementById('add-10-btn');
  var numbers = Array.from(document.getElementsByClassName('number'));
  add10Button.onclick = function () {
    numbers.forEach(function (node) {
      var num = Number(node.innerHTML);
      woven.run('addTen', num).then(function (newNum) {
        return node.innerHTML = newNum;
      });
    });
  };

  // Fib functionality
  function calcFib(num) {
    woven.run('nthFib', num).then(function (fib) {
      var li = document.createElement('li');
      li.textContent = fib;
      fibList.appendChild(li);
    });
  }

  var fibList = document.getElementById('fib-list');
  var fibNumber = document.getElementById('fib-number');
  var fibButton = document.getElementById('calc-fib');

  fibButton.addEventListener('click', function () {
    return calcFib(fibNumber.value || 8);
  });
};

// setTimeout(woven.run('addTen', 20).then(output => console.log('output from run function is ', output)), 1000);

// woven.run('addTen', 30)
//   .then(output => console.log('output from run function is ', output));

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


console.log('hello from woven');

var options = __webpack_require__(2);
var optimal = __webpack_require__(3);
var run = __webpack_require__(4)(options, optimal);
var configure = __webpack_require__(5)(options);
var optimize = __webpack_require__(7)(options);
var connect = __webpack_require__(8)(options);

module.exports = { run: run, optimize: optimize, configure: configure, connect: connect };

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  pingSize: 100,
  maxThreads: 4,
  alwaysClient: false,
  alwaysServer: false,
  functionsPath: null,
  defaults: true
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  location: null, // set this way for testing only
  threads: null
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * 
 * @param {Object} options - options object that will be configured in server.js file by developer
 * @param {Object} optimal - optimal computing location (optimal.location) and thread number 
 *                     (optimal.threads) based on client optimization function
 */

module.exports = function runWrapper(options, optimal) {

  /**
   * @param {string} funcName: string referring to name of a function in functions.js
   * @param {Object} payload: arguments to be passed into the function
   */

  return function run(funcName, payload) {
    console.log(options);
    // logic to determine if function sould be run on client or server
    // what order to handle logic for running?
    // options.alwaysServer, options.alwaysClient, optimal.location
    if (options.alwaysClient || optimal.location === 'client') {} /* reference optimal.threads here */ // run web worker pool
    else if (options.alwaysServer || optimal.location === 'server') {
        return fetch('/__woven__', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ funcName: funcName, payload: payload })
        }).then(function (res) {
          return res.json();
        });
      }
  };
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function configureWrapper(options) {

  return function configure(functionsPath, userOptions) {
    options.functionsPath = functionsPath;
    options.functions = !(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }());
    for (field in userOptions) {
      console.log(field, userOptions[field]);
      if (options.hasOwnProperty(field)) {
        // include code here to test if the type of data passed in is correct for the field
        options[field] = userOptions[field];
        console.log(options);
      } else return new Error(field + " is not a configurable option.");
    }
  };
};

/***/ }),
/* 6 */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 6;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * 
 */

module.exports = function optimizeWrapper(options) {
  return function optimize(req, res, next) {

    if (req.url === '/__woven_first__') {
      // compare options from server with options on client side
      // need to be more specific about which options are sent
      options.defaults = false;
      console.log('back end options before sending:', options);
      res.json(options);
    } else if (req.url === '/__woven__') {
      console.log('got to optimize');
      var output = options.functions[req.body.funcName](req.body.payload);
      res.json(output);
    } else next();
  };
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function connectWrapper(options) {
  return function connect() {
    fetch('/__woven_first__', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ options: options })
    }).then(function (res) {
      return res.json();
    }).then(function (newOptions) {
      for (var field in options) {
        options[field] = newOptions[field];
      }
      console.log('changed front end options:', options);
    });
  };
};

/***/ })
/******/ ]);