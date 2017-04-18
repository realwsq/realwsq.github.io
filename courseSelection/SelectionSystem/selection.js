var body = document.body
var candidateCourse = [];

var options = {
    valueNames: [ "id", 'name', 'teacher', "time", "location", "credit", "semester", "gpa", "score"],
    item: '<tr><td class="id" style="display:none;"></td><td class="name"></td><td class="teacher"></td><td class="time"></td><td class="location"></td><td class="credit"></td><td class="semester"></td><td class="gpa"></td><td class="score"></td>\
    <td><span class="table-add glyphicon glyphicon-plus" ></span></td></tr>',
    page: 10,
    pagination: true,
};
var values = total;
var recommandCourseList = new List('recommandCourseList', options, values);

var candidateValues = [total[404]];
console.log(candidateValues);
var candidateList = new List('candidateList',
    {valueNames:["id","name","teacher"],
    item:'<tr><td class="id" style="display:none;"></td><td class="name"></td><td class="teacher"></td>\
    <td><span class="table-minus glyphicon glyphicon-minus" ></span></td></tr>'},candidateValues);

recommandCourseList.on("updated",function(){
    var editBtns = $(".edit-item-btn");
    editBtns = $(editBtns.selector);
    $('.table-add').click(function () {
        var itemId = $(this).closest('tr').find('.id').text();
        var course = total[itemId-1];
        candidateValues.push(course);
        candidateList.add(course);
        console.log(candidateValues);
        // candidateList.addListItem(course.name+" "+course.teacher, itemId);
    });
})

candidateList.on("updated",function(){
   $('.table-minus').click(function () {
        // console.log("here");
        var itemId = $(this).closest('tr').find('.id').text();
        candidateList.remove("id",parseInt(itemId));
    }); 
})
function init() {
    var info = getInfo();
    var username = info.username;
    var password = info.password;
    $('.table-add').click(function () {
        // console.log("here");
        var itemId = $(this).closest('tr').find('.id').text();
        var course = total[itemId-1];
        // candidateValues.push(course);
        candidateList.add(course);
        // candidateValues.push(course);
        // candidateList.addListItem(course.name+" "+course.teacher);
    });
    $('.table-minus').click(function () {
        console.log("h");
        var itemId = $(this).closest('tr').find('.id').text();
        candidateList.remove("id",parseInt(itemId));
    }); 
    
    
}


var getInfo = function() {
    var info = window.location.search.slice(window.location.search.lastIndexOf("?")+1).split(",");
    var username = info[0].split("=")[1];
    var password = info[1].split("=")[1];
    return {username: username, password: password};
}


$("#addall").click(function() {
    console.log(candidateList.items);
    var temp = [];
    for (var i=0; i < candidateList.items.length;i++){
        temp.push(candidateList.items[i]._values);
    }
    // console.log(temp);
    var text = "3.html?";
    window.location.href=text; 
    window.name = JSON.stringify(temp);
})

$("#jmode").click(function() {
    console.log("?");
    if (this.checked) {
        recommandCourseList.filter(function(item){
            if(item.values().cid.indexOf("J")!=-1){
                return true;
            }else{
                return false;
            }
        })
    } 
    else {
        recommandCourseList.filter();
    }
})


// console.log($("#highgpamode"));
$("#highgpamode").click(function() {
    // console.log(">");
    // console.log("here");
    recommandCourseList.sort('gpa',{
        // order:"desc",
        sortFunction:function(a,b){
            // console.log(a._values.gpa, b._values.gpa);
            // console.log("?")
            agpa = a._values.gpa;
            bgpa = b._values.gpa;
            if(agpa !== null && bgpa !== null) return -parseFloat(agpa)+parseFloat(bgpa);
            else if (agpa !== null ) return -1;
            else return 1;
        }});
})

$("#goodteachermode").click(function() {
//     console.log(">");
    recommandCourseList.sort('score',{
        // order:"desc",
        sortFunction:function(a,b){
            // console.log(a._values.gpa, b._values.gpa);
            // console.log("here");
            agpa = a._values.score;
            bgpa = b._values.score;
            if(agpa !== null && bgpa !== null) return -parseFloat(agpa)+parseFloat(bgpa);
            else if (agpa !== null ) return -1;
            else return 1;
        }});
})

