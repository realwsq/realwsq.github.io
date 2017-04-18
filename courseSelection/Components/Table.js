var Table = function(id, body)
{
	this.table = tableCreate(id, body);
}

function tableCreate(id, body) {
    var tbl = document.createElement('table');
    // tbl.style.width = '100px';
    // tbl.style.border = '1px #FFAC55 solid';
    // tbl.cellSpacing = 0;
    // tbl.style.fontSize = '50%';

    // for (var i = 0; i <= 13; i++) {
    //     var tr = tbl.insertRow();
    //     for (var j = 0; j <= 7; j++) {
    //         var td = tr.insertCell();
    //         td.style.padding = '10px';
    //         td.style.border = '1px #FFAC55 solid';
    //         if (i == 5 || i == 10) {
    //             td.style.borderBottom = '3px #FFAC55 solid';
    //         }
    //         if (i == 0 && j == 0) {
    //             td.style.padding = '5px';
    //         }
    //         else if (i == 0) {
    //             td.setAttribute('id', 'day' + j);
    //             td.textContent = 'day' + j;
    //         }
    //         else if (j == 0) {
    //             td.setAttribute('id', 'class' + i);
    //             td.textContent = i;
    //             td.style.padding = '5px';
    //         }
    //         else {
    //             td.setAttribute('id', j + ' ' + i);
    //             td.textContent = '';
    //         }
    //     }
    // }
    tbl.setAttribute("id", id);
    body.appendChild(tbl);
    return tbl;
}