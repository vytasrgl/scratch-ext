/*
 *This program is free software: you can redistribute it and/or modify
 *it under the terms of the GNU General Public License as published by
 *the Free Software Foundation, either version 3 of the License, or
 *(at your option) any later version.
 *
 *This program is distributed in the hope that it will be useful,
 *but WITHOUT ANY WARRANTY; without even the implied warranty of
 *MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *GNU General Public License for more details.
 *
 *You should have received a copy of the GNU General Public License
 *along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(function(ext) {

	var potentialDevices = [];
	ext._deviceConnected = function(dev) {
		console.log(dev)
		potentialDevices.push(dev);
		if (!device) {
			tryNextDevice();
		}
	};

	ext._deviceRemoved = function(dev) {
		if(device != dev) return;
		if(poller) poller = clearInterval(poller);
		device = null;
	};
	
	ext._shutdown = function() {
		if(poller) poller = clearInterval(poller);
		if(device) device.close();
		device = null;
	}	
	  	ext._shutdown = function() {};
  	
  	ext._getStatus = function() {
  		return {status: 2, msg: 'Device connected'}
  	};
  	
  	ext.sayThis = function(txt) {
		console.log(txt)
  	};
	ext.walk = function() {
		console.log('walk')
	}; 	
	ext.crazy = function() {
		console.log('crazy')
	};
	ext.connect = function() {
		console.log('connect')
	};
	var descriptor = {
    	blocks: [
			[' ', 'Say %s', 'sayThis', 'txt', 'txt'],
          		[' ', 'Walk', 'walk'],
          		[' ', 'Go Crazy', 'crazy'],
			[' ', 'connect','connect']
    	],
    	txt: 'Hello',
	};

	ScratchExtensions.register('pe-serial-ext', descriptor, ext, {type:'serial'});

})({});