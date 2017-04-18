var createRect = function (x, y, w, h, strokeColor) {
	var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	rect.setAttribute("width", w);
	rect.setAttribute("height", h);
	rect.setAttribute("x", x);
	rect.setAttribute("y", y);
	var color = strokeColor ? strokeColor : "black";
	rect.setAttribute("stroke", color);
	rect.setAttribute("fill", "white");
	rect.style.cursor = "crosshair";
	return rect;
}
var createCircle = function (x, y, r, color, opacity) {
	var node = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	node.setAttribute("cx", x);
	node.setAttribute("cy", y);
	node.setAttribute("r", r);
	node.setAttribute("fill", color);
	var opacity = opacity ? opacity : 0.7;
	// console.log("op" + opacity);
	node.setAttribute("fill-opacity", opacity);
	return node;
}
var createLine = function (x1, y1, x2, y2, color) {
	var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
	line.setAttribute("x1", x1);
	line.setAttribute("x2", x2);
	line.setAttribute("y1", y1);
	line.setAttribute("y2", y2);
	line.setAttribute("stroke", color);
	return line;
}
var createText = function (t, x, y) {
	var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
	text.innerHTML = t;
	text.setAttribute("text-anchor", "middle");
	text.setAttribute("dominant-baseline", "middle");
	text.setAttribute("x", x);
	text.setAttribute("y", y);
	text.setAttribute("font-size", 12);
	return text;
}
var Cell = function (x, y, w, h, n) {
	var cell = {x: x, y: y, width: w, height: h, name: n};
	cell.rect = createRect(x, y, w, h);
	cell.g = document.createElementNS("http://www.w3.org/2000/svg", "g");
	cell.g.appendChild(cell.rect);
	cell.nodes = [];
	cell.coorLine = [];
	for (var i = 1; i < rectH / __y; i++) {
		cell.coorLine.push(createLine(x, y + __y * i, x + w, y + __y * i, "#ccc"));
	}
	for (var j = 1; j < rectW / __x; j++) {
		cell.coorLine.push(createLine(x + __x * j, y, x + __x * j, y + h, "#ccc"));
	}
	cell.addNode = function (x, y, r, color, opacity) {
		// console.log("opacity" + opacity);
		var node = createCircle(x+cell.x, cell.y+cell.height-y, r, color, opacity);
		cell.nodes.push(node);
		cell.g.appendChild(node);
		return node;
	}
	cell.changeNodeOpacity = function (node, opacity) {
		if(typeof(node) == "number") {
			cell.nodes[node].setAttribute("fill-opacity", opacity);
		} else {
			node.setAttribute("fill-opacity", opacity);
		}
	}
	cell.displayRect = function (svg) {
		var svg = document.getElementById("ScatterPlot");
		svg.appendChild(cell.rect);
	}
	cell.displayNodes = function (svg) {
		// console.log(cell.nodes.length);
		for (var i = 0; i < cell.nodes.length; i++) {
			svg.appendChild(cell.nodes[i]);
		}
	}
	cell.displayCoorLine = function (svg) {
		for (var i = 0; i < cell.coorLine.length; i++) {
			// alert(cell.coorLine[i]);
			svg.appendChild(cell.coorLine[i]);
		}
	}

	return cell;
}
var createMatrix = function () {
	var matrix = [];
	for (var i = 1; i < tag.length; i++) {
		var y = (i != 1) ? down - i * rectH - (i - 1) * _y : down - rectH;
		for (var j = 1; j < tag.length; j++) {
			var x = (j != 1) ? left + (j - 1) * rectW + (j - 1) * _x : left;
			matrix.push(Cell(x, y, rectW, rectH, tag[i] + "-" + tag[j]));
		}
	}
	return matrix;
}
var changeOneDecimal = function (x) {
	var f_x = parseFloat(x);
	if (isNaN(f_x)) {
		alert("changeTwoDecimal->parameter error");
		return false;
	}
	f_x = Math.round(x * 10) / 10;
	var s_x = f_x.toString();
	var pos_decimal = s_x.indexOf(".");
	if (pos_decimal < 0) {
		pos_decimal = s_x.length;
		s_x += ".";
	}
	while (s_x.length <= pos_decimal + 1) {
		s_x += '0';
	}
	return s_x;
}
var displayMatrix = function (matrix, svg) {
	for (var i = 0; i < matrix.length; i++) {
		matrix[i].displayRect(svg);
		matrix[i].displayCoorLine(svg);
	}
}
var displayScale = function (range, svg) {
	for (var i = 0; i < range.length; i++) {
		var rectX1 = i ? left + i * rectW + i * _x : left;
		var rectY1 = down;
		var rectX2 = left;
		var rectY2 = i ? down - i * rectH - i * _y : down;
		for (var j = 0; j <= rectW / __x; j ++) {
			var value = range[i]["min"] + j * (range[i]["max"] - range[i]["min"]) / (rectW / __x);
			// alert(value);
			value = changeOneDecimal(value);
			var text1 = createText(value, rectX1 + j * __x, rectY1 + 10);
			var text2 = createText(value, rectX2 - 15, rectY2 - j * __y);
			// console.log(text1);
			// console.log(text2);
			svg.appendChild(text1);
			svg.appendChild(text2);
		}
	}
}
var displayTag = function (svg) {
	for (var i = 1; i < tag.length; i++) {
		var text = createText(tag[i], left + (_x+rectW)*(i-1) + 40, down - rectH * i - _y * (i-1) + 15);
		svg.append(text);
	}
}
var displayNodes = function(matrix, svg) {
	for (var i = 0; i < matrix.length; i++) {
		matrix[i].displayNodes(svg);
	}
}
var getRange = function () {
	var range = [];
	for (var tagi = 1; tagi < tag.length; tagi++) {
		var min = 99999, max = -99999;
		for (var di = 0; di < data.length; di++) {
			if (data[di][tagi] < min) min = data[di][tagi];
			if (data[di][tagi] > max) max = data[di][tagi];
		}
		range.push({min: min, max: max});
	}
	return range;
}
var chooseColor = function(species) {
	if (species == "setosa") return "#FF3333";
	if (species == "versicolor") return "#4682b4";
	if (species == "virginica") return "#00FFFF";
	else return false;
}
var addNodes = function (matrix, range) {
	for (var ni = 0; ni < data.length; ni++) {
		var t = data[ni];
		var color = chooseColor(t[0]);
		var s = [];
		t.places = [];
		for (var i = 0; i < 4; i++) {
			s.push((t[i+1] - range[i].min) / (range[i].max - range[i].min) * rectW);
		}
		for (i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				matrix[i * 4 + j].addNode(s[i], s[j], 3, color);
				t.places.push([s[i], s[j], 3, color]);
			}
		}
	}
}
var getTarRect = function (x, y, matrix) {
	for (var i = 0; i < matrix.length; i+=4) {
		if (matrix[i].y < y && matrix[i].y + matrix[i].height > y) {
			for (var j = 0; j < 4; j++) {
				if (matrix[i+j].x < x && matrix[i+j].x + matrix[i+j].width > x) {
					return i+j;
				} else continue;
			}
			alert("click wrong area");
		} else continue;
	}
}
var clearSVG = function (range, matrix, svg) {
	var rect = createRect(0, 0, 1000, 1000, "white");
	svg.appendChild(rect);
	displayScale(range, svg);
	displayMatrix(matrix, svg);
	displayTag(svg);
}
var getRectArea = function (rect, sx, sy, cx, cy) {
	var area = {};
	// console.log(rect);
	if (sx <= cx && sy >= cy) {
		if (cx > rect.x + rect.width) area.maxx = rect.x + rect.width;
		else area.maxx = cx;
		area.maxy = sy;
		if (cy < rect.y) area.miny = rect.y;
		else area.miny = cy;
		area.minx = sx; 
	} else if (sx >= cx && sy >= cy) {
		if (cx < rect.x) area.minx = rect.x;
		else area.minx = cx;
		if (cy < rect.y) area.miny = rect.y;
		else area.miny = cy;
		area.maxx = sx;
		area.maxy = sy;
	} else if (sx >= cx && sy <= cy) {
		if (cx < rect.x) area.minx = rect.x;
		else area.minx = cx;
		if (cy > rect.y + rect.height) area.maxy = rect.y + rect.height;
		else area.maxy = cy;
		area.miny = sy;
		area.maxx = sx;
	} else {
		if (cx > rect.x + rect.width) area.maxx = rect.x + rect.width;
		else area.maxx = cx;
		if (cy > rect.y + rect.height) area.maxy = rect.y + rect.height;
		else area.maxy = cy;
		area.minx = sx;
		area.miny = sy;
	}
	return area;
}
var left = 100;
var down = 700;
var _x = _y = 20;
var rectW = rectH = 150;
var __x = __y = 30;
window.onload = function() {
	var svg = document.getElementById("ScatterPlot");
	var range = getRange();
	// console.log(range);
	var matrix = createMatrix();
	displayMatrix(matrix, svg);
	displayScale(range, svg);
	displayTag(svg);
	addNodes(matrix, range);
	displayNodes(matrix, svg);
	// console.log(matrix);
	var mouseRect = createRect(0, 0, 0, 0, "#ccc");
	svg.appendChild(mouseRect);
	// mouseRect.style.visibility = "hidden";
	var mouseX, mouseY;
	var dragging = false;
	var tarRecti, tarRect;
	document.onmousedown = function (e) {
		clearSVG(range, matrix, svg);
		for (var i = 0; i < matrix.length; i++) {
			var nodes = matrix[i].nodes;
			// console.log(nodes.length);
			for (var j = 0; j < nodes.length; j++) {
				matrix[i].changeNodeOpacity(nodes[j], 0.1);
				matrix[i].displayNodes(svg);
				// console.log("here");
			}
		}
		dragging = true;
		mouseX = parseFloat(e.pageX);
		mouseY = parseFloat(e.pageY);
		tarRecti = getTarRect(mouseX, mouseY, matrix);
		tarRect = matrix[tarRecti];
	}
	document.onmousemove = function (e) {
		if (dragging) {
			var area = getRectArea(tarRect, mouseX, mouseY, e.pageX, e.pageY);
			mouseRect.setAttribute("width", area.maxx - area.minx);
			mouseRect.setAttribute("height", area.maxy - area.miny);
			mouseRect.setAttribute("x", area.minx);
			mouseRect.setAttribute("y", area.miny);
			mouseRect.setAttribute("fill", "none");
			svg.appendChild(mouseRect);
			var nodes = tarRect.nodes;
			// console.log(nodes);
			for (var i = 0; i < nodes.length; i++) {
				var cx = nodes[i].getAttribute("cx");
				var cy = nodes[i].getAttribute("cy");
				// console.log(cx + " " + cy);
				if (cx >= area.minx && cx <= area.maxx && cy >= area.miny && cy <= area.maxy) {
					// console.log(0.7);
					for (var j = 0; j < matrix.length; j++) {
						matrix[j].changeNodeOpacity(i, 0.7);
					}
					// svg.appendChild(nodes[i]);
				} else {
					// console.log(0);
					for (var j = 0; j < matrix.length; j++) {
						matrix[j].changeNodeOpacity(i, 0.1);
					}
					// svg.appendChild(nodes[i]);
				}
			}
		}
	}
	document.onmouseup = function (e) {
		dragging = false;
	}

}











