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
    let newValue = sortNumber(response.content[0].balance)
    $("#dashboard-balance").text(newValue);
  });

  takeData(currentUrl, "history", function(response) {
    let newValue = sortNumber(response.content[0].amount)
    $("#dashboard-availabe-founds").text(newValue);
  });

  takeData(currentUrl, "products", function(response) {
    let newValue = sortNumber(response.content[0].amount)
    $("#dashboard-payments").text(newValue);
  });

  takeData(currentUrl, "products", function(response) {
    console.log(response.content[0].type)
    // let newValue = sortNumber(response.content[0].type)
    $("#wallets").text(response.content[0].type + '[' + response.content[0].elements + ']');
    $("#wallets-amounts").text(response.content[0].amount + response.content[0].currency)
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

  // History panel

  function makeHistoryRecord(transactionData){
  
    let newLi = $("<li>");
    let dateContainer = $("<div class='history__container history__date'></div>").text(transactionData.date);
    let descriptionContainer = $("<div class='history__container history__description'></div>");
    let historyDescription = $("<p></p>").text(transactionData.description);
    let categoryDescription = $("<p></p>").text(transactionData.category);
    let amountContainer = $("<div class='history__container history__amount'></div>");
    let ifOutcome = $("<span>outcome</span>").text(transactionData.status);
    let amountP = $("<span>amount</span>").text(transactionData.amount);
    let currencySpan = $("<span>currency</span>").text(transactionData.currency);

    newLi.append(dateContainer);
    newLi.append(descriptionContainer);
    newLi.append(amountContainer);
    descriptionContainer.append(historyDescription);
    descriptionContainer.append(categoryDescription);
    amountContainer.append(ifOutcome);
    amountContainer.append(amountP );
    amountContainer.append(currencySpan);
    $("#history-list").append(newLi);
  };

  let transaction1 = {
    date: "2068-07-08",
    description: "solaisodnsf",
    category: "Gas",
    currency: "EUR",
    amount: 98,
    status: "outcome"
  };

makeHistoryRecord(transaction1);


  // Sort number
  function sortNumber(input){
    let count = 0;
    let newNumber = [];
    let decimalArray = [];
    let decimalString ;
    let newArray =[];
    let stringArraySpaces;
    let validNumber;
    let numString;

    displayNumber(input);

    function displayNumber(value){

      numString = value.toString();

      displayDecimal(numString);

      let stringArray = numString.split("");

      stringArraySpaces = stringArray.reduceRight(function(newArray,element) {
        if(count === 3) {
          newArray.push(" ");
          count = 0;
        }
        newArray.push(element);
        count++
        return newArray;
        }, []);

      stringArraySpaces.reverse().push(",");
      let newString = stringArraySpaces.join("");
      validNumber = newString.concat(decimalString);
      return validNumber;
    };

    function displayDecimal(value) {
      if(value.indexOf(".")>-1) {
        let arrayDivided = value.split(".");
        numString = arrayDivided[0];
        decimalArray = arrayDivided[1].split("");
        if(decimalArray.length === 1){
          decimalArray.push("0");
        }
       }else{
           decimalArray.push("00");
       }
       decimalString = decimalArray.join("");
    };

    return validNumber;
  };



});
