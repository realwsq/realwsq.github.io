function Algorithm()
{
	this.init();
}

var cleanGraph = function() {
    var links = graph.links;
    var map = {};
    for (var i = 0; i < links.length; i++) {
        var a = links[i].source, b = links[i].target, w = links[i].value;
        if (!map[a]) map[a] = {};
        if (!map[a][b]) map[a][b] = w;
        if (!map[b]) map[b] = {};
        if (!map[b][a]) map[b][a] = w;
    }
    return map;
}
Algorithm.prototype.init = function()
{
	this.commands = [];
    var map = cleanGraph();
    // console.log(map);
    // console.log(map["Tholomyes"]);
    this.graph = new Graph(map, this.commands);
}

Algorithm.prototype.startAlgo = function(fromCity, toCity) {
    var path;
    // console.log(fromCity);
    // console.log(toCity);
    [this.commands, path] = this.graph.findShortestPath(fromCity, toCity);
    console.log(path);
    console.log(this.commands);
    return path;
    // debugger;
}

function init()
{   
    console.log("begin");
	initGeneralAnimationControls();
    specificControls();
	drawForceDirectedGraph("DijkstraMap");
    svgtag("svg_fh", "Fibonacci Heap");
    svgtag("svg_binomialh", "Binomial Heap");
    svgtag("svg_binaryh", "Binary Heap");
	$('#GoButton').click(function() {
		// d3.select("svg_fh").selectAll("*").remove();
        d3.select("#svg_fh").selectAll("*").remove();
        d3.select("#svg_binomialh").selectAll("*").remove();
        d3.select("#svg_binaryh").selectAll("*").remove();
        var fromCity = $('#fromEntry').val();
		var toCity = $('#toEntry').val();
		DELAY = DELAY / $('#speed').val();
        // var alg = new Algorithm();
        // alg.startAlgo(fromCity, toCity);

		fhAlg = new FH();
		var path = fhAlg.startAlgo(fromCity, toCity);
		fhAlg.init(fhAlg.commands);

        binaryhAlg = new BinaryH();
        var path = binaryhAlg.startAlgo(fromCity, toCity);
        binaryhAlg.init(binaryhAlg.commands);

        binomialhAlg = new BinomialH();
        var path = binomialhAlg.startAlgo(fromCity, toCity);
		binomialhAlg.init(binomialhAlg.commands);

        var text = path[0];
        for (var i = 1; i < path.length; i++) text += (" -> "+ path[i] );
        d3.select("#DijkstraMap")
            .append("text")             
            .attr("x", 0)
            .attr("y", height)
            .style("text-anchor", "start")
            .text(text);
	})
    $('#insert').click(function() {
        alert("sorry! not available now.");
    })
    $('#delete').click(function() {
        alert("sorry! not available now.");
    })
}

