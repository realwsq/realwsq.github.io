var showNodes = function(year) {
	console.log(year);
	var po, cx, cy, r, color;
	var k = (rmax - rmin) / (data_after.range.population[1] - data_after.range.population[0]) ;
	var b = rmin - k * data_after.range.population[0];
	for (var nodei = 0; nodei < data_after.length; nodei++) {
		po = data_after[nodei].po[year];
		cx = data_after[nodei].endPoint[year][0];
		cy = data_after[nodei].endPoint[year][1];
		r = k * po + b;
		data_after[nodei].nodeCircle.setAttribute("cx", cx);
		data_after[nodei].nodeCircle.setAttribute("cy", cy);
		data_after[nodei].nodeCircle.setAttribute("r", r);
	}
}
var lastx, lasty;
var addMouseDown = function (cty) {
	var name = cty.name;
	console.log("f");
	cty.nodeCircle.onmousedown = function (e) {
		var e = window.event || e;
		var slider = document.getElementById("year");
		lastx = e.pageX, lasty = e.pageY;
		cty.nodeCircle.setAttribute("opacity", 0.9);
		// setPathVisibility(cty.path, 1);
		cty.path.setAttribute("opacity", 0.5);
		console.log("ff");
		document.onmousemove = function (e) {
			console.log("fff");
			COUNTRY.innerHTML = name;
			COUNTRY.setAttribute("opacity", 0.1)
			cty.path.setAttribute("opacity", 0.5);
			var e = window.event || e;
			if (e.pageX > lastx) {
				slider.stepUp(Math.ceil((e.pageX - lastx)/3));
				// console.log(slider.value);
				reShow();
				lastx = e.pageX;
			} else if (e.pageX < lastx) {
				slider.stepDown(Math.ceil((lastx - e.pageX)/3));
				reShow();
				// console.log(slider.value);
				lastx = e.pageX;
			}
		}
		document.onmouseup = function (e) {
			console.log("ffff");
			cty.nodeCircle.setAttribute("opacity", 0.6);
			// setPathVisibility(cty.path, 0);
			cty.path.setAttribute("opacity", 0);
			COUNTRY.setAttribute("opacity", 0);
			document.onmousemove = {}
		}
	}
}
var addMouseMove = function (cty) {
	cty.nodeCircle.onmousemove = function (e) {
 		COUNTRY.innerHTML = cty.name;
 		// setPathVisibility(cty.path, 1);
 		cty.path.setAttribute("opacity", 0.5);
 		COUNTRY.setAttribute("opacity", 0.1);
 	}
}
var addMouseOut = function (cty) {
	cty.nodeCircle.onmouseout = function () {
		COUNTRY.setAttribute("opacity", 0);
		// setPathVisibility(cty.path, 0);
		cty.path.setAttribute("opacity", 0);
	}
}
var createNations = function (year) {
	var po, cx, cy, r, color;
	var k = (rmax - rmin) / (data_after.range.population[1] - data_after.range.population[0]) ;
	var b = rmin - k * data_after.range.population[0];
	
	for (var nodei = 0; nodei < data_after.length; nodei++) {
		po = data_after[nodei].po[year];
		cx = data_after[nodei].endPoint[year][0];
		cy = data_after[nodei].endPoint[year][1];
		data_after[nodei].chosen = 0;
		r = k * po + b;
		color = data_after.regions[data_after[nodei]["region"]].color;
		data_after[nodei].nodeCircle = createCircle(cx, cy, r, color);
		// data_after[nodei].nodeCircle.setAttribute("color", color);
		data_after[nodei].nodeCircle.setAttribute("opacity", 0.6);
		addMouseDown(data_after[nodei]);
		addMouseMove(data_after[nodei]);
		addMouseOut(data_after[nodei]);
		// data[nodei].nodeCircle.onmousedown = addMouseDown;
		
		// debugger;
	}
}





