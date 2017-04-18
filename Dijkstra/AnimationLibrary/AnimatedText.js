
var AnimatedText = function(text, svgname)
{
	this.x = INSERT_X + TEXT_DX;
	this.y = INSERT_Y + TEXT_DY;
    this.svg = d3.select("#"+svgname);
    this.g_text = this.svg.append("g")
	this.addedToScene = "visibile";
    this.text = text;
    // this.highlightIndex = -1;
    this.strokeColor = TEXT_COLOR;
    this.actual = this.g_text.append("text")
                .style("stroke", this.strokeColor)
                .attr("x", this.x)
                .attr("y", this.y)
                .text(this.text)
                .style("font-size", '10px')
                .style("visibility", this.addedToScene);
/*	this.foregroundColor  = '#007700';
	this.backgroundColor  = '#EEFFEE';
 */
}

AnimatedText.prototype.redraw = function(delaytime, duration) {
    this.actual
        .transition()
        .duration(duration)
        .delay(delaytime)
        .style("stroke", this.strokeColor)
        .attr("x", this.x)
        .attr("y", this.y)
        .text(this.text)
        .style("visibility", this.addedToScene);
}


AnimatedText.prototype.addToScene = function() {
    this.addedToScene = "visibile";
}
AnimatedText.prototype.removeFromScene = function() {
    this.addedToScene = "hidden";
}
AnimatedText.prototype.changeColor = function(newcolor) {
    this.strokeColor = newcolor;
}