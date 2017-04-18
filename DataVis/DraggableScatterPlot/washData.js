var washData = function () {
	var r = data;
	r.regions = {num: 0};
	r.range = {income: [1000000000, 0], lifeExpectancy: [1000000000, 0], population: [1000000000, 0]};
	var addRegion = function (i) {
		if (!r.regions[data[i].region]) {
			r.regions[data[i].region] = [];
			r.regions[data[i].region].color = getColor(r.regions["num"]);
			console.log(r.regions["num"]);
			console.log(getColor(r.regions["num"]));
			r.regions.num++;
		}
		r.regions[data[i].region].push(i);
	}
	var makeup = function (targeta, receivea) {
		var addMakeupPo = function (i) {
			if (targeta[i][0] + 1 >= targeta[i+1][0]) return;
			var a = targeta[i][0]+1;
			var k = (targeta[i+1][1] - targeta[i][1]) / (targeta[i+1][0] - targeta[i][0]);
			var b = targeta[i][1] - k * targeta[i][0];
			while (a < targeta[i+1][0]) {
				receivea.push([a, k * a + b]);	
				a++;
			}
		}
		if (targeta[0][0] > 1800) 
			for (var i = 1800; i < targeta[0][0]; i++)
				receivea.push([i, targeta[0][1]]);
		for (var i = 0; i < targeta.length - 1; i++) {
			addMakeupPo(i);
		}
		if (targeta[targeta.length - 1][0] < 2009)
			for (var i = targeta[targeta.length - 1][0] + 1; i <= 2009; i++) 
				receivea.push([i, targeta[targeta.length - 1][1]]);
	}
	var makeupLifeExpectency = function (cty) {
		var l = data[cty].lifeExpectancy;
		data[cty].makeupLi = [];
		makeup(l, data[cty].makeupLi);
	}
	var makeupIncome = function (cty) {
		var i = data[cty].income;
		data[cty].makeupIn = [];
		makeup(i, data[cty].makeupIn);
	}
	var makeupPopulation = function (cty) {
		var p = data[cty].population;
		data[cty].makeupPo = [];
		makeup(p, data[cty].makeupPo);
	}
	var getLifeEx = function (cty) {
		var population = data[cty].population;
		var populationM = data[cty].makeupPo;
		data[cty].po = {};
		for (var i = 0; i < population.length; i++) {
			data[cty].po[population[i][0]] = population[i][1];
		}
		for (var i = 0; i < populationM.length; i++) {
			data[cty].po[populationM[i][0]] = populationM[i][1];
		}
		// debugger;
	}
	var checkRange = function (cty) {
		var getMax = function (a) {
			var max = a[0][1];
			for (var i = 0; i < a.length; i++) {
				if (a[i][1] > max) max = a[i][1];
			}
			return max;
		}
		var getMin = function (a) {
			var min = a[0][1];
			for (var i = 0; i < a.length; i++) {
				if (a[i][1] < min) min = a[i][1];
			}
			return min;
		}
		var inc = data[cty].income;
		var lifeEx = data[cty].lifeExpectancy;
		var population = data[cty].population;
		var maxi = getMax(inc),
			mini = getMin(inc),
			maxl = getMax(lifeEx),
			minl = getMin(lifeEx),
			minp = getMin(population),
			maxp = getMax(population);
		if (maxi > r.range["income"][1]) {r.range["income"][1] = maxi;}
		if (maxl > r.range.lifeExpectancy[1]) r.range.lifeExpectancy[1] = maxl;
		if (maxp > r.range.population[1]) r.range.population[1] = maxp;
		if (mini < r.range.income[0]) r.range.income[0] = mini;
		if (minl < r.range.lifeExpectancy[0]) r.range.lifeExpectancy[0] = minl;
		if (minp < r.range.population[0]) r.range.population[0] = minp;
		// debugger;
	}
	for (var i = 0; i < data.length; i++) {
		addRegion(i);
		makeupIncome(i);
		makeupPopulation(i);
		makeupLifeExpectency(i);
		getLifeEx(i);
		checkRange(i);
	}

	return r;
}