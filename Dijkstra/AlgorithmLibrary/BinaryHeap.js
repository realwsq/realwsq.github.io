function BinaryH()
{
	this.bh = new BinaryHeap(null);
}

BinaryH.prototype = new Algorithm();
BinaryH.prototype.constructor = BinaryH;
BinaryH.superclass = Algorithm.prototype;
		
BinaryH.prototype.inserthelper = function(arg) {
	var node = this.bh.push(arg.key);
	// console.log(node);
	this.bh.drawInsert(node);
}	
BinaryH.prototype.deleteminhelper = function(arg) {
	var node = this.bh.pop();
	// console.log(node);
	this.bh.drawDelete(node);
}	
BinaryH.prototype.decreasekeyhelper = function(arg) {
}


BinaryH.prototype.init = function(commands)
{	
	var svg = d3.select("#svg_binaryh");
	var todo = [];
	var ci = 0;
	var bh = this;
	console.log(commands);
	var performCmd = function() {
		command = commands[ci];
		// console.log(ci, command);
		if (command[0] == "insert") {
			// console.log("insert");
			bh.inserthelper(command[1]);
		} else if (command[0] == "deleteMin") {
			// console.log("deleting");
			bh.deleteminhelper();
		} else if (command[0] == "decreaseKey") {
			// console.log("decreasing");
			// bh.decreasekeyhelper(command[1]);
		} else {
			console.log("???");
		}
		ci++;
		// console.log(ci);
		if (ci == commands.length) {
			commands = [];
			clearInterval(int);
		}
	}
	var int  = setInterval(performCmd, DELAY);
	return todo;
}






