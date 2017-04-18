function FH()
{
	// this.init();
	// console.log("new fh");
	this.fh = new FibonacciHeap()
}

FH.prototype = new Algorithm();
FH.prototype.constructor = FH;
FH.superclass = Algorithm.prototype;

FH.prototype.inserthelper = function(arg) {
	var node = this.fh.insert(arg.key, arg.value);
	this.fh.drawInsert(node);
}	
FH.prototype.deleteminhelper = function(arg) {
	var node = this.fh.extractMinimum();
	this.fh.drawDelete(node);
}	
FH.prototype.decreasekeyhelper = function(arg) {
	// var node = this.fh.findThisKey(arg.value);
	// if (!node) console.log("can't find");
	// this.fh.decreaseKey(node, arg.newKey);
	// this.fh.drawDecrease(node);
}		
		
FH.prototype.init = function(commands)
{	
	// var svg = d3.select("#svg_fh");
	var todo = [];
	var ci = 0;
	var fh = this;
	var performCmd = function() {
		command = commands[ci];
		if (command[0] == "insert") {
			// console.log("inserting fh");
			fh.inserthelper(command[1]);
		} else if (command[0] == "deleteMin") {
			// console.log("deleting fh");
			fh.deleteminhelper();
		} else if (command[0] == "decreaseKey") {
			// console.log("decreasing");
			// fh.decreasekeyhelper(command[1]);
		} else {
			console.log("???");
		}
		ci++;
		if (ci == commands.length) clearInterval(int);
	}
	var int  = setInterval(performCmd, DELAY);
	return todo;
}






