var MYList = function(id, body)
{
	this.oList = listCreate(id, body);
}
var listCreate = function(idname, body) {
    var oList;
    if ((oList = document.getElementById(idname)) == null) {
        oList = document.createElement("li");
        oList.setAttribute("id", idname);
        body.appendChild(oList);
    } else {
    }
    return oList;
}
MYList.prototype.addListItem = function(item, id) {
    
    oElement = document.createElement("li");
    oElement.setAttribute("id", id);
    oTextNode = document.createTextNode(item);
    oElement.appendChild(oTextNode);
    oSpan = document.createElement("span");
    oSpan.setAttribute("class", "candidate-remove glyphicon glyphicon-remove");
    oSpan.addEventListener("click", function() {
        console.log(this);
        var item = $(this).closest('li');
        $(item).remove();
    })
    oElement.appendChild(oSpan);

    this.oList.appendChild(oElement);

    return oElement;
}
MYList.prototype.removeAllChild = function() {
    var list = this.oList;
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
}
MYList.prototype.bindData = function(item, data) {
    item.data = data;
}
MYList.prototype.addEvent = function(item, event, func) {
    item.addEventListener(event, func, false);
}