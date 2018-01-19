module.exports = function configureWrapper(options) {
  
  return function configure(functionsPath, userOptions) {

    if(typeof functionsPath !== "String"){
      return new Error(`${functionsPath} must be a file path string.`);
    }

    options.functionsPath = functionsPath;
    options.functions = require(options.functionsPath);

    for (field in userOptions) {
      console.log(field, userOptions[field]);
      if (options.hasOwnProperty(field)) {
        if (field === pingSize){
          if(typeof userOptions[field] !== "Number"){
            return new Error(`${field} is not a configurable option - incorrect data type.`);
          }
        }else if(field === stringPing){
          if(typeof userOptions[field] !== "String"){
            return new Error(`${field} is not a configurable option - incorrect data type.`);
          }
        }else if(field === maxThreads){
          if(typeof userOptions[field] !== "Number"){
            return new Error(`${field} is not a configurable option - incorrect data type.`);
          }
        }else if(field === alwaysClient){
          if(typeof userOptions[field] !== "Boolean"){
            return new Error(`${field} is not a configurable option - incorrect data type.`);
          }
        }else if(field === alwaysServer){
          if(typeof userOptions[field] !== "Boolean"){
            return new Error(`${field} is not a configurable option - incorrect data type.`);
          }
        }else if(field === functionsPath){
          return new Error(`${field} is not a configurable option - field is assigned as first argument of configure().`);
        }else if(field === defaults){
          return new Error(`${field} is not a configurable option.`);
        }
        console.log(options);
        options[field] = userOptions[field];
      }else return new Error(`${field} is not a configurable option`);
    }
    pingCheck(userOptions);
  }
}

  //first check if the ping data already exists &&
  //whether it is the right size according to preferences...
  function pingCheck(userOptions){
    if(options.stringPing !== null){
      let preferredPingSize = options.pingSize;
      let currentPingSize = 0;
      
      //to check file size against expected...
      fs.stat('./pingdata.txt', function(error, stats) {
        currentPingSize = stats.size;
      });

      //if file size doesn't match preferences, remove it and build new ping that does
      if(preferredPingSize !== currentPingSize){
        fs.unlink('pingdata.txt', function (err) {
          if (err) console.log("error with deleting ping file");
          console.log('Ping data file deleted!');
        });
        buildPing(options.pingSize);
      }else{
        console.log("ping size matches dev preferences!");
      }
    }else{
      buildPing(options.pingSize);
    }
  }

  //function to generate ping according to data size preferences:
  function buildPing(pingsize) {
    let stringPing = "";
    let possiblechars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < pingsize/2; i++){
      stringPing += possiblechars.charAt(Math.floor(Math.random() * possiblechars.length));
    }
    
    fs.appendFile('pingdata.txt', stringPing, function (err) {
      if (err) console.log("error with creating ping file");
      console.log('Saved!');
    });
  //need to assign the path to new ping file to options.stringPing...HALP?
    options.stringPing = './pingdata.txt';
    }