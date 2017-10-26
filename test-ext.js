new (function() {
	var ext = this;
	
	var descriptor = {
    	blocks: [
      		[' ', 'Say %s', 'sayThis', 'txt', 'txt'],
    	],
    	txt: 'Hello'
  	};
  
  	ext._shutdown = function() {};
  	
  	ext._getStatus = function() {
  		return {status: 2, msg: 'Device connected'}
  	};
  	
  	ext.loadBlock = function(txt) {
  		console.log(txt)
  	};
  	
  	ScratchExtensions.register("extensionloader", descriptor, ext);
	
});