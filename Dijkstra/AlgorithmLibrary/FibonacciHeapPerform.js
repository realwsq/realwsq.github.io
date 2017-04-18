'use strict';
function FHNode(key, value) {
  this.key = key;
  this.value = value;
  this.prev = this;
  this.next = this;
  this.degree = 0;

  this.parent = undefined;
  this.child = undefined;
  this.isMarked = undefined;

  this.circle = new AnimatedCircle(this.key, this.value, "svg_fh");
  this.line = new AnimatedLine(INSERT_X, INSERT_Y, INSERT_X, INSERT_Y, "svg_fh")
  this.text = new AnimatedText(key, "svg_fh");
}

var FibonacciHeap = function (customCompare) {
  this.minNode = undefined;
  this.nodeCount = 0;

  if (customCompare) {
    this.compare = customCompare;
  }
};


FibonacciHeap.prototype.clear = function () {
  this.minNode = undefined;
  this.nodeCount = 0;
};


FibonacciHeap.prototype.decreaseKey = function (node, newKey) {
  if (typeof node === 'undefined') {
    throw new Error('Cannot decrease key of non-existent node');
  }
  if (this.compare({key: newKey}, {key: node.key}) > 0) {
    throw new Error('New key is larger than old key');
  }

  node.key = newKey;
  var parent = node.parent;
  if (parent && this.compare(node, parent) < 0) {
    cut(node, parent, this.minNode, this.compare);
    cascadingCut(parent, this.minNode, this.compare);
  }
  if (this.compare(node, this.minNode) < 0) {
    this.minNode = node;
  }
};


FibonacciHeap.prototype.delete = function (node) {
  // This is a special implementation of decreaseKey that sets the argument to
  // the minimum value. This is necessary to make generic keys work, since there
  // is no MIN_VALUE constant for generic types.
  var parent = node.parent;
  if (parent) {
    cut(node, parent, this.minNode, this.compare);
    cascadingCut(parent, this.minNode, this.compare);
  }
  this.minNode = node;

  this.extractMinimum();
};


FibonacciHeap.prototype.extractMinimum = function () {
  var extractedMin = this.minNode;
  if (extractedMin) {
    // Set parent to undefined for the minimum's children
    if (extractedMin.child) {
      var child = extractedMin.child;
      do {
        child.parent = undefined;
        child = child.next;
      } while (child !== extractedMin.child);
    }

    var nextInRootList;
    if (extractedMin.next !== extractedMin) {
      nextInRootList = extractedMin.next;
    }
    // Remove min from root list
    removeNodeFromList(extractedMin);
    this.nodeCount--;

    // Merge the children of the minimum node with the root list
    this.minNode = mergeLists(nextInRootList, extractedMin.child, this.compare);
    if (this.minNode) {
      this.minNode = consolidate(this.minNode, this.compare);
    }
  }
  return extractedMin;
};


FibonacciHeap.prototype.findMinimum = function () {
  return this.minNode;
};


FibonacciHeap.prototype.insert = function (key, value) {
  var node = new FHNode(key, value);
  this.minNode = mergeLists(this.minNode, node, this.compare);
  this.nodeCount++;
  return node;
};

FibonacciHeap.prototype.isEmpty = function () {
  return this.minNode === undefined;
};


FibonacciHeap.prototype.size = function () {
  if (this.isEmpty()) {
    return 0;
  }
  return getNodeListSize(this.minNode);
};


FibonacciHeap.prototype.union = function (other) {
  this.minNode = mergeLists(this.minNode, other.minNode, this.compare);
  this.nodeCount += other.nodeCount;
};


FibonacciHeap.prototype.compare = function (a, b) {
  if (a.key > b.key) {
    return 1;
  }
  if (a.key < b.key) {
    return -1;
  }
  return 0;
};

var NodeListIterator = function (start) {
  this.index = -1;
  this.items = [];
  var current = start;
  do {
    this.items.push(current);
    current = current.next;
  } while (start !== current);
};


NodeListIterator.prototype.hasNext = function () {
  return this.index < this.items.length - 1;
};


