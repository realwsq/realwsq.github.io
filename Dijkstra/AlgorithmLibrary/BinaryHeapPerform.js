'use strict';

function BinaryHeap(data, compare) {
    if (!(this instanceof BinaryHeap)) return new BinaryHeap(data, compare);

    this.data = data || [];
    this.length = this.data.length;
    this.compare = compare || defaultCompare;

    if (this.length > 0) {
        for (var i = (this.length >> 1); i >= 0; i--) this._down(i);
    }
}

function defaultCompare(a, b) {
    return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
}

BinaryHeap.prototype = {

    push: function (item) {
        this.data.push({key: item, circle: new AnimatedCircle(null, null, "svg_binaryh"), 
                                    line: new AnimatedLine(0,0,0,0,"svg_binaryh"),
                                    text: new AnimatedText(item, "svg_binaryh")});
        this.length++;
        return this._up(this.length - 1);
    },

    pop: function () {
        if (this.length === 0) return undefined;

        var top = this.data[0];
        this.length--;

        if (this.length > 0) {
            this.data[0] = this.data[this.length];
            this._down(0);
        }
        this.data.pop();

        return top;
    },

    peek: function () {
        return this.data[0];
    },

    _up: function (pos) {
        var data = this.data;
        var compare = this.compare;
        var item = data[pos];

        while (pos > 0) {
            var parent = (pos - 1) >> 1;
            var current = data[parent];
            if (compare(item, current) >= 0) break;
            data[pos] = current;
            pos = parent;
        }

        data[pos] = item;
        return item;
    },

    _down: function (pos) {
        var data = this.data;
        var compare = this.compare;
        var halfLength = this.length >> 1;
        var item = data[pos];

        while (pos < halfLength) {
            var left = (pos << 1) + 1;
            var right = left + 1;
            var best = data[left];

            if (right < this.length && compare(data[right], best) < 0) {
                left = right;
                best = data[right];
            }
            if (compare(best, item) >= 0) break;

            data[pos] = best;
            pos = left;
        }

        data[pos] = item;
    }
};
BinaryHeap.prototype.drawDelete = function(node) {
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
BinaryHeap.prototype.drawInsert = function(newNode) {
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
BinaryHeap.prototype.redraw = function() {
    for (var i = 0; i < this.length; i++) {
        var temp = this.data[i];
        temp.line.redraw(DELAY/2, DELAY/2)
        temp.circle.redraw(DELAY/2, DELAY/2)
        temp.text.redraw(DELAY/2, DELAY/2)
    }
}
BinaryHeap.prototype.calcLineCoor = function() {
    if (!this.length) return; 
    for (var i = this.length-1; i> 0; i--) {
        var temp = this.data[i];
        var par = this.data[Math.floor((i-1)/2)];
        temp.line.px = par.circle.x;
        temp.line.py = par.circle.y;
        temp.line.cx = temp.circle.x;
        temp.line.cy = temp.circle.y;
    }
    var temp = this.data[0];
    temp.line.px = temp.line.cx = temp.circle.x;
    temp.line.py = temp.line.cy = temp.circle.y;
}

BinaryHeap.prototype.calcNodeCoor = function() {
    if (!this.length) return;
    var h = Math.floor(Math.log2(this.length));
    for (var i = h; i >= 0; i--) {
        var d = treesGap * Math.pow(2, h-i);
        var minus = (Math.pow(2, i)-1)*d/2;
        var start = Math.pow(2, i)-1;
        var end = Math.pow(2, i+1)-1;
        // debugger;
        for (var j = start; j < this.length &&  j < end; j++) {
            this.data[j].circle.x = width/2 - minus + d * (j-start);
            this.data[j].circle.y = layerGap * (i+1);
            // debugger;
        }
    }
    // debugger;
}

BinaryHeap.prototype.calcTextCoor = function() {
    for (var i = 0; i < this.length; i++) {
        this.data[i].text.x = this.data[i].circle.x + TEXT_DX;
        this.data[i].text.y = this.data[i].circle.y + TEXT_DY;
    }
}