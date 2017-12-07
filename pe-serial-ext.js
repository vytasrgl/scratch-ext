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
			console.log("Attempt to connect to serial")
			device.open({ stopBits: 0, bitRate: 115200, ctsFlowControl: 0 }, deviceOpened);
		}
	}
	
	function arrayBufferToString(buffer){
		var arr = new Uint8Array(buffer);
		var str = String.fromCharCode.apply(String, arr);
		return str;
	}
	
	function stringToArrayBuffer(str){
		var arr = new Uint8Array(str.length);
		for(var i=str.length; i--; )
			arr[i] = str.charCodeAt(i);
		return arr.buffer;
	}

	function deviceOpened(dev){
        if (!dev) {
			console.log("Failed to open the port")
            // Opening the port failed.
            tryNextDevice();
            return;
        }
        device.set_receive_handler(function(data) {
            console.log('Received: ' + data.byteLength);
			var dataView = new DataView(data);
			console.log(arrayBufferToString(data));
        });
        console.log('Connected');
		console.log(device);
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
  	ext.sayThis = function(txt, cb) {
		device.send(stringToArrayBuffer("=send_command(\"" + txt + "\")\r\n"));
		// small callback needed to prevent sending different commands at same time
		window.setTimeout(function(){cb();}, 100);
  	};
	ext.walk = function() {
		device.send(stringToArrayBuffer("=send_command(\"Dont myndifydoo.<MO=EL,1.0,0.5><MO=HN,0,0.5><PM><MO=EL,0.1,0.5><MO=HN,0.3,0.5><PA><WK=W2><PA>\")\r\n"));
	}; 	
	ext.wifiSetup = function(ssid, pwd) {
		device.send(stringToArrayBuffer("=init_wifi(\"" + ssid + "\",\""+pwd+"\")\r\n"));
  	};
	// Motor functions
	ext.rad = function(cb) { this.sayThis("<MO=AR,0,0.5>",cb) };
	ext.rap = function(cb) { this.sayThis("<MO=AR,1,0.5>",cb) };
	ext.hd = function(cb) { this.sayThis("<MO=HN,0,0.5>",cb) };
	ext.hm = function(cb) { this.sayThis("<MO=HN,0.5,0.5>",cb) };
	ext.hu = function(cb) { this.sayThis("<MO=HN,1,0.5>",cb) };
	ext.cm = function(cb) { this.sayThis("<MO=MO,0,0.5>",cb) };
	ext.om = function(cb) { this.sayThis("<MO=MO,0.5,0.5>",cb) };
	ext.omt = function(cb) { this.sayThis("<MO=MO,1,0.5>") };
	ext.elo = function(cb) { this.sayThis("<MO=EL,0,0.5>",cb) };
	ext.elc = function(cb) { this.sayThis("<MO=EL,1,0.5>",cb) };
	ext.ed = function(cb) { this.sayThis("<MO=EB,0,0.5>",cb) };
	ext.eu = function(cb) { this.sayThis("<MO=EB,1,0.5>",cb) };
	ext.cu = function(cb) { this.sayThis("<MO=CH,0,0.5>",cb) };
	ext.cn = function(cb) { this.sayThis("<MO=CH,0.5,0.5>",cb) };
	ext.cd = function(cb) { this.sayThis("<MO=CH,1,0.5>",cb) };



	var descriptor = {
    	blocks: [
			['w', 'Einstein SSID  %s passwrod %s' , 'wifiSetup', 'EINSTEIN0000', 'genius0000'],
			['w', 'Say %s', 'sayThis', 'hello'],
			['w', 'Right arm down', 'rad'],
			['w', 'Right arm pointing', 'rap'],
			['w', 'Head down', 'hd'],
			['w', 'Head middle', 'hm'],
			['w', 'Head up', 'hu'],
			['w', 'Close mouth', 'cm'],
			['w', 'Open mouth', 'om'],
			['w', 'Open mouth tongue', 'omt'],
			['w', 'Eye lid open', 'elo'],
			['w', 'Eye lid close', 'elc'],
			['w', 'Eyebrow downn', 'ed'],
			['w', 'Eyebrow up', 'eu'],
			['w', 'Chin up (Smile)', 'cu'],
			['w', 'Chin Neutral', 'cn'],
			['w', 'Chin down (Frown)', 'cd']
    	],
    
	};

	ScratchExtensions.register('pe-serial-ext', descriptor, ext, {type:'serial'});

})({});