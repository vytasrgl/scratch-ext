new (function() {
	var ext = this;
	
	var descriptor = {
    	blocks: [
      		[' ', 'Say %s', 'sayThis', 'txt', 'txt'],
          [' ', 'Walk', 'walk'],
          [' ', 'Go Crazy', 'crazy']
    	],
    	txt: 'Hello'
  	};
  
  	ext._shutdown = function() {};
  	
  	ext._getStatus = function() {
  		return {status: 2, msg: 'Device connected'}
  	};
  	
  	ext.sayThis = function(txt) {
      $.get('/say/'+txt)
  	};
    ext.walk = function() {
      $.get('/walk')
    }; 	
    ext.crazy = function() {
      $.get('/crazy')
    };

    ScratchExtensions.register("test-ext", descriptor, ext);
});