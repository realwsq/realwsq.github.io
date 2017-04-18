'use strict';
function BinomialHNode(key, value) {
  this.key = key;
  this.value = value;
  this.degree = 0;
  this.parent = undefined;
  this.child = undefined;
  this.sibling = undefined;

  this.circle = new AnimatedCircle(this.key, this.value, "svg_binomialh");
  this.line = new AnimatedLine(0, 0, 0, 0, "svg_binomialh");
  this.text = new AnimatedText(key, "svg_binomialh");
}

var BinomialHeap = function (customCompare) {
  this.head = undefined;
  this.nodeCount = 0;

  if (customCompare) {
    this.compare = customCompare;
  }
};

BinomialHeap.prototype.clear = function () {
  this.head = undefined;
  this.nodeCount = 0;
};


BinomialHeap.prototype.extractMinimum = function () {
  if (!this.head) {
    return undefined;
  }

  var min = this.head;
  var minPrev;
  var next = min.sibling;
  var nextPrev = min;

  while (next) {
    if (this.compare(next, min) < 0) {
      min = next;
      minPrev = nextPrev;
    }
    nextPrev = next;
    next = next.sibling;
  }

  removeTreeRoot(this, min, minPrev);
  this.nodeCount--;

  return min;
};


BinomialHeap.prototype.findMinimum = function () {
  if (typeof this.head === 'undefined') {
    return undefined;
  }

  var min = this.head;
  var next = min.sibling;

  while (next) {
    if (this.compare(next, min) < 0) {
      min = next;
    }
    next = next.sibling;
  }

  return min;
};


BinomialHeap.prototype.insert = function (key, value) {
  var tempHeap = new BinomialHeap();
  var newNode = new BinomialHNode(key, value);
  tempHeap.head = newNode;
  tempHeap.nodeCount++;
  this.union(tempHeap);
  return newNode;
};


BinomialHeap.prototype.isEmpty = function () {
  return !this.head;
};


BinomialHeap.prototype.size = function () {
  return this.nodeCount;
};


BinomialHeap.prototype.union = function (heap) {
  this.nodeCount += heap.nodeCount;

  var newHead = mergeHeaps(this, heap);

  this.head = undefined;
  heap.head = undefined;

  if (!newHead) {
    return undefined;
  }

  var prev;
  var curr = newHead;
  var next = newHead.sibling;

  while (next) {
    if (curr.degree !== next.degree ||
        (next.sibling && next.sibling.degree === curr.degree)) {
      prev = curr;
      curr = next;
    } else if (this.compare(curr, next) < 0) {
      curr.sibling = next.sibling;
      linkTrees(curr, next);
    } else {
      if (typeof prev === 'undefined') {
        newHead = next;
      } else {
        prev.sibling = next;
      }

      linkTrees(next, curr);
      curr = next;
    }

    next = curr.sibling;
  }

  this.head = newHead;
};


BinomialHeap.prototype.compare = function (a, b) {
  if (a.key > b.key) {
    return 1;
  }
  if (a.key < b.key) {
    return -1;
  }
  return 0;
};


function mergeHeaps(a, b) {
  if (typeof a.head === 'undefined') {
    return b.head;
  }
  if (typeof b.head === 'undefined') {
    return a.head;
  }

  var head;
  var aNext = a.head;
  var bNext = b.head;

  if (a.head.degree <= b.head.degree) {
    head = a.head;
    aNext = aNext.sibling;
  } else {
    head = b.head;
    bNext = bNext.sibling;
  }

  var tail = head;

  while (aNext && bNext) {
    if (aNext.degree <= bNext.degree) {
      tail.sibling = aNext;
      aNext = aNext.sibling;
    } else {
      tail.sibling = bNext;
      bNext = bNext.sibling;
    }

    tail = tail.sibling;
  }

  tail.sibling = aNext ? aNext : bNext;

  return head;
}


function linkTrees(minNodeTree, other) {
  other.parent = minNodeTree;
  other.sibling = minNodeTree.child;
  minNodeTree.child = other;
  minNodeTree.degree++;
}


function removeTreeRoot(heap, root, prev) {
  // Remove root from the heap
  if (root === heap.head) {
    heap.head = root.sibling;
  } else {
    prev.sibling = root.sibling;
  }

  // Reverse the order of root's children and make a new heap
  var newHead;
  var child = root.child;
  while (child) {
    var next = child.sibling;
    child.sibling = newHead;
    child.parent = undefined;
    newHead = child;
    child = next;
  }
  var newHeap = new BinomialHeap();
  newHeap.head = newHead;

  heap.union(newHeap);
}




BinomialHeap.prototype.findThisKeyWithPar = function(par, value){
    if (!par.child) return null;
    var temp = par.child;
    while(temp) {
        if (temp.value == value) return temp;
        var rst = this.findThisKeyWithPar(temp, value);
        if (rst) return rst;
        temp = temp.sibling;
    } 
    return null;
}

BinomialHeap.prototype.findThisKey = function(value) {
    var temp = this.head;
    while (temp) {
        
        if (temp.value == value) return temp;
        var rst = this.findThisKeyWithPar(temp, value);
        if (rst) return rst;
        temp = temp.sibling;
       
    }
    return null;
}

BinomialHeap.prototype.drawInsert = function(newNode) {    
    newNode.circle.addToScene();
    newNode.circle.redraw(0, DELAY/2);
    newNode.circle.changeColor(NORMAL_COLOR);
    
    this.calcNodeCoor();
    this.calcLineCoor();
    this.calcTextCoor();
    // console.log("?");
    this.redraw();
    // console.log("ooops");
}

BinomialHeap.prototype.drawDelete = function(node) {    
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
    this.redraw();
}
BinomialHeap.prototype.redrawWithPar = function(par){
    var temp = par.child;
    while(temp) {
        temp.line.redraw(DELAY/2, DELAY/2)
        temp.circle.redraw(DELAY/2, DELAY/2)
        temp.text.redraw(DELAY/2, DELAY/2)
        this.redrawWithPar(temp);
        temp = temp.sibling;
    } 
}
BinomialHeap.prototype.redraw = function() {
    var temp = this.head;
    while (temp) {
        temp.line.redraw(DELAY/2, DELAY/2)
        temp.circle.redraw(DELAY/2, DELAY/2)
        temp.text.redraw(DELAY/2, DELAY/2)
        this.redrawWithPar(temp);
        temp = temp.sibling;
    }
}
BinomialHeap.prototype.calcTextCoorWithPar = function(par) {
    // par.circle.y = layer * layerGap;
    if (!par.child) return;
    var temp = par.child;
    while(temp) {
        temp.text.x = temp.circle.x;
        temp.text.y = temp.circle.y;
        this.calcTextCoorWithPar(temp);
        // console.log(temp.line)
        temp = temp.sibling;
    } 
}

BinomialHeap.prototype.calcTextCoor = function() {
    var temp = this.head;
    // console.log("?");
    while (temp) {
          temp.text.x = temp.circle.x;
          temp.text.y = temp.circle.y;
          // console.log(temp.line);
          this.calcTextCoorWithPar(temp);
          temp = temp.sibling;
    }
}
BinomialHeap.prototype.calcLineCoorWithPar = function(par) {
    // par.circle.y = layer * layerGap;
    if (!par.child) return;
    var temp = par.child;
    while(temp) {
        temp.line.px = temp.parent.circle.x;
        temp.line.py = temp.parent.circle.y;
        temp.line.cx = temp.circle.x;
        temp.line.cy = temp.circle.y;
        this.calcLineCoorWithPar(temp);
        // console.log(temp.line)
        temp = temp.sibling;
    } 
}

BinomialHeap.prototype.calcLineCoor = function() {
    var temp = this.head;
    // console.log("?");
    while (temp) {
          temp.line.cx = temp.line.px = temp.circle.x;
          temp.line.cy = temp.line.py = temp.circle.y;
          // console.log(temp.line);
          this.calcLineCoorWithPar(temp);
          temp = temp.sibling;
    }
}
BinomialHeap.prototype.calcNodeCoorWithPar = function(par, leftest, layer) {
    // par.circle.y = layer * layerGap;
    if (!par.child) return leftest + treesGap;
    var rightest = leftest;
    var temp = par.child;
    while (temp) {
        temp.circle.x = this.calcNodeCoorWithPar(temp, rightest, layer+1);
        temp.circle.y = (layer+1) * layerGap;
        rightest = temp.circle.x;
        temp = temp.sibling;
    } 
    // par.circle.x = rightest;
    return rightest;
}

BinomialHeap.prototype.calcNodeCoor =  function() {
    var temp = this.head;
    while(temp) {
        temp.circle.x = treesGap * Math.pow(2, temp.degree);
        temp.circle.y = layerGap;
        this.calcNodeCoorWithPar(temp, temp.circle.x/2, 1);
        temp = temp.sibling;
    }
}
