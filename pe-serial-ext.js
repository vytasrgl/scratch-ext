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
    var device = null;
	var potentialDevices = [];
	var poller = null;
    var watchdog = null;
	
	ext._deviceConnected = function(dev) {
		potentialDevices.push(dev);
		if (!device) {
			tryNextDevice();
		}
	};
	
    function tryNextDevice() {
        // If potentialDevices is empty, device will be undefined.
        // That will get us back here next time a device is connected.
        device = potentialDevices.shift();
        if (!device) return;
		if (device) {
			device.open({ stopBits: 0, bitRate: 115200, ctsFlowControl: 0 }, deviceOpened);
		}
	}
	
	function deviceOpened(dev){
        if (!dev) {
            // Opening the port failed.
            tryNextDevice();
            return;
        }
        device.set_receive_handler(function(data) {
            console.log('Received: ' + data.byteLength);
			console.log(data);
        });
        console.log('Connected');
		console.log(device);
        poller = setInterval(function() {
			console.log('Sending ping');
            device.send(Uint8Array.from("=node.random()\r\n"));
        }, 1000);
        watchdog = setTimeout(function() {
            // This device didn't get good data in time, so give up on it. Clean up and then move on.
            // If we get good data then we'll terminate this watchdog.
            //clearInterval(poller);
            //poller = null;
            //device.set_receive_handler(null);
            //device.close();
            //device = null;
            //tryNextDevice();
        }, 100000);
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
        if(!device) return {status: 1, msg: 'Board disconnected'};
        if(watchdog) return {status: 1, msg: 'Waiting for board to be connected'};
        return {status: 2, msg: 'PicoBoard connected'};
    }
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