define(['a','b','c'], function(a,b,c) { 
	var x = require('x');
	define(['d','e','f'], function(d,e,f) { 
		var y = require('y'); 
		define(['g','h','i'], function(g,h,i) { 
			var z = require('z'); 
		});
	});
});