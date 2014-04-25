(function(global) {
	
	function selector(e) {
		return document.getElementById(e);
	}
	
	function getItem(p, d) {
		if(localStorage) {
			try {
				return localStorage.getItem(p);
			} catch(e) {
			}
		}
		return d;
	}
	
	function setItem(p, v) {
		if(localStorage) {
			try {
				localStorage.setItem(p, v);
			} catch(e) {
			}
		}
	}
	
	function move(elm, fn) {
		if(elm.ontouchmove) {
			elm.addEventListener('touchmove', function(e) {
				
			});
		} else {
			elm.addEventListener('mousemove', function(e) {
				
			});
		}
	}
	
	function down(elm, fn) {
		if(elm.ontouchstart) {
			
		}
	}
	
	global.selector = selector;
	
})(this);