NodeListIterator.prototype.next = function () {
  return this.items[++this.index];
};


function cut(node, parent, minNode, compare) {
  node.parent = undefined;
  parent.degree--;
  if (node.next === node) {
    parent.child = undefined;
  } else {
    parent.child = node.next;
  }
  removeNodeFromList(node);
  minNode = mergeLists(minNode, node, compare);
  node.isMarked = false;
  return minNode;
}


function cascadingCut(node, minNode, compare) {
  var parent = node.parent;
  if (parent) {
    if (node.isMarked) {
      minNode = cut(node, parent, minNode, compare);
      minNode = cascadingCut(parent, minNode, compare);
    } else {
      node.isMarked = true;
    }
  }
  return minNode;
}


function consolidate(minNode, compare) {
  var aux = [];
  var it = new NodeListIterator(minNode);
  while (it.hasNext()) {
    var current = it.next();

    // If there exists another node with the same degree, merge them
    while (aux[current.degree]) {
      if (compare(current, aux[current.degree]) > 0) {
        var temp = current;
        current = aux[current.degree];
        aux[current.degree] = temp;
      }
      linkHeaps(aux[current.degree], current, compare);
      aux[current.degree] = undefined;
      current.degree++;
    }

    aux[current.degree] = current;
  }

  minNode = undefined;
  for (var i = 0; i < aux.length; i++) {
    if (aux[i]) {
      // Remove siblings before merging
      aux[i].next = aux[i];
      aux[i].prev = aux[i];
      minNode = mergeLists(minNode, aux[i], compare);
    }
  }
  return minNode;
}


function removeNodeFromList(node) {
  var prev = node.prev;
  var next = node.next;
  prev.next = next;
  next.prev = prev;
  node.next = node;
  node.prev = node;
}


function linkHeaps(max, min, compare) {
  removeNodeFromList(max);
  min.child = mergeLists(max, min.child, compare);
  max.parent = min;
  max.isMarked = false;
}


function mergeLists(a, b, compare) {
  if (!a && !b) {
    return undefined;
  }
  if (!a) {
    return b;
  }
  if (!b) {
    return a;
  }

  var temp = a.next;
  a.next = b.next;
  a.next.prev = a;
  b.next = temp;
  b.next.prev = b;

  return compare(a, b) < 0 ? a : b;
}


function getNodeListSize(node) {
  var count = 0;
  var current = node;

  do {
    count++;
    if (current.child) {
      count += getNodeListSize(current.child);
    }
    current = current.next;
  } while (current !== node);

  return count;
}



FibonacciHeap.prototype.findThisKeyWithPar = function(par, value){
    if (!par.child) return null;
    var temp = par.child;
    do {
        if (temp.value == value) return temp;
        var rst = this.findThisKeyWithPar(temp, value);
        if (rst) return rst;
        temp = temp.next;
    } while(temp!=par.child);
    return null;
}

FibonacciHeap.prototype.findThisKey = function(value) {
    var temp = this.minNode;
    if (temp) {
        do {
            if (temp.value == value) return temp;
            var rst = this.findThisKeyWithPar(temp, value);
            if (rst) return rst;
            temp = temp.next;
        } while(temp != this.minNode);
    }
    return null;
}
FibonacciHeap.prototype.drawDecrease = function(node) {    
    node.circle.changeColor(DECREASE_COLOR);
    node.circle.redraw(0, DELAY/2);

    this.calcNodeCoor();
    this.redraw();
    node.circle.changeColor(NORMAL_COLOR);
    node.circle.redraw(DELAY, 1);
}
FibonacciHeap.prototype.drawInsert = function(newNode) {
    // console.log(newNode);    
    newNode.circle.addToScene();
    newNode.circle.redraw(0, DELAY/2);
    newNode.circle.changeColor(NORMAL_COLOR);
    
    this.calcNodeCoor();
    this.calcLineCoor();
    this.calcTextCoor();
    // console.log("----");
    // debugger;
    this.redraw();
}

FibonacciHeap.prototype.drawDelete = function(node) {    
    node.circle.changeColor(DELETE_COLOR);
    node.circle.redraw(0, DELAY/3);
    node.circle.removeFromScene();
    node.line.removeFromScene();
    node.text.removeFromScene();
    node.circle.redraw(DELAY/3, DELAY/6);
    node.line.redraw(DELAY/3, DELAY/6);
    node.text.redraw(DELAY/3, DELAY/6);

    this.calcNodeCoor();
    this.calcLineCoor();
    this.calcTextCoor();
    // console.log("----");
    // debugger;
    this.redraw();
}


FibonacciHeap.prototype.redrawWithPar = function(par){
    if (!par.child) return ;
    var temp = par.child;
    do {
        temp.line.redraw(DELAY/2, DELAY/2)
        temp.circle.redraw(DELAY/2, DELAY/2)
        temp.text.redraw(DELAY/2, DELAY/2)
        this.redrawWithPar(temp);
        temp = temp.next;
    } while(temp!=par.child);
}

FibonacciHeap.prototype.redraw = function() {
    var temp = this.minNode;
    if (temp) {
        do {
            temp.line.redraw(DELAY/2, DELAY/2)
            temp.circle.redraw(DELAY/2, DELAY/2)
            temp.text.redraw(DELAY/2, DELAY/2)
            this.redrawWithPar(temp);
            temp = temp.next;
        } while(temp != this.minNode);
    }
}

// var printline = function(line) {
//   console.log(line.cx, line.cy, line.px, line.py);
// }
FibonacciHeap.prototype.calcTextCoorWithPar = function(par) {
    // par.circle.y = layer * layerGap;
    if (!par.child) return;
    var temp = par.child;
    do {
        temp.text.x = temp.circle.x;
        temp.text.y = temp.circle.y;
        this.calcTextCoorWithPar(temp);
        // console.log(temp)
        temp = temp.next;
    } while(temp != par.child)
}

FibonacciHeap.prototype.calcTextCoor = function() {
    var temp = this.minNode;
    if (temp) {
        do {
            temp.text.x = temp.circle.x;
            temp.text.y = temp.circle.y;
            // console.log(temp);
            this.calcTextCoorWithPar(temp);
            temp = temp.next;
        } while(temp != this.minNode);
    }
}

FibonacciHeap.prototype.calcLineCoorWithPar = function(par) {
    // par.circle.y = layer * layerGap;
    if (!par.child) return;
    var temp = par.child;
    do {
        temp.line.px = temp.parent.circle.x;
        temp.line.py = temp.parent.circle.y;
        temp.line.cx = temp.circle.x;
        temp.line.cy = temp.circle.y;
        this.calcLineCoorWithPar(temp);
        // console.log(temp)
        temp = temp.next;
    } while(temp != par.child)
}

FibonacciHeap.prototype.calcLineCoor = function() {
    var temp = this.minNode;
    if (temp) {
        do {
            temp.line.cx = temp.line.px = temp.circle.x;
            temp.line.cy = temp.line.py = temp.circle.y;
            // console.log(temp);
            this.calcLineCoorWithPar(temp);
            temp = temp.next;
        } while(temp != this.minNode);
    }
}

FibonacciHeap.prototype.calcNodeCoorWithPar = function(par, leftest, layer) {
    // par.circle.y = layer * layerGap;
    if (!par.child) return leftest + treesGap;
    var rightest = leftest;
    var temp = par.child;
    do {
        temp.circle.x = this.calcNodeCoorWithPar(temp, rightest, layer+1);
        temp.circle.y = (layer+1) * layerGap;
        rightest = temp.circle.x;
        temp = temp.next;
    } while(temp != par.child)
    // par.circle.x = rightest;
    return rightest;
}

FibonacciHeap.prototype.calcNodeCoor =  function() {
    var temp = this.minNode;
    var leftest = 0;
    
    if (temp) {
        // if (this.minNode.value == "Mabeuf") debugger;
        do {
            temp.circle.x = this.calcNodeCoorWithPar(temp, leftest, 1);
            temp.circle.y = layerGap;
            leftest = temp.circle.x;
            temp = temp.next;
        } while(temp != this.minNode);
    }
}