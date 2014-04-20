(function(global) {
	'use strict';

	var answer,
		question,
		table = [],
		pieces = [],
		first = true,
		pos = { x: 0, y: 0 },
		moves = 0,
		pattern = {},
		playing = false,
		record = [];

	pattern[0] = '';
	pattern[-1] = 'x';
	pattern[-2] = '&#8596;'; // horz
	pattern[-3] = '&#8597;'; // vert
	pattern[-4] = '&#8592;'; // left
	pattern[-5] = '&#8593;'; // up
	pattern[-6] = '&#8594;'; // right
	pattern[-7] = '&#8595;'; // down
	pattern[-8] = 'e';
	pattern[-9] = 'o';
	pattern[-10] = '#';
	pattern[-11] = '&#8626;'; // left up
	pattern[-12] = '&#8624;'; // left bottom
	pattern[-13] = '&#8627;'; // right up
	pattern[-14] = '&#8625;'; // right bottom
	
	
	var movesText = document.getElementById('moves'),
		completeText = document.getElementById('complete');
	
	document.getElementById('reset').addEventListener('click', function(e) {
		reset();
		record.length = 0;
	});
	
	function check(a, b) {
		for(var i = 0; i < a.length; i++) {
			for(var j = 0; j < a[i].length; j++) {
				if(a[i][j] > 0 && a[i][j] !== b[i][j]) {
					return false;
				}
			}
		}
		return true;
	}
	
	function reset() {
		for(var i = 0; i < answer.length; i++) {
			pieces[i] = [];
			table[i] = [];
			for(var j = 0; j < answer[i].length; j++) {
				table[i][j] = question[i][j];
				var p = table[i][j]
				pieces[i][j] = document.getElementById(['p', i, j].join(''));
				pieces[i][j].classList.remove('active');
				pieces[i][j].innerHTML = p > 0 ? p : pattern[p];
				if(p === 0) pieces[i][j].classList.add('block');
			}
		}
		if(completeText) completeText.style.display = 'none';
		first = true;
		pos.x = pos.y = moves = 0;
		movesText.textContent = 0;
		document.getElementById('table').addEventListener('touchstart', clickPiece);
		document.getElementById('table').addEventListener('mousedown', clickPiece);
		
		if(localStorage) {
			var q = location.pathname.match(/.*\/([^\?#;\/]+).*$/)[1],
				best = localStorage.getItem(q);
			if(best) {
				document.getElementById('best').textContent = '( Best: ' + best + ' )';
			}
		}
	}
	
	function swap(x, y) {
		if(first) {
			pos.x = x;
			pos.y = y;
			pieces[y][x].classList.add('active');
			first = false;
		} else {
			var t0 = table[pos.y][pos.x],
				t1 = table[y][x],
				dx = Math.abs(x - pos.x),
				dy = Math.abs(y - pos.y),
				block = t0 === 0 || t1 === 0,
				empty = t0 === -1 || t1 === -1,
				hswap = (t0 === -2 || t1 === -2) && dx === 1,
				vswap = (t0 === -3 || t1 === -3) && dy === 1,
				eswap = (t0 === -8 && t1 > 0 && (t1 & 1) === 0) || (t1 === -8 && t0 > 0 && (t0 & 1) === 0),
				oswap = (t0 === -9 && t1 > 0 && (t1 & 1) === 1) || (t1 === -9 && t0 > 0 && (t0 & 1) === 1),
				lswap = (t0 === -4 && x - pos.x === -1) || (t1 === -4 && x - pos.x === 1),
				uswap = (t0 === -5 && y - pos.y === -1) || (t1 === -5 && y - pos.y === 1),
				rswap = (t0 === -6 && x - pos.x === 1) || (t1 === -6 && x - pos.x === -1),
				dswap = (t0 === -7 && y - pos.y === 1) || (t1 === -7 && y - pos.y === -1),
				luswap = (t0 === -11 && (x - pos.x === -1 || y - pos.y === -1)) || (t1 === -11 && (x - pos.x === 1 || y - pos.y === 1)),
				ldswap = (t0 === -12 && (x - pos.x === -1 || y - pos.y === 1)) || (t1 === -12 && (x - pos.x === 1 || y - pos.y === -1)),
				ruswap = (t0 === -13 && (x - pos.x === 1 || y - pos.y === -1)) || (t1 === -13 && (x - pos.x === -1 || y - pos.y === 1)),
				rdswap = (t0 === -14 && (x - pos.x === 1 || y - pos.y === 1)) || (t1 === -14 && (x - pos.x === -1 || y - pos.y === -1)),
				nswap = (t0 === -10 && t1 > 0) || (t1 === -10 && t0 > 0),
				neighbor = dx + dy === 1;
			if(!block && (empty || hswap || vswap || lswap || uswap || rswap || dswap || luswap || ldswap || ruswap || rdswap || eswap || oswap || nswap) && neighbor) {
				table[pos.y][pos.x] = table[y][x];
				table[y][x] = t0;

				var t = pieces[pos.y][pos.x].textContent;
				pieces[pos.y][pos.x].textContent = pieces[y][x].textContent;
				pieces[y][x].textContent = t;

				moves++;
				movesText.textContent = moves;
			}
			pieces[pos.y][pos.x].classList.remove('active');
			first = true;

			if(check(answer, table)) {
				var q = location.pathname.match(/.*\/([^\?#;\/]+).*$/)[1],
					n = q.match(/\d+/),
					url = 'https://twitter.com/share?url=http%3A%2F%2Fsapphire-al2o3.github.io%2FSwapPuzzle%2F';
				url += '&text=' + encodeURIComponent('Q.' + n + 'を' + moves + '手でクリア');

				var tweet = document.getElementById('tweet');
				if(tweet) {
					tweet.href = url;
				}

				try {
					if(localStorage) {
						var q = location.pathname.match(/.*\/([^\?#;\/]+).*$/)[1],
							b = localStorage.getItem(q),
							best = b ? parseInt(b, 10) : 0;

						if(best === 0 || best > moves) {
							localStorage.setItem(q, moves);
						}
					}
				} catch(e) {
				}
				if(completeText) completeText.style.display = 'block';
				document.getElementById('table').removeEventListener('touchstart', clickPiece);
				document.getElementById('table').removeEventListener('mousedown', clickPiece);
			}
		}
		if(!playing) record.push(x, y);
	}
	
	function upPiece(e) {
		document.removeEventListener('touchmove', movePiece);
		document.removeEventListener('mousemove', movePiece);
		document.removeEventListener('touchend', upPiece);
		document.removeEventListener('mouseup', upPiece);
		e.preventDefault();
		e.stopPropagation();
	}
	
	var px = 0, py = 0;
	
	function movePiece(e) {
		if(e.target.localName === 'td') {
			
			var target = e.touches ? document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY) : e.target;
			
			var y = target.parentNode.rowIndex,
				x = target.cellIndex;
			if(x !== px || y !== py) {
				swap(x, y);
				swap(x, y);
				px = x;
				py = y;
			}
		}
		e.preventDefault();
		e.stopPropagation();
	}
	
	function clickPiece(e) {
		if(e.target.localName === 'td') {
			var y = e.target.parentNode.rowIndex,
				x = e.target.cellIndex;
			px = x;
			py = y;
			swap(x, y);
			
			document.addEventListener('touchmove', movePiece);
			document.addEventListener('mousemove', movePiece);
			document.addEventListener('touchend', upPiece);
			document.addEventListener('mouseup', upPiece);
		}
		e.preventDefault();
		e.stopPropagation();
	}
	
	global.start = function(q, a) {
		question = q;
		answer = a;
		reset();
	};
	global.finish = function() {
		document.getElementById('table').removeEventListener('touchstart', clickPiece);
		document.getElementById('table').removeEventListener('mousedown', clickPiece);
		return table;
	};
	global.play = function(r) {
		r = r || record;
		playing = true;
		var i = 0;
		reset();
		var timer = setInterval(function() {
			if(r.length > i) {
				swap(r[i], r[i + 1]);
				i += 2;
			} else {
				clearInterval(timer);
			}
		}, 1000 / 5);
	};

})(this);
