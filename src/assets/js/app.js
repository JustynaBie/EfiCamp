$(document).foundation()
$(document).on("ready",function(){

  // Login panel variables
  var btnGo = $(".btn-go");
  var logoClick = $(".img-efi");
  var loginValidationInfo = $(".login__validation-info");
  var loginInput = $(".login__name");
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
    validationPassword();
  });

  loginInput.keypress(() => {
    if(event.which == 13) {
      validationPassword();
    }
});

  function validationPassword() {
    event.preventDefault();
    let inputUser = loginInput.val();
    currentUser.password = inputUser;
    loginInput.val("");

    (!inputUser.length) ? appearErrorInfo("password can not be empty") : sendLogin(currentUser);
  };

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
      });
    };

  // Dashboard header
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

  // Dashboard financial-data
  var currentUrl = "https://efigence-camp.herokuapp.com/api/data/";
  var balance = $("#dashboard-balance");

  takeData(currentUrl, "summary", function(response) {
    $("#dashboard-balance").text(response.content[0].balance + " PLN");
  });

  takeData(currentUrl, "history", function(response) {
    $("#dashboard-availabe-founds").text(response.content[0].amount + " PLN");
  });

  takeData(currentUrl, "products", function(response) {
    $("#dashboard-payments").text(response.content[0].amount + " PLN");
  });

  function takeData(currentUrl, urlId, callback ){
    $.ajax({
        url: currentUrl + urlId,
        type: "get",
        dataType: "json"
      }).done((response) => {
        callback(response);
      }).fail((error) => {
        console.log(error);
      });
    };

});
