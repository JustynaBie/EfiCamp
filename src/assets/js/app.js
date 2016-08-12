$(document).foundation()
$(document).on("ready",function(){

  // Variables
  var btnGo = $(".btn-go");
  var logoClick = $(".img-efi");
  var loginValidationInfo = $(".login__validation-info");

 //  Objects
  var currentUser = {
    login: "efi",
    password:"",
  }

  logoClick.on("click", () => alert($(this).attr("src")));

  btnGo.on("click", (event) => {
    event.preventDefault();
    let inputUser = $(".login__name").val();
    currentUser.password = inputUser;
    $(".login__name").val('');

    (!inputUser.length) ? appearErrorInfo("password can not be empty") : sendLogin(currentUser);

  });

  function appearErrorInfo(info) {
    loginValidationInfo.removeClass("hide");
    loginValidationInfo.find("span").text(info);
    setTimeout(addHide, 2000);
  }

  var addHide = () => { loginValidationInfo.addClass("hide") }

  $(".btn-close-error").on("click", (event) => {
    event.preventDefault();
    addHide();
  });

  function sendLogin(currentUser){
    $.ajax({
        url: "https://efigence-camp.herokuapp.com/api/login",
        type: "post",
        dataType: "json",
        data: currentUser,
      }).done((response) => {
      }).fail((error) => {
        appearErrorInfo(error.responseText.slice(39,60));
      })
    };
});
