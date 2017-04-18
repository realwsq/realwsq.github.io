/** Solve a linear system of equations given by a n&times;n matrix
    with a result vector n&times;1. */
'use strict'
var limit = 4;
function convert(val) {
    var temp = Math.abs(val);
    var valid_digit = Math.floor(Math.log10(temp)) + 1;

    temp /= Math.pow(10, valid_digit);

    var scale = Math.pow(10, limit);
    temp *= scale;
    if (temp - parseInt(temp) < 0.5)
        var nearest = Math.floor(temp) / scale;  /* Result: 37.78 */
    else var nearest = Math.ceil(temp) / scale; 
    var result = nearest * Math.pow(10, valid_digit);
    if (val < 0) {
        val = -result;
    }
    else {
        val = result;
    }
    return val;
}
function add(v1, v2){
    v1 = convert(v1);
    v2 = convert(v2);
    return convert(v1 + v2);
}
function minus(v1, v2){
    v1 = convert(v1);
    v2 = convert(v2);
    return convert(v1 - v2);
}
function divide(v1, v2){
    v1 = convert(v1);
    v2 = convert(v2);
    return convert(v1 / v2);
}
function multiply(v1, v2){
    v1 = convert(v1);
    v2 = convert(v2);
    return convert(v1 * v2);
}

function pivotGauss(A) {
    var n = A.length;

    for (var i=0; i<n; i++) {
        // Search for maximum in this column
        var maxEl = Math.abs(A[i][i]);
        var maxRow = i;
        for(var k=i+1; k<n; k++) {
            if (Math.abs(A[k][i]) > maxEl) {
                maxEl = Math.abs(A[k][i]);
                maxRow = k;
            }
        }

        // Swap maximum row with current row (column by column)
        for (var k=i; k<n+1; k++) {
            var tmp = A[maxRow][k];
            A[maxRow][k] = A[i][k];
            A[i][k] = tmp;
        }

        // Make all rows below this one 0 in current column
        for (k=i+1; k<n; k++) {
            var c = -A[k][i]/A[i][i];
            for(var j=i; j<n+1; j++) {
                if (i==j) {
                    A[k][j] = 0;
                } else {
                    A[k][j] += c * A[i][j];
                }
            }
        }
    }

    // Solve equation Ax=b for an upper triangular matrix A
    var x= new Array(n);
    for (var i=n-1; i>-1; i--) {
        x[i] = A[i][n]/A[i][i];
        for (var k=i-1; k>-1; k--) {
            A[k][n] -= A[k][i] * x[i];
        }
    }
    return x;
}
function deepcopy(obj) {
    var out = [],i = 0,len = obj.length;
    for (; i < len; i++) {
        if (obj[i] instanceof Array){
            out[i] = deepcopy(obj[i]);
        }
        else out[i] = obj[i];
    }
    return out;
}

function naiveGauss(AA) {
    var A = deepcopy(AA);
    var A_history = [[deepcopy(A)]];
    var x_history = [];
    var n = A.length;
    // render_matrix([A]);
    for (var i=0; i<n; i++) {
        for (k=i+1; k<n; k++) {
            var c = -divide(A[k][i],A[i][i]);
            for(var j=i; j<n+1; j++) {
                if (i==j) {
                    A[k][j] = 0;
                } else {
                    A[k][j] = add(A[k][j], multiply(c, A[i][j]));
                }
            }
            A_history.push([deepcopy(A)]);
        }
        // render_matrix([A]);
    }
    var x= new Array(n);
    for (var i=n-1; i>-1; i--) {
        x[i] = divide(A[i][n],A[i][i]);
        for (var k=i-1; k>-1; k--) {
            A[k][n] = minus(A[k][n], multiply(A[k][i], x[i]));
        }
        // render_solution(x);
        x_history.push(deepcopy(x));
    }
    // console.log('hi');
    // console.log(A_history);
    return [x, A_history, x_history];
}

function naiveGaussTrue(AA) {
    var A = deepcopy(AA);
    var A_history = [[deepcopy(A)]];
    var x_history = [];
    var n = A.length;
    // render_matrix([A]);
    for (var i=0; i<n; i++) {
        for (k=i+1; k<n; k++) {
            var c = -(A[k][i]/A[i][i]);
            for(var j=i; j<n+1; j++) {
                if (i==j) {
                    A[k][j] = 0;
                } else {
                    A[k][j] = (A[k][j]+ c* A[i][j]);
                }
            }
            A_history.push([deepcopy(A)]);
            // render_matrix([A]);
        }
    }

    // Solve equation Ax=b for an upper triangular matrix A
    var x= new Array(n);
    for (var i=n-1; i>-1; i--) {
        x[i] = (A[i][n]/A[i][i]);
        for (var k=i-1; k>-1; k--) {
            A[k][n] = (A[k][n]- (A[k][i] * x[i]));
        }
        x_history.push(deepcopy(x));
        // render_solution(x);
    }
    return [x, A_history, x_history];
}

function goodGauss(AA) {
    var A = deepcopy(AA);
    var mode = 0;
    var a00 = A[0][0];
    var a01 = A[0][1];
    var a02 = A[0][2];
    var a10 = A[1][0];
    var a11 = A[1][1];
    var a12 = A[1][2];
    var r1 = Math.abs(divide(a00, a01));
    var r2 = Math.abs(divide(a01, a00));
    var r3 = Math.abs(divide(a10, a11));
    var r4 = Math.abs(divide(a11, a10));
    var max_a = Math.max(r1,r2,r3,r4);
    // var A_history = [[deepcopy(A)]];
    if(max_a == r1){
        // do not need to change
    }else if(max_a == r2){
        var temp = A[0][0];
        A[0][0] = A[0][1];
        A[0][1] = temp;
        temp = A[1][0];
        A[1][0] = A[1][1];
        A[1][1] = temp;
        mode = 1;
    }else if(max_a == r3){
        var temp = A[0][0];
        A[0][0] = A[1][0];
        A[1][0] = temp;
        temp = A[0][1];
        A[0][1] = A[1][1];
        A[1][1] = temp;
        temp = A[0][2];
        A[0][2] = A[1][2];
        A[1][2] = temp;
    }else{
        var temp = A[0][0];
        A[0][0] = A[1][0];
        A[1][0] = temp;
        temp = A[0][1];
        A[0][1] = A[1][1];
        A[1][1] = temp;
        temp = A[0][2];
        A[0][2] = A[1][2];
        A[1][2] = temp;
        temp = A[0][0];
        A[0][0] = A[0][1];
        A[0][1] = temp;
        temp = A[1][0];
        A[1][0] = A[1][1];
        A[1][1] = temp;
        mode = 1;
    }
    var x, A_history, x_history;
    var [x, A_history, x_history] = naiveGauss(A);
    var change = function(x) {
        var temp = x[0];
        x[0] = x[1];
        x[1] = temp;
    }
    if (mode) {
        for (var i = 0; i < x_history.length; i++) {
            change(x_history[i]);
        }
    }
    return [x, A_history, x_history, mode];
}