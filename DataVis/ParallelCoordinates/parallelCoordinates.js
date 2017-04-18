var dataProcess = function (data) {
	var data_after = {};
	data_after.raw = function () {
		return data;
	}();
	data_after.max = function() {
		var max = {};
		var t;
		var init = function(max) {
			for (var obj in data[0]) max[obj] = 0;
		}

		init(max);
		for (var di = 0; di < data.length; di++) {
			for (var obj in data[di])
				if(data[di][obj] && !isNaN(t = data[di][obj]) && t > max[obj]) {
					max[obj] = t;
				}
		}		

		return max;
	}();

	return data_after;
}

var YAxis = function (x, sy, ey, max, n) {
	var axe = {name: n, rangeMax: max, rangeMin: 0, range: max,
		x: x, startY: sy, endY: ey, length: sy - ey};
	var r = {};
	var displayCoor = function (svg) {
		var line = document.createElementNS("http://www.w3.org/2000/svg","line");
		line.setAttribute("stroke", "black");
		line.setAttribute("x1", axe.x);
		line.setAttribute("x2", axe.x);
		line.setAttribute("y1", axe.startY);
		line.setAttribute("y2", axe.endY);
		svg.appendChild(line);
	}
	var displayText = function (CONSTANT, svg) {
		var text = document.createElementNS("http://www.w3.org/2000/svg","text");
		text.innerHTML = axe.name;
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "end");
        text.setAttribute("font-size", 12);
        text.setAttribute("x", axe.x);
        text.setAttribute("y", axe.endY - CONSTANT.padding);
        svg.appendChild(text);
	}
	var displayScale = function (CONSTANT, svg) {
		var vd = axe.range / axe.length * CONSTANT._y;
		var start = 0;
		while (start <= axe.length / CONSTANT._y) {
			var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("text-anchor", "end");
            text.setAttribute("dominant-baseline", "middle");
            text.setAttribute("font-size", 12);
            text.innerHTML = changeTwoDecimal(start * vd) + " -";
            text.setAttribute("x", x);
            text.setAttribute("y", sy - start * CONSTANT._y);
            start ++;
            svg.appendChild(text);
        }
	}
	r.getX = function () { return axe.x; }
	r.scale = function (v) {
		return axe.startY - (v - axe.rangeMin) / axe.range * axe.length;
	}
	r.getName = function () { return axe.name; }
	r.display = function (CONSTANT, svg) {
		displayCoor(svg);
		displayText(CONSTANT, svg);
		displayScale(CONSTANT, svg);
	}
	// console.log(axe);
	return r;
}
var createAxis = function (data, CONSTANT) {
	var axis = {};
	var num_axe = 0;
	for (var obj in data.max) {
		if (data.max[obj]) {
			axis[obj] = 
				YAxis(CONSTANT.left + num_axe * CONSTANT._x, CONSTANT.down, CONSTANT.up, data.max[obj], obj);
			num_axe++;
		}
	}
	return axis;
}	
var findPath = function (axis, data) {
	var path = {};
	var dataR = data.raw;
	var di, t, an;
	for (di = 0; di < dataR.length; di++) {
		t = dataR[di];
		path[t.name] = {};
		for (an in t) {
			if (t[an] == null) {
				path[t.name][axis[an].getX()] = axis[an].scale(0);
				continue;
			}
			if (isNaN(t[an])) continue;
			path[t.name][axis[an].getX()] = axis[an].scale(t[an]);
		}
		// console.log(t);
		// console.log(path[t.name]);
	}
	return path;
}
var createLineS = function (path, CONSTANT) {
	var createLine = function (path) {
		var line = document.createElementNS("http://www.w3.org/2000/svg", "path");
		var x = CONSTANT.left;
		var d;
		while (path[x]) {
			if (x == CONSTANT.left) {
				d = "M" + Math.ceil(x) + " " + Math.ceil(path[x]) + " ";
			} else {
				d += "L" + Math.ceil(x) + " " + Math.ceil(path[x]) + " ";
			}
			x += CONSTANT._x;
		}
		line.setAttribute("d", d);
       	return line;
	}
	var dataLine = {};
	for (var obj in path) {
		dataLine[obj] = createLine(path[obj]);
		dataLine[obj].on = 1;
		dataLine[obj].color = getColor();
		dataLine[obj].opacity = 0.5;
		dataLine[obj].addEventListener("mouseover", 
			function () { chooseTargetData(this);});
	}
	return dataLine;
}
var getColor = function () {
	var r = Math.floor(Math.random()*155)+100;
   	var g = Math.floor(Math.random()*155)+100;
   	var b = Math.floor(Math.random()*155)+100;
   	return "rgb("+r+","+g+","+b+")";
}
var display = function(data, CONSTANT) {
	var svg = document.getElementById("ParallelCoordinates");
	
	var displayAxis = function (axis) {
		for (var obj in axis) {
			axis[obj].display(CONSTANT, svg);
			// debugger; 
		}
	}
	
	var displayDataLine = function (dataLine) {
		for (var lineName in dataLine) {
			var line = dataLine[lineName];
			if (line.on) {
				line.setAttribute("stroke", line.color);
        		line.setAttribute("stroke-width", 1.5);
        		line.setAttribute("stroke-opacity", line.opacity);
        		line.setAttribute("fill", "none");
				svg.appendChild(line);
				// debugger;
			}
		}
	}
	var clearSVG = function () {
		var rect = document.createElementNS("http://www.w3.org/2000/svg","rect");
		rect.setAttribute("x", 0);
		rect.setAttribute("y", 0);
		rect.setAttribute("width", CONSTANT.width);
		rect.setAttribute("height", CONSTANT.height);
		rect.setAttribute("fill", "white");
		svg.appendChild(rect);
	}
	// setInterval(function () {
		clearSVG();
		displayDataLine(dataLine);
		displayAxis(axis);
		// console.log("chosen " + chosen);
		// console.log("dragging " + dragging);
	// }, 100);å
}
var setConstant = function() {
	var CONSTANT = {};
	CONSTANT.width = 1600;
	CONSTANT.height = 1000;
	CONSTANT._x = 100;
	CONSTANT._y = 40;
	CONSTANT.left = 50;
	CONSTANT.up = 100;
	CONSTANT.down = 500;
	CONSTANT.padding = 10;
	return CONSTANT;
}

var dragging = false;
var chosen = false;
var tarAxe;
var mouseX, mousY;
var chosen_sy, chosen_ey;
var mouseRect;

var svg = document.getElementById("ParallelCoordinates");
var CONSTANT = setConstant();
var data_after = dataProcess(foods);
var axis = createAxis(data_after, CONSTANT);
var path = findPath(axis, data_after);
var dataLine = createLineS(path, CONSTANT);
window.onload = function () {
	// tarAxe = axis["fat (g)"];
	// chosen_sy = 300;
	// chosen_ey = 250;
	// chooseTargetData();
	// alert(foods.length);
	display(data_after, CONSTANT);
	var mouseRect;
	document.onmousedown = down;
	document.onmousemove = move;
	document.onmouseup = up;
	// document.onclick = click;
	document.ondblclick = dblclick;

}

var up = function (e) {
	dragging = false;
	chosen = true;
}
var dblclick = function (e) {
	if (chosen) {
		chosen = false;
		chooseAllData();
	}
}
var down = function (e) {
	var svg = document.getElementById("ParallelCoordinates");
	var chooseAxe = function () {
		var min = 10000;
		var t = 0;
		for (var obj in axis) {
			if (min > Math.abs(e.pageX - axis[obj].getX())) {
				min = Math.abs(e.pageX - axis[obj].getX());
				t = obj;
			}
		}
		return axis[t];
	}
	var createRect = function (x, y, w, h) {
		var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		rect.setAttribute("x", x);
		rect.setAttribute("y", y);
		rect.setAttribute("width", w);
		rect.setAttribute("height", h);
		rect.setAttribute("stroke", "#ccc");
		rect.setAttribute("fill", "none");
		svg.appendChild(rect);
		return rect;
	}
	dragging = true;
	tarAxe = chooseAxe();
	mouseX = e.clientX + document.body.scrollLeft;
	mouseY = e.clientY + document.body.scrollTop;
	chosen_ey = chosen_sy = e.pageY;
	// mouseRect = document.createElementNS("http://www.w3.org/2000/svg","rect");
	// mouseRect.setAttribute("x", 0);
	// mouseRect.setAttribute("y", 0);
	// mouseRect.setAttribute("width", 0);
	// mouseRect.setAttribute("height", 0);
	// mouseRect.setAttribute("stroke", "#ccc");
	// mouseRect.setAttribute("fill", "none");
	mouseRect = createRect(0, 0, 0, 0);
	svg.appendChild(mouseRect);
	// console.log( mouseRect);
}

