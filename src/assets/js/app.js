$(document).foundation()
$(document).on("ready",function(){

  // Login panel variables
  var btnGo = $(".btn-go");
  var logoClick = $(".img-efi");
  var loginValidationInfo = $(".login__validation-info");
  // Dashboard variables
  var envelopeIcon = $(".envelope-icon");
  var searchIcon = $(".search-icon");
  var dashboardAvatar = $(".dashboard__avatar");

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
        window.location.href='/dashboard.html';
      }).fail((error) => {
        appearErrorInfo(error.responseJSON.message);
      })
    };

  // Dashboard
  var toggleElement = (element) =>  {
    element.toggleClass("hide");
  };

  envelopeIcon.on("click", () => {
    toggleElement($(".dashboard__messages"));
  });

  searchIcon.on("click", () => {
    toggleElement($(".dashboard__search-window"));
  });

  dashboardAvatar.on("click", () => {
    toggleElement($(".client-info"));
  });

});
