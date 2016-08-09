$(document).foundation()
$(document).on("ready",function(){

  var currentUser = {
    login: "efi",
    password:"",
  }

  var btnGo = $(".btn-go");
  btnGo.on("click", function(){
    event.preventDefault();
    var inputUser = $(".login__name").val();
    currentUser.password = inputUser;

    if (!inputUser.length){
      alert("password can not be empty");
    } else {
      sendLogin(currentUser);
    }

  });

  var logoClick = $(".img-efi");
  logoClick.on("click",function(){
    alert($(this).attr("src"))
  });

  function sendLogin(currentUser){
    $.ajax({
      type: "post",
      data: currentUser,
      url: "https://efigence-camp.herokuapp.com/api/login",
      error: function(response) {
        console.log(response.responseText);
      },
      success: function(response) {
        console.log("success",
        response);
      }
    });
  };
});
