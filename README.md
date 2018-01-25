# WovenJS


[![npm](https://img.shields.io/npm/v/woven-js.svg?style=plastic)](https://www.npmjs.com/package/woven-js)
[![npm](https://img.shields.io/npm/dt/package/woven-js.svg?style=plastic)](https://img.shields.io/npm/dt/package/woven-js.svg)
[![Github All Releases](https://img.shields.io/github/downloads/CSdare/woven-js/total.svg?style=plastic)](https://github.com/CSdare/woven-js)
[![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/CSdare/woven-js.svg?style=plastic)](https://github.com/CSdare/woven-js)
[![license](https://img.shields.io/github/license/CSdare/woven-js.svg?style=plastic)](https://github.com/CSdare/woven-js)
[![GitHub release](https://img.shields.io/github/release/CSdare/woven-js.svg?style=plastic)](https://github.com/CSdare/woven-js)
[![GitHub Release Date](https://img.shields.io/github/release-date/CSdare/woven-js.svg?style=plastic)](https://github.com/CSdare/woven-js)


<p align="left">
  <img src="https://user-images.githubusercontent.com/4038732/35308567-17f72930-005d-11e8-9134-c21c741f0cc7.png">
</p>

WovenJS abstracts away the architectural complexity of multi-threading and utilizes optimization metrics to guide your application through the most performant process. Based on client hardware information and network strength, WovenJS dynamically runs intensive processes on the server or on the client. When running on the client, WovenJS leverages the Web Workers API to prevent blocking of the web browser's single thread.


## Installing
First `npm install` woven-js in your web application 

```
npm install woven-js --save
npm install --save-dev woven-loader worker-loader babel-loader
```

Next, in your express server file, insert the following:

```javascript

const app = require('express')();
const woven = require('woven-js');
const functions = require(/* "path to your functions file" */);

woven.configure(functions, /* { client options } */);
app.use(woven.optimize);

```
In the front end of your App:

```javascript

import Woven from 'woven-js/client';
import wovenWorker from 'worker-loader?inline=true&name=woven-worker.js!babel-loader!woven-loader!<path to your functions>';
const woven = new Woven();

woven.connect(wovenWorker);

woven.run('function name', payload)
  .then(output => /* do something with output */)

```
## Usage

<p>
  <img src="https://user-images.githubusercontent.com/4038732/35308543-0315f870-005d-11e8-82fa-17aede333138.png">
  &nbsp &nbsp &nbsp &nbsp

  The Woven configure() method links the project's pure functions with the Woven thread management system.

```javascript
  woven.configure(functions, /* { client options } */);
```
  The options object accessible through the configure method also allows for developer customizations:
 
```javascript
module.exports = {
  alwaysClient: false,
  alwaysServer: false,
  dynamicMin: 10000,
  fallback: 'server',
  functions: '/functions.js',
  maxThreads: 12,
  pingSize: small,
  stringPing: null,
}
```

#### Developer Customization Options:

  - **alwaysClient/alwaysServer:** An optimization override to have the application functionality processed on only the server or the client as opposed to alternating between processing locations according to the Woven optimal performance heuristic. 

  - **dynamicMin:** Woven's dynamic ping is used to determine the  data transmission speed of your server->client connection. This property allows you to set a minimum response time in milliseconds. If the dynamic ping is slower than this threshold the client/server data transmission speed will be flagged as insufficiently performant.

  - **fallback:** In the event that the optimization process fails Woven will route to the fallback assigned here. Unless modified by the developer the default fallback is to process on the server.

  - **maxThreads:** A developer override to set the maximum # of threads that can be created for a given client (thread number corrosponds with the number of generated web workers).

  - **pingSize:** Use this property to set an exact size for the dynamic ping data in bytes or choose between Woven's preset options: tiny(100bytes), small(4kB), default(50kB), large(400kB), huge(1MB).

  Make sure that your server/application can handle the larger data transfer (400KB-1MB) before using the large/huge ping size presets.

  The **stringPing** property is used for storing the dynamic ping data and cannot be customized.
  
  <img src="https://user-images.githubusercontent.com/4038732/35308546-05bdf154-005d-11e8-9877-ceabb6a07424.png">

  The Woven connect() method is invoked on the client side to establish a connection between the client and the server. 

  ```javascript
  woven.connect(/*{ workerReference }*/);
  ```

  connect() triggers the Woven’s optimize middleware to initialize optimization settings for each client’s connection. Additionally it takes in the reference to the imported web workers file so that Woven can spawn workers as needed.

  <img src="https://user-images.githubusercontent.com/4038732/35308554-09e7228c-005d-11e8-9329-f49ab7580292.png">

  Woven runs a customizable dynamic ping which sends autogenerated data to capture data transmission speed for a given client connection. The dynamic ping data is meant to be proportionately sized to the application's functonality (i.e. the dynamic ping might be set to roughly the size of a JPG for an app that relies heavily on image file transfers). 
  
  If the dynamic ping is slower than the *dynamicMin* threshold set by the developer then the client/server transmission speed for that client will be flagged as insufficiently performant. The results of the dynamic ping are factored into the Woven performance optimization heuristic.
  
  <img src="https://user-images.githubusercontent.com/4038732/35308551-07f95ea4-005d-11e8-8d81-4b8ade2db02f.png">
  
  Woven's optimization process evaluates the most performant processing location depending on the hardware, software, and network capabilities of the client-side device. Woven will automatically route processing to the server or the client depending on what location will result in the fastest most performant client experience.

  <img src="https://user-images.githubusercontent.com/4038732/35312963-d4709d20-0072-11e8-80f2-57423e8ac1d1.png">
 
  Use the Woven *run()* function wherever you want to run one of the functions in your pure functions file. Woven will decide where to run the function based on the optimization heuristic. 

  ```javascript
  woven.run('function name', payload...)
  .then(output => /* do something with output */)
  ```
  
  The first argument passed to run() is the name of the function as a string. Next you can pass in any arguments that your function will take. You can pass in as many arguments as you like. run() always returns a *promise*, so you can chain *.then* on to woven.run to utilize the output.

</p>



## Contributing



## Versioning

 

## Authors
<table>
  <tbody>
    <tr>
      <td align="center" valign="top">
        <img width="150" height="150" src="https://user-images.githubusercontent.com/4038732/35314686-afd44822-007c-11e8-8fef-92225d5fb4fa.jpg">
        <br>
        <a href="https://github.com/LazarusCrown">Althea Capra</a>
        <p></p>
        <br>
        <p></p>
      </td>
      <td align="center" valign="top">
        <img width="150" height="150" src="https://user-images.githubusercontent.com/4038732/35314688-affa1d36-007c-11e8-89c2-2492d174b7dc.jpg">
        <br>
        <a href="https://github.com/erikwlarsen">Erik Larsen</a>
        <p></p>
        <br>
        <p></p>
      </td>
      <td align="center" width="20%" valign="top">
        <img width="150" height="150" src="https://user-images.githubusercontent.com/4038732/35314689-b00cfc1c-007c-11e8-97b4-b38651546a12.jpg">
        <br>
        <a href="https://github.com/ryanlondon">Ryan London</a>
        <p></p>
        <br>
        <p></p>
      </td>
      <td align="center" valign="top">
        <img width="150" height="150" src="https://user-images.githubusercontent.com/4038732/35314687-afe7f82c-007c-11e8-9ef2-99ecd3694e3d.jpg">
        <br>
        <a href="https://github.com/warmthesea">Dale Nogiec</a>
        <p></p>
        <br>
        <p></p>
        
     
     
  </tbody>
</table>



## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments
So long and thanks for all the fish!

