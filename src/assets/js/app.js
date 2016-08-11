$(document).foundation()
$(document).on("ready",function(){

  var btnGo = $(".btn-go");
  var logoClick = $(".img-efi");
  var currentUser = {
    login: "efi",
    password:"",
  }

  btnGo.on("click", (event) => {
    event.preventDefault();
    var inputUser = $(".login__name").val();
    currentUser.password = inputUser;
    $(".login__name").val('');

    (!inputUser.length) ? alert("password can not be empty") : sendLogin(currentUser);

  });

  logoClick.on("click", () => alert($(this).attr("src")));

  function sendLogin(currentUser){
    $.ajax({
        url: "https://efigence-camp.herokuapp.com/api/login",
        type: "post",
        dataType: "json",
        data: currentUser,
      }).done((response) => {
          console.log("success",
          response);
      }).fail((error) => {
        $(".login-validation-info").removeClass("hide");
        $(".login-validation-info").text(error);
        console.log(error);
      })
    };
});
