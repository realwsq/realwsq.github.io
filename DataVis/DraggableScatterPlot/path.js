var getPath = function (cty, co) {
	// console.log(cty);
	// debugger;
	var endPoint = {};
	var ii = imi = li = lmi = 0;
	var income = cty.income;
	var incomeM = cty.makeupIn;
	var lifeEx = cty.lifeExpectancy;
	var lifeExM = cty.makeupLi;
	var yearIncome, yearLifeEx;
	var startYear = 1800;
	var endYear = 2009;
	for (var year = startYear; year <= endYear; year++) {
		if (ii < income.length && income[ii][0] == year) {
			yearIncome = income[ii][1];
			ii++;
		} else if (imi < incomeM.length && incomeM[imi][0] == year) {
			yearIncome = incomeM[imi][1];
			imi++;
		} else {
			if (ii < income.length) console.log(income[ii][0]);
			if (imi < incomeM.length) console.log(incomeM[imi][0]);
			console.log("income: don't have that year   " + cty.name + year);
			debugger;
		}
		if (li < lifeEx.length && lifeEx[li][0] == year) {
			yearLifeEx = lifeEx[li][1];
			li++;
		} else if (lmi < lifeExM.length && lifeExM[lmi][0] == year) {
			yearLifeEx = lifeExM[lmi][1];
			lmi++;
		} else {
			if (li < lifeEx.length) console.log(lifeEx[li][0]);
			if (lmi < lifeExM.length) console.log(lifeExM[lmi][0]);
			console.log("lifeExpectancy: don't have that year   " + cty.name + year);
		}
		endPoint[year] = [co.xruler.getx(yearIncome), co.yruler.gety(yearLifeEx)];
	}
	cty.endPoint = endPoint;

	cty.path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	var svg = document.getElementsByTagName("svg")[0];
	var d = "M " + endPoint[startYear][0] + "," + endPoint[startYear][1] + " ";
	for (var i = 1801; i < 2008; i++) {
		// console.log(endPoint[i][0] + "," + endPoint[i][1]);
		d += ("L " + endPoint[i][0] + "," + endPoint[i][1] + "");
		// debugger;
	}
	cty.path.setAttribute("d", d);
	cty.path.setAttribute("fill", "transparent");
	cty.path.setAttribute("stroke", "black");
	svg.appendChild(cty.path);
	// debugger;
}












