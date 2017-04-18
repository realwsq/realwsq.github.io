var createLine = function (x1, y1, x2, y2, c) {
	var l = document.createElementNS("http://www.w3.org/2000/svg", "line");
	var svg = document.getElementsByTagName("svg")[0];
	l.setAttribute("x1", x1);
	l.setAttribute("y1", y1);
	l.setAttribute("x2", x2);
	l.setAttribute("y2", y2);
	l.setAttribute("stroke", c ? c : "black");
	svg.appendChild(l);
	return l;
}
var createText = function (text, x, y, color) {
	var t = document.createElementNS("http://www.w3.org/2000/svg", "text");
	var svg = document.getElementsByTagName("svg")[0];
	t.innerHTML = text;
	t.setAttribute("x", x);
	t.setAttribute("y", y);
	t.setAttribute("color", color ? color : "black");
	svg.appendChild(t);
	return t;
}
var randomGetColor = function () {
	var r = Math.ceil(Math.random() * 255);
	var g = Math.ceil(Math.random() * 255);
	var b = Math.ceil(Math.random() * 255);
	return "rgb(" + r + "," + g + "," + b + ")";
}
var createCircle = function (cx, cy, r, c) {
	var t = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	var svg = document.getElementsByTagName("svg")[0];
	t.setAttribute("cx", cx);
	t.setAttribute("cy", cy);
	t.setAttribute("r", r);
	t.setAttribute("fill", c);
	svg.appendChild(t);
	return t;
}
var getColor = function (i) {
	var color = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
	return color[i];
}