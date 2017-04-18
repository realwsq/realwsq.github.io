var h1 = h2 = 5;
var a = 2.5, b = 5, c = 2.5;
var getGearR = function (num) {
	return (a + b + c) * num / Math.PI;
}
var getGearNum = function (r) {
	return Math.ceil(r * Math.PI / (a + b + c));
}
var CircleWithGear = function (x, y, num, mode) {
	var gear = {};
	var getGearD = function (r,a,b,c,h1,h2) {
		var d = "M " + (gear.x+r) + " " + (gear.y) + " ";
		for (var i = 0; i < num; i++) {
			var r1 = i / num * 2 * Math.PI;
			var r2 = r1 + a / r;
			var r3 = r2 + b / r;
			var r4 = r3 + c / r;
			var r5 = r4 + (a + b + c) / r;
			d += "L " + (gear.x+(r+h1)*Math.cos(r1)) + " " + (gear.y+(r+h1)*Math.sin(r1)) + " ";
			d += "L " + (gear.x+(r+h1+h2)*Math.cos(r2)) + " " + (gear.y+(r+h1+h2)*Math.sin(r2)) + " ";
			d += "L " + (gear.x+(r+h1+h2)*Math.cos(r3)) + " " + (gear.y+(r+h1+h2)*Math.sin(r3)) + " ";
			d += "L " + (gear.x+(r+h1)*Math.cos(r4)) + " " + (gear.y+(r+h1)*Math.sin(r4)) + " ";
			d += "L " + (gear.x+(r)*Math.cos(r4)) + " " + (gear.y+(r)*Math.sin(r4)) + " ";
			d += "L " + (gear.x+(r)*Math.cos(r5)) + " " + (gear.y+(r)*Math.sin(r5)) + " ";
		}
		d += "Z"; 
		// console.log(d);
		return d;
	}
	var rotate = function (angle, r, x, y) {
		if (arguments.length == 1) {
			angle = angle * 180 / Math.PI;
			gear.path.setAttribute("transform", "rotate(" + angle + " " + gear.x + " " + gear.y + ")");
			gear.Circle.setAttribute("transform", "rotate(" + angle + " " + gear.x + " " + gear.y + ")");
			// gear.tag.setAttribute("transform", "rotate(" + angle + " " + gear.x + " " + gear.y + ")")
			// debugger;
		} else if (arguments.length == 4) {
			gear.x = r * Math.cos(angle) + x; 
			gear.y = y - r * Math.sin(angle);
			// console.log(gear.x);
			// console.log(gear.y);
			if (mode == 1) gear.d = getGearD(gear.r, a, b, c, h1, h2);
			else gear.d = getGearD(gear.r, a, b, c, -h1, -h2);
			// console.log(gear.d);
			gear.path.setAttribute("d", gear.d);
			// debugger;
			gear.Circle.setAttribute("cx", gear.x);
			gear.Circle.setAttribute("cy", gear.y);
			// debugger;
		}
	}
	var displayPath = function (c) {
		var path = gear.path;
		var svg = document.getElementById("EpicyclicGearing");
		path.setAttribute("d", gear.d);
		path.setAttribute("fill", c);
		path.setAttribute("stroke", "black");
		svg.appendChild(path);
	};
	var displayCircle = function (c = "white", r = 10) {
		var circle = gear.Circle;
		var svg = document.getElementById("EpicyclicGearing");
		circle.setAttribute("cx", gear.x);
		circle.setAttribute("cy", gear.y);
		circle.setAttribute("r", r);
		circle.setAttribute("stroke", "black");
		circle.setAttribute("fill", c);
		svg.appendChild(circle);
	}
	gear.x = x, gear.y = y;
	// alert(gear.y);
	gear.r = getGearR(num);
	gear.teethH = h1 + h2;
	gear.Circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	if (mode == 1) // gear
		gear.d = getGearD(gear.r, a, b, c, h1, h2);
	else if (mode == 2) //ring
		gear.d = getGearD(gear.r, a, b, c, -h1, -h2);
	gear.path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	gear.g = document.createElementNS("http://www.w3.org/2000/svg", "g");
	gear.displayPath = displayPath;
	gear.displayCircle = displayCircle;
	gear.g.appendChild(gear.path, gear.Circle);
	gear.rotate = rotate;

	return gear;
}
var display = function (cg, g1, g2, g3, ring) {
	ring.displayCircle("#c6dbef", ring.r + 10);
	ring.displayPath("white");
	for (var i = 0; i < 4; i++) {
		if (i == 0)
			arguments[i].displayPath("#6baed6");
		else 
			arguments[i].displayPath("#9ecae1");
		arguments[i].displayCircle("white", 10);
		// arguments[i].displayTag();
	}
}

var setMode = function (m) {
	mode = m;
}
var setVelocityRatio = function (vr) {
	velocityRatio = vr;
}
var mode = preMode = 1;
var velocityRatio = preVelocityRatio = 1;

window.onload= function () {
	var cgn = 16, mgn = 32, rn = 86;
	var centerx = 400, centery = 300;
	var centerGear = CircleWithGear(centerx, centery, cgn, 1);
	var cgr = centerGear.r;
	var mgr = getGearR(mgn);
	var middleGear1 = CircleWithGear(centerx - (centerGear.r + centerGear.teethH + mgr)*Math.cos(Math.PI/6), centery-(centerGear.r + centerGear.teethH + mgr)*Math.sin(Math.PI/6), mgn, 1);
	// var middleGear1 = CircleWithGear(centerx - (centerGear.r + centerGear.teethH + mgr), centery, mgn, 1);
	var middleGear2 = CircleWithGear(centerx, centery + centerGear.r + centerGear.teethH + mgr, mgn, 1);
	var middleGear3 = CircleWithGear(centerx + (centerGear.r + centerGear.teethH + mgr)*Math.cos(Math.PI/6), centery-(centerGear.r + centerGear.teethH + mgr)*Math.sin(Math.PI/6), mgn, 1);
	// console.log(getGearNum(cgr + 2*mgr + (h1+h2)*2));
	var ring = CircleWithGear(centerx, centery, rn, 2);
	display(centerGear, middleGear1, middleGear2, middleGear3, ring);

	var rotateAll = function (w) {
		// console.log(w.mgRe);
		middleGear1.rotate(revolutionM1,cgr + mgr + h1 + h2, centerx, centery);
		middleGear2.rotate(revolutionM2,cgr + mgr + h1 + h2, centerx, centery);
		middleGear3.rotate(revolutionM3,cgr + mgr + h1 + h2, centerx, centery);
		// debugger;
		// console.log(lastAngleC);
		centerGear.rotate(lastAngleC);
		// debugger;
		// console.log(lastAngleM);
		middleGear1.rotate(lastAngleM);
		middleGear2.rotate(lastAngleM);
		middleGear3.rotate(lastAngleM);
		// debugger;
		// console.log(lastAngleR);
		ring.rotate(lastAngleR);
		// debugger;
	}
	var addAngle = function (w) {
		lastAngleC += w.cgRo;
		lastAngleM += w.mgRo;
		lastAngleR += w.rRo;
		revolutionM1 += w.mgRe;
		revolutionM2 += w.mgRe;
		revolutionM3 += w.mgRe;
	}
	var getw = function (w, mode, vr) {
		if (mode == 1) Annulus(w, vr);
		if (mode == 2) Planets(w, vr);
		if (mode == 3) Sun(w, vr);
	}
	var Annulus = function (w, vr) {
		w.cgRo = (a + b + c) / centerGear.r / 5 * vr;
		w.rRo = 0;
		w.mgRe = cgn * w.cgRo / (rn + cgn);
		w.mgRo = (mgn - rn) * cgn * w.cgRo / mgn / (rn + cgn);
		w.mgRe = -w.mgRe;

	}
	var Planets = function (w, vr) {
		w.cgRo = (a + b + c) / centerGear.r / 10 * vr;
		w.rRo = w.cgRo * cgn / rn ;
		w.mgRe = 0;
		w.mgRo = w.cgRo * cgn / mgn;
		w.cgRo = -w.cgRo;
	}
	var Sun = function (w, vr) {
		w.rRo = (a + b + c) / centerGear.r / 5 * vr;
		w.cgRo = 0;
		w.mgRe = rn * w.rRo / (cgn + rn);
		// w.mgRo = (cgn + mgn) * w.rRo / (cgn + rn);
		w.mgRo = (cgn + mgn) / mgn * w.mgRe;
		w.mgRe = -w.mgRe;
	}

	var revolutionM1 = Math.PI * 5 / 6, revolutionM2 = Math.PI * 3/ 2, revolutionM3 = Math.PI / 6;
	var lastAngleC = lastAngleM = 0, 
		lastAngleM1 = Math.PI * 7 / 6, lastAngleM2 = Math.PI / 4, lastAngleM3 = -Math.PI / 6,
		lastAngleR = 0;
	var timeInterval = 100;
	var w = {"cgRo": 0, mgRo: 0, mgRe: 0, rRo: 0};
	getw(w, mode, velocityRatio);
	// var angle = Math.PI * 7 / 6;
	var angle = 0;
	setInterval(function () {
		if (mode != preMode) {
			getw(w, mode, velocityRatio);
			preMode = mode;
		}
		if (velocityRatio != preVelocityRatio) {
			getw(w, mode ,velocityRatio);
		}
		addAngle(w);
		rotateAll(w);
	}, timeInterval);
}