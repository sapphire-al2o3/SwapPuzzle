(function(global) {
	'use strict';

	var answer,
		question,
		table = [],
		pieces = [],
		first = true,
		pos = { x: 0, y: 0 },
		moves = 0,
		pattern = {};

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
	
	var movesText = document.getElementById('moves'),
		completeText = document.getElementById('complete');
	
	document.getElementById('reset').addEventListener('click', function(e) {
		reset();
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
		completeText.style.display = 'none';
		first = true;
		pos.x = 0;
		pos.y = 0;
		moves = 0;
		movesText.textContent = 0;
		document.getElementById('table').addEventListener('mousedown', clickPiece);
		document.getElementById('table').addEventListener('touchstart', clickPiece);
		
		if(localStorage) {
			var q = location.pathname.match(/.*\/([^\?#;\/]+).*$/)[1],
				best = localStorage.getItem(q);
			if(best) {
				document.getElementById('best').textContent = '( Best: ' + best + ' )';
			}
		}
	}
	
	function clickPiece(e) {
		if(e.target.localName === 'td') {
			var y = e.target.parentNode.rowIndex,
				x = e.target.cellIndex;
			
			if(first) {
				pos.x = x;
				pos.y = y;
				e.target.classList.add('active');
				first = false;
			} else {
				var t0 = table[pos.y][pos.x],
					t1 = table[y][x],
					dx = Math.abs(x - pos.x),
					dy = Math.abs(y - pos.y),
					block = t0 === 0 || t1 === 0,
					empty = t0 === -1 || t1 === -1,
					hswqp = (t0 === -2 || t1 === -2) && dx === 1,
					vswap = (t0 === -3 || t1 === -3) && dy === 1,
					eswap = (t0 === -8 && t1 > 0 && (t1 & 1) === 0) || (t1 === -8 && t0 > 0 && (t0 & 1) === 0),
					oswap = (t0 === -9 && t1 > 0 && (t1 & 1) === 1) || (t1 === -9 && t0 > 0 && (t0 & 1) === 1),
					lswqp = (t0 === -4 && x - pos.x === -1) || (t1 === -4 && x - pos.x === 1),
					uswqp = (t0 === -5 && y - pos.y === -1) || (t1 === -5 && y - pos.y === 1),
					rswqp = (t0 === -6 && x - pos.x === 1) || (t1 === -6 && x - pos.x === -1),
					dswqp = (t0 === -7 && y - pos.y === 1) || (t1 === -7 && y - pos.y === -1),
					nswap = (t0 === -10 && t1 > 0) || (t1 === -10 && t0 > 0),
					neighbor = dx + dy === 1;
				if(!block && (empty || hswqp || vswap || lswqp || uswqp || rswqp || dswqp || eswap || oswap || nswap) && neighbor) {
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
					completeText.style.display = 'block';
					document.getElementById('table').removeEventListener('mousedown', clickPiece);
					document.getElementById('table').removeEventListener('touchstart', clickPiece);
				}
			}
		}
		e.preventDefault();
		e.stopPropagation();
	}
	
	global.start = function(q, a) {
		question = q;
		answer = a;
		reset();
	};

})(this);
