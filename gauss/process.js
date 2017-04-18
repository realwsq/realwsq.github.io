var a1 = parseFloat($( "#a1" ).val());
var b1 = parseFloat($( "#b1" ).val());
var c1 = parseFloat($( "#c1" ).val());
var a2 = parseFloat($( "#a2" ).val());
var b2 = parseFloat($( "#b2" ).val());
var c2 = parseFloat($( "#c2" ).val());

var render_segment = function (){
    var data = {};
    $('#main').append(Mustache.render('<div>------------------------------</div>', data));
}

var render_matrix = function(mtx1, mtx2, mode = 0) {
    /*
    matrix: [[[]]]
    */
        var data = {
            a1_g: mtx1[0][0],
            concat1_g: mtx1[0][1] > 0 ? '+' : '-',
            b1_g: Math.abs(mtx1[0][1]),
            c1_g: mtx1[0][2],
            a2_g: mtx1[1][0],
            concat2_g: mtx1[1][1] > 0 ? '+' : '-',
            b2_g: Math.abs(mtx1[1][1]),
            c2_g: mtx1[1][2],

            a1_t: mtx2[0][0],
            concat1_t: mtx2[0][1] > 0 ? '+' : '-',
            b1_t: Math.abs(mtx2[0][1]),
            c1_t: mtx2[0][2],
            a2_t: mtx2[1][0],
            concat2_t: mtx2[1][1] > 0 ? '+' : '-',
            b2_t: Math.abs(mtx2[1][1]),
            c2_t: mtx2[1][2],
        }
        if (!mode)
            $('#main').append(Mustache.render('<div><div style="font-size:20px">$\\Rightarrow\\begin{cases} {{a1_g}}x_1{{concat1_g}}{{b1_g}}x_2={{c1_g}}\\\\{{a2_g}}x_1{{concat2_g}}{{b2_g}}x_2={{c2_g}}\\end{cases}\
                                                                                         \\begin{cases} {{a1_t}}x_1{{concat1_t}}{{b1_t}}x_2={{c1_t}}\\\\{{a2_t}}x_1{{concat2_t}}{{b2_t}}x_2={{c2_t}}\\end{cases}$</div><p></p></div>', data));
        else 
            $('#main').append(Mustache.render('<div><div style="font-size:20px">$\\Rightarrow\\begin{cases} {{a1_g}}x_2{{concat1_g}}{{b1_g}}x_1={{c1_g}}\\\\{{a2_g}}x_2{{concat2_g}}{{b2_g}}x_1={{c2_g}}\\end{cases}\
                                                                                         \\begin{cases} {{a1_t}}x_1{{concat1_t}}{{b1_t}}x_2={{c1_t}}\\\\{{a2_t}}x_1{{concat2_t}}{{b2_t}}x_2={{c2_t}}\\end{cases}$</div><p></p></div>', data));
}

var render_solution = function(x1, x2) {
    var data = {
        x1_g: (x1[0] === undefined || x1[0] === NaN) ? '?' : x1[0],
        x2_g: (x1[1] === undefined || x1[1] === NaN) ? '?' : x1[1],
        x1_t: (x2[0] === undefined || x2[0] === NaN) ? '?' : x2[0],
        x2_t: (x2[1] === undefined || x2[1] === NaN) ? '?' : x2[1],
    }
    $('#main').append(Mustache.render('<div><div style="font-size:20px">$\\Rightarrow\\begin{cases} x_1 = {{x1_g}}\\\\x_2 = {{x2_g}}\\end{cases}\
                                                                                     \\begin{cases} x_1 = {{x1_t}}\\\\x_2 = {{x2_t}}\\end{cases}$</div><p></p></div>', data));
}
var render_relativeerror = function(re1, re2) {
    var data = {
        er1: re1,
        er2: re2,
    }
    $('#main').append(Mustache.render('<div><div style="font-size:20px">$\\Delta_{x_1} = {{er1}}\\\\\\Delta_{x_2} = {{er2}}$</div><p></p></div>', data));
}
var run = function() {
    var [ans, A_history_g, x_history_g] = naiveGauss([[a1,b1,c1],[a2,b2,c2]]);
    var [ans_true, A_history_t, x_history_t] = naiveGaussTrue([[a1,b1,c1],[a2,b2,c2]]);
    for(var i = 0; i < A_history_g.length; i++){
        render_matrix(A_history_g[i][0], A_history_t[i][0]);
    }
    $('#main').append(Mustache.render('<p>back substitute</p>'));
    for(var i = 0; i < x_history_g.length; i++) {
        console.log(x_history_g, x_history_t);
        render_solution(x_history_g[i], x_history_t[i]);
    }
    $('#main').append(Mustache.render('<p>relative error</p>'));
    var x1_g = x_history_g[x_history_g.length-1][0], x2_g = x_history_g[x_history_g.length-1][1],
        x1_t = x_history_t[x_history_t.length-1][0], x2_t = x_history_t[x_history_t.length-1][1];
    render_relativeerror(Math.abs(x1_g-x1_t)/x1_t, Math.abs(x2_g-x2_t)/x2_t);
}

var run_good = function() {
    var [ans, A_history_g, x_history_g, mode] = goodGauss([[a1,b1,c1],[a2,b2,c2]]);
    var [ans_true, A_history_t, x_history_t] = naiveGaussTrue([[a1,b1,c1],[a2,b2,c2]]);
    for(var i = 0; i < A_history_g.length; i++){
        render_matrix(A_history_g[i][0], A_history_t[i][0], mode);
    }
    $('#main').append(Mustache.render('<p>back substitute</p>'));
    for(var i = 0; i < x_history_g.length; i++) {
        console.log(x_history_g, x_history_t);
        render_solution(x_history_g[i], x_history_t[i]);
    }
    $('#main').append(Mustache.render('<p>relative error</p>'));
    var x1_g = x_history_g[x_history_g.length-1][0], x2_g = x_history_g[x_history_g.length-1][1],
        x1_t = x_history_t[x_history_t.length-1][0], x2_t = x_history_t[x_history_t.length-1][1];
    render_relativeerror(Math.abs(x1_g-x1_t)/x1_t, Math.abs(x2_g-x2_t)/x2_t);
}

window.onload = function () {
    // render_segment();
    // run();
}

$('#a1').change(function () {
    a1 = parseFloat($( "#a1" ).val());
});

$('#b1').change(function () {
    b1 = parseFloat($( "#b1" ).val());
});

$('#a2').change(function () {
    a2 = parseFloat($( "#a2" ).val());
});

$('#b2').change(function () {
    b2 = parseFloat($('#b2').val());
});

$('#c1').change(function () {
    c1 = parseFloat($('#c1').val());
});

$('#c2').change(function () {
    c2 = parseFloat($('#c2').val());
});

$('#load').click(function () {
    render_segment();
    run();
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    return false;
});

$('#load_good').click(function () {
    render_segment();
    run_good();
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    return false;
});