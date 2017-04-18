var ANIMATION_SPEED_DEFAULT = 75;


// TODO:  Move these out of global space into animation manager?
var objectManager;
var animationManager;
var canvas;

var paused = false;
var playPauseBackButton;
var skipBackButton;
var stepBackButton;
var stepForwardButton;
var skipForwardButton;

var widthEntry;
var heightEntry;
var sizeButton;


function addControlToAnimationBar(type,name, controlbox, containerType)
{
	if (containerType == undefined)
	{
			containerType = "input";
	}
	var element = document.createElement(containerType);
	
        element.setAttribute("type", type);
        // element.setAttribute("value", name);
        element.setAttribute("id",name);
	
	
	var tableEntry = document.createElement("td");
	
	tableEntry.appendChild(element);
	
    var controlBar = document.getElementById(controlbox);
	
    //Append the element in page (in span).
    controlBar.appendChild(tableEntry);
	return element;
	
}


function initGeneralAnimationControls()
{
	// var tableEntry = document.createElement("td");
	
    var controlBar = document.getElementById("GeneralAnimationControls");
	
	tableEntry = document.createElement("td");
	txtNode = document.createTextNode(" from:"); 
	tableEntry.appendChild(txtNode);
	controlBar.appendChild(tableEntry);


	fromEntry = addControlToAnimationBar("Text", "fromEntry", "GeneralAnimationControls");
	fromEntry.size = 8;
	fromEntry.setAttribute("value", "Tholomyes");
	// fromEntry.onkeydown = this.returnSubmit(fromEntry, animationManager.changeSize.bind(animationManager), 4, true);

    tableEntry = document.createElement("td");
	txtNode = document.createTextNode(" to:"); 
	tableEntry.appendChild(txtNode);
	controlBar.appendChild(tableEntry);


	toEntry = addControlToAnimationBar("Text", "toEntry", "GeneralAnimationControls");
	toEntry.size = 8;
	toEntry.setAttribute("value", "Fantine");
	// toEntry.onkeydown = this.returnSubmit(toEntry, animationManager.changeSize.bind(animationManager), 4, true);

	
	tableEntry = document.createElement("td");
	txtNode = document.createTextNode(" animation speed:"); 
	tableEntry.appendChild(txtNode);
	controlBar.appendChild(tableEntry);


	speedEntry = addControlToAnimationBar("Text", "speed", "GeneralAnimationControls");
    speedEntry.setAttribute("value", 5);
	speedEntry.size = 8;
	// speedEntry.onkeydown = this.returnSubmit(toEntry, animationManager.changeSize.bind(animationManager), 4, true);

	
    startButton = addControlToAnimationBar("Button", "GoButton", "GeneralAnimationControls");
    startButton.setAttribute("value", "Go");
    // swapButton.onclick = animstart;	
	
}

function specificControls() {
	insertButton = addControlToAnimationBar("Button", "insert", "AnimationSpecificControls_fh");
    insertButton.setAttribute("value", "Insert");

	deleteButton = addControlToAnimationBar("Button", "delete", "AnimationSpecificControls_fh");
    deleteButton.setAttribute("value", "Delete");

	var controlBar = document.getElementById("AnimationSpecificControls_fh");
	var tableEntry = document.createElement("td");
	txtNode = document.createTextNode(" Decrease Key: "); 
	tableEntry.appendChild(txtNode);
	controlBar.appendChild(tableEntry);

	valueEntry = addControlToAnimationBar("Text", "dk_valueEntry", "AnimationSpecificControls_fh");
	valueEntry.size = 8;
	valueEntry.setAttribute("placeholder", "value");

	newkeyEntry = addControlToAnimationBar("Text", "dk_newkeyEntry", "AnimationSpecificControls_fh");
	newkeyEntry.size = 8;
	newkeyEntry.setAttribute("placeholder", "newkey");
}

function svgtag(svgname, text) {
	d3.select("#"+svgname)
		.append("text")             
		.attr("x", width)
		.attr("y", height-50)
		.style("text-anchor", "end")
		.style("fill", SVGTAG_COLOR)
		.style("font-size", '30px')
		.text(text);;
}
	