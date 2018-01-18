//generate ping according to data size preferences:

function buildping(pingsize) {
  var stringping = "";
  var possiblechars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < pingsize/10000; i++){
    stringping += possiblechars.charAt(Math.floor(Math.random() * possible.length));
  }
  return stringping;
}

//create file to hold ping:
fs.appendFile('test.txt', stringping, function (err) {
  if (err) console.log("error with creating ping file");
  console.log('Saved!');
});

//to check file size against expected...
fs.stat(path, function(error, stats) {
     console.log(stats.size);
});

//Q: Is it worth it to delete the file after pinging if we have to 
//generate another one each time a new client connects to run the
//ping on their specific network?? 
//A: NO IT AIN'T! >.<

//So instead, use the delete below to remove the ping file and 
//recreate it at the proper size when the dev makes changes to
//their customization options object...
fs.unlink('test.txt', function (err) {
  if (err) console.log("error with deleting ping file");
  console.log('File deleted!');
});