var Coordinate = function (left, down, up, right) {
	var r = {};
	var t300 = left, t100000 = right;
	var t400 = t300 + 40, t1000 = t400 + 110, t2000 = t1000 + 90, t3000 = t2000 + 50, 
		t4000 = t3000 + 40, t10000 = t4000 + 110, t20000 = t10000 + 90, t30000 = t20000 + 50, 
		t40000 = t30000 + 40;

	var getxruler = function () {
		var r = {};
		r.min = data_after.range.income[0];
		r.max = data_after.range.income[1];
		r.l = right - left; 	//r.length
		r.s = left;				//r.start
		r.e = right;			//r.end
		r.getx = function (income) {
			if (income < 400) {
				return (income - 300) / (400 - 300) * (t400 - t300) + t300;
			} else if (income < 1000) {
				return (income - 400) / (1000 - 400) * (t1000 - t400) + t400;
			} else if (income < 2000) {
				return (income - 1000) / (2000 - 1000) * (t2000 - t1000) + t1000;
			}else if (income < 3000) {
				return (income - 2000) / (3000 - 2000) * (t3000 - t2000) + t2000;
			} else if (income < 4000) {
				return (income - 3000) / (4000 - 3000) * (t4000 - t3000) + t3000;
			} else if (income < 10000) {
				return (income - 4000) / (10000 - 4000) * (t10000 - t4000) + t4000;
			} else if (income < 20000) {
				return (income - 10000) / (20000 - 10000) * (t20000 - t10000) + t10000;
			} else if (income < 30000) {
				return (income - 20000) / (30000 - 20000) * (t30000 - t20000) + t20000;
			} else if (income < 40000) {
				return (income - 30000) / (40000 - 30000) * (t40000 - t30000) + t30000;
			} else {
				return (income - 40000) / (100000 - 40000) * (t100000 - t40000) + t40000;
			}

			// return (income - r.min)/(r.max - r.min)*r.l + r.s;
		}
		r.getincome = function(x) {
			if (x < t400) {
				return (x - t300) / (t400 - t300) * (400 - 300) + 300;
			} else if (x < t1000) {
				return (x - t400) / (t1000 - t400) * (1000 - 400) + 400;
			} else if (x < t2000) {
				return (x - t1000) / (t2000 - t1000) * (2000 - 1000) + 1000;
			}else if (x < t3000) {
				return (x - t2000) / (t3000 - t2000) * (3000 - 2000) + 2000;
			} else if (x < t4000) {
				return (x - t3000) / (t4000 - t3000) * (4000 - 3000) + 3000;
			} else if (x < t10000) {
				return (x - t4000) / (t10000 - t4000) * (10000 - 4000) + 4000;
			} else if (x < t20000) {
				return (x - t10000) / (t20000 - t10000) * (20000 - 10000) + 10000;
			} else if (x < t30000) {
				return (x - t20000) / (t30000 - t20000) * (30000 - 20000) + 20000;
			} else if (x < t40000) {
				return (x - t30000) / (t40000 - t30000) * (40000 - 30000) + 30000;
			} else {
				return (x - t40000) / (t100000 - t40000) * (100000 - 40000) + 40000;
			}
		}
		return r;
	}
	var getyruler = function () {
		var r = {};
		r.min = data_after.range.lifeExpectancy[0];
		r.max = data_after.range.lifeExpectancy[1];
		r.l = down - up; 	//r.length
		r.s = down;			//r.start
		r.e = up;			//r.end
		r.gety = function (income) {
			return r.s - (income - r.min)/(r.max - r.min)*r.l;
		}
		r.getlifeExpencency = function(y) {
			return (r.s - y)/(r.s - r.e)*(r.max - r.min) + r.min;
		}
		return r;
	}
	var getxteeth = function (num) {
		var teeth = [];
		var l, t;
		var s = r.xruler.s
		l = createLine(t300, down, t300, down + 5);
		t = createText("300",t300, down + 15);
		setFormat(t, "middle", "middle", 12);
		teeth.push([l,t]);
		l = createLine(t400, down, t400, down + 5);
		t = createText("400",t400, down + 15);
		setFormat(t, "middle", "middle", 12);
		teeth.push([l,t]);
		l = createLine(t1000, down, t1000, down + 5);
		t = createText("1,000",t1000, down + 15);
		setFormat(t, "middle", "middle", 12);
		teeth.push([l,t]);
		l = createLine(t2000, down, t2000, down + 5);
		t = createText("2,000",t2000, down + 15);
		setFormat(t, "middle", "middle", 12);
		teeth.push([l,t]);
		l = createLine(t3000, down, t3000, down + 5);
		t = createText("3,000",t3000, down + 15);
		setFormat(t, "middle", "middle", 12);
		teeth.push([l,t]);
		l = createLine(t4000, down, t4000, down + 5);
		t = createText("4,000",t4000, down + 15);
		setFormat(t, "middle", "middle", 12);
		teeth.push([l,t]);
		l = createLine(t10000, down, t10000, down + 5);
		t = createText("10,000",t10000, down + 15);
		setFormat(t, "middle", "middle", 12);
		teeth.push([l,t]);
		l = createLine(t20000, down, t20000, down + 5);
		t = createText("20,000",t20000, down + 15);
		setFormat(t, "middle", "middle", 12);
		teeth.push([l,t]);
		l = createLine(t30000, down, t30000, down + 5);
		t = createText("30,000",t30000, down + 15);
		setFormat(t, "middle", "middle", 12);
		teeth.push([l,t]);
		l = createLine(t40000, down, t40000, down + 5);
		t = createText("40,000",t40000, down + 15);
		setFormat(t, "middle", "middle", 12);
		teeth.push([l,t]);
		l = createLine(t100000, down, t100000, down + 5);
		t = createText("100,000",t100000, down + 15);
		setFormat(t, "middle", "middle", 12);
		teeth.push([l,t]);
		
		// var d = r.xruler.l / num;
		// for (var i = 0; i <= num; i++) {
		// 	var x = r.xruler.s + i * d;
		// 	var l = createLine(x, down, x, down + 5);
		// 	var t = createText(Math.ceil(r.xruler.getincome(x)), x, down + 15);
		// 	setFormat(t, "middle", "middle", 12);
		// 	teeth.push([l,t]);
		// }
		return teeth;
	}
	var getyteeth = function (num) {
		var teeth = [];
		var d = r.yruler.l / num;
		for (var i = 0; i <= num; i++) {
			var y = r.yruler.s - i * d;
			var l = createLine(left - 5, y, left, y);
			var t = createText(Math.ceil(r.yruler.getlifeExpencency(y)), left - 10, y);
			setFormat(t, "end", "middle", 12);
			teeth.push([l,t]);
		}
		return teeth;
	}
	var setFormat = function (t, ta, db,fs) {
		t.setAttribute("text-anchor", ta);
		t.setAttribute("dominant-baseline", db);
		if (fs) t.setAttribute("font-size", fs);
	}
	r.xaxe = createLine(left, down, right, down);
	r.xtag = createText("income per capita, inflation-adjusted (dollars)", right, down - 15, "#ccc");
	r.yaxe = createLine(left, down, left, up);
	r.ytag = createText("life expectancy (years)", left + 20, up, "#ccc");
	setFormat(r.xtag, "end", "middle");
	setFormat(r.ytag, "start", "middle");
	r.ytag.setAttribute("transform", "rotate(90," + (left+20) + "," + up + ")");
	r.xruler = getxruler();
	r.yruler = getyruler();
	r.xteeth = getxteeth(10);
	r.yteeth = getyteeth(15);
	return r;
}
