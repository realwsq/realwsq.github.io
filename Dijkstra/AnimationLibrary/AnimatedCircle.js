
var AnimatedCircle = function(objectID, objectLabel, svgname)
{
	this.objectID = objectID;
	this.label = objectLabel;
	this.x = INSERT_X;
	this.y = INSERT_Y;
    this.svg = d3.select("#"+svgname);
    this.g_circles = this.svg.append("g")
	this.alpha = 1.0;
	this.addedToScene = "visibile";
    // this.highlightIndex = -1;
    this.strokeColor = NEW_CIRCLE_COLOR;
    this.actual = this.g_circles.append("circle")
                .attr("r", CIRCLE_RADIUS)
                .style("fill", this.strokeColor)
                .attr("cx", this.x)
                .attr("cy", this.y)
                .style("visibility", this.addedToScene);
/*	this.foregroundColor  = '#007700';
	this.backgroundColor  = '#EEFFEE';
 */
}

AnimatedCircle.prototype.redraw = function(delaytime, duration) {
    this.actual
        .transition()
        .duration(duration)
        .delay(delaytime)
        .attr("r", CIRCLE_RADIUS)
        .style("fill", this.strokeColor)
        .attr("cx", this.x)
        .attr("cy", this.y)
        .style("visibility", this.addedToScene);
}

var drawText = function(node) {
    var text = g_text.append("text")
        .attr("text", node.value)
        .attr("id", node.value);
    text
        .transition()
        .duration(DELAY*2/3)
        .delay(delayTime)
        .attr("x", node.circle.x + TEXT_DX)
        .attr("y", node.circle.x + TEXT_DY)
}


AnimatedCircle.prototype.addToScene = function() {
    this.addedToScene = "visibile";
}
AnimatedCircle.prototype.removeFromScene = function() {
    this.addedToScene = "hidden";
}
AnimatedCircle.prototype.changeColor = function(newcolor) {
    this.strokeColor = newcolor;
}