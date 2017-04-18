var AnimatedLine= function(x1, y1, x2, y2, svgname)
{
	this.cx = x1;
	this.cy = y1;
    this.px = x2;
    this.py = y2;
    this.svg = d3.select("#"+svgname);
    this.g_lines = this.svg.append("g")
	this.addedToScene = "visibile";
    // this.highlightIndex = -1;
    this.strokeColor = LINE_COLOR;
    this.actual = this.g_lines.append("line")
                .style("stroke", this.strokeColor)
                .attr("x1", this.cx)
                .attr("y1", this.cy)
                .attr("x2", this.px)
                .attr("y2", this.py)
                .style("visibility", this.addedToScene);
/*	this.foregroundColor  = '#007700';
	this.backgroundColor  = '#EEFFEE';
 */
}

AnimatedLine.prototype.redraw = function(delaytime, duration) {
    this.actual
        .transition()
        .duration(duration)
        .delay(delaytime)
        .style("stroke", this.strokeColor)
        .attr("x1", this.cx)
        .attr("y1", this.cy)
        .attr("x2", this.px)
        .attr("y2", this.py)
        .style("visibility", this.addedToScene);
    // console.log("hello")
}

AnimatedLine.prototype.removeFromScene = function() {
    this.addedToScene = "hidden";
}