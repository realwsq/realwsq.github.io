function BinomialH()
{
	this.bh = new BinomialHeap()
}

BinomialH.prototype = new Algorithm();
BinomialH.prototype.constructor = BinomialH;
BinomialH.superclass = Algorithm.prototype;
		
BinomialH.prototype.inserthelper = function(arg) {
    var node = this.bh.insert(arg.key, arg.value);
	this.bh.drawInsert(node);
}	
BinomialH.prototype.deleteminhelper = function(arg) {
    var node = this.bh.extractMinimum();
	this.bh.drawDelete(node);
}	
BinomialH.prototype.decreasekeyhelper = function(arg) {

}


BinomialH.prototype.init = function(commands)
{	
	var svg = d3.select("#svg_binomialh");
	var todo = [];
	var ci = 0;
	var bh = this;
    console.log("hello I'm in BinomialHeap init");
	var performCmd = function() {
		command = commands[ci];
		if (command[0] == "insert") {
            console.log("inserting");
			bh.inserthelper(command[1]);
		} else if (command[0] == "deleteMin") {
			console.log("deleting");
			bh.deleteminhelper();
		} else if (command[0] == "decreaseKey") {
			// console.log("decreasing");
			// bh.decreasekeyhelper(command[1]);
		} else {
			console.log("???");
		}
		ci++;
		if (ci == commands.length) clearInterval(int);
	}
	var int  = setInterval(performCmd, DELAY);
	return todo;
}






