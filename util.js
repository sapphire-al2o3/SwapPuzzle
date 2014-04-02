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
	
	global.selector = selector;
	
})(this);