var move = function(e) {
	// console.log(mouseRect);
	if (dragging) {
		chosen_ey = e.pageY;
		chooseTargetData();
		showMouseRect(mouseRect, mouseX, mouseY, e.clientX + document.body.scrollLeft, e.clientY + document.body.scrollTop);
	}
	// console.log("x " + e.pageX);
	// console.log("y " + e.pageY);
	// console.log("chosen " + chosen);
	// console.log("dragging " + dragging);
}

var showMouseRect = function (rect, x1, y1, x2, y2) {
	// console.log(x1+" "+y1+" "+x2+" "+y2);
	// console.log(Math.min(x1, x2) + " " + Math.min(y1, y2)+" "+Math.abs(x1 - x2)+" "+Math.abs(y1 - y2));
	rect.setAttribute("x", Math.min(x1, x2));
	rect.setAttribute("y", Math.min(y1, y2));
	rect.setAttribute("width", Math.abs(x1 - x2));
	rect.setAttribute("height", Math.abs(y1 - y2));
	var svg = document.getElementById("ParallelCoordinates");
	svg.appendChild(rect);
}


var chooseTargetData = function () {
	if (arguments.length) {
		for (var obj in dataLine) {
			dataLine[obj].opacity = 0.3;
			dataLine[obj].on = 1;
		}
		arguments[0].opacity = 1;
		display(data_after, CONSTANT);
		return;
	}
	// console.log("chosen_sy "  + chosen_sy);
	// console.log("chosen_ey " + chosen_ey);
	var x = tarAxe.getX();
	for (var obj in path) {
		var a = Math.min(chosen_sy, chosen_ey);
		var b = Math.max(chosen_sy, chosen_ey);
		if (path[obj][x] < a || path[obj][x] > b) {
			// console.log("x " + obj);
			dataLine[obj].on = false;
		} else {
			// console.log(obj);
			dataLine[obj].on = true;
		}
	}
	display(data_after, CONSTANT);
}
var chooseAllData = function () {
	for (var obj in dataLine) {
		dataLine[obj].on = 1;
	}
	display(data_after, CONSTANT);
}

var setConstant = function() {
	var CONSTANT = {};
	CONSTANT.width = 1600;
	CONSTANT.height = 1000;
	CONSTANT._x = 100;
	CONSTANT._y = 40;
	CONSTANT.left = 50;
	CONSTANT.up = 100;
	CONSTANT.down = 500;
	CONSTANT.padding = 10;
	return CONSTANT;
}
var changeTwoDecimal = function (x) {
	var f_x = parseFloat(x);
	if (isNaN(f_x)) {
		alert("changeTwoDecimal->parameter error");
		return false;
	}
	f_x = Math.round(x * 100) / 100;
	var s_x = f_x.toString();
	var pos_decimal = s_x.indexOf(".");
	if (pos_decimal < 0) {
		pos_decimal = s_x.length;
		s_x += ".";
	}
	while (s_x.length <= pos_decimal + 2) {
		s_x += '0';
	}
	return s_x;
}