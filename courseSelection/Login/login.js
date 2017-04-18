$("#submit").click(function() {
  var username = $("#username").val();
  var password = $("#password").val();
  var success = checklogin(username, password);
  if (success == 1) loginSuccess(username, password);
  else loginFail(username, password, success);
});

var loginSuccess = function(username, password) {
    console.log("success");
    window.location.href="SelectionSystem.html?username="+username+",password="+password;  
}

var loginFail = function(username, password, wronginfo) {
    if (wronginfo == 0)
        alert("sorry, no such user"); 
    else if (wronginfo == -1)
        alert("sorry, wrong password"); 
}

function checklogin(userId, passWord){
    if(loginData[userId] == undefined){
        return 0;
    }else{
        if(loginData[userId] == passWord){
            return 1;
        }else{
            return -1;
        }
    }
}