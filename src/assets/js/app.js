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
    let balanceValue = sortNumber(response.content[0].balance);
    $("#dashboard-balance").text(balanceValue);
    let fundsValue = sortNumber(response.content[0].funds);
    $("#dashboard-availabe-founds").text(fundsValue);
    let paymentsValue = sortNumber(response.content[0].funds);
    $("#dashboard-payments").text(paymentsValue);
  });

  takeData(currentUrl, "products", function(response) {
    let products = response.content;
    $("#wallets").text(products[0].type + ' [' + products[0].elements + ']');
    $("#wallets-amounts").text(products[0].amount + products[0].currency);

    $("#deposits").text(products[1].type + ' [' + products[1].elements + ']');
    $("#deposits-amounts").text(products[1].amount + products[1].currency);

    $("#accounts").text(products[2].type);
    $("#accounts-amounts").text(products[2].amount + products[2].currency);

    $("#funds").text(products[3].type + ' [' + products[3].elements + ']');
    $("#funds-amounts").text(products[3].amount + products[3].currency);

    $("#loans").text(products[4].type);
    $("#loans-amounts").text(products[4].amount + products[4].currency);
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

  takeData(currentUrl, "history", function(response) {
    let historyData = (response.content);
    historyData.forEach(makeHistoryRecord);
    console.log(historyData);
  });


  function makeHistoryRecord(transactionData, index, array){

    let convertedCurrency = sortNumber(transactionData.amount);
    let convertedDate = convertDate(transactionData.date);

    let newLi = $("<li>");
    let dateContainer = $("<div class='history__container history__date'></div>").text(convertedDate);
    let descriptionContainer = $("<div class='history__container history__description'></div>");
    let historyDescription = $("<p></p>").text(transactionData.description);
    let categoryDescription = $("<p></p>").text(transactionData.category);
    let amountContainer = $("<div class='history__container history__amount'></div>");
    let ifOutcome = $("<span></span>");
    let amountP = $("<span></span>").text(convertedCurrency);
    let currencySpan = $("<span></span>").text(transactionData.currency);

    if (transactionData.status === "outcome") {
      ifOutcome.text("-");
    } else {
      amountP.addClass("text-green");
    }

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

  function convertDate(date) {
    let month = date.substring(5,7);
    let day = date.substring(8,10);
    return day + '.' + month;
  }
//
//   let transaction1 = {
//     date: "2068-07-08",
//     description: "solaisodnsf",
//     category: "Gas",
//     currency: "EUR",
//     amount: 98,
//     status: "outcome"
//   };
//
// makeHistoryRecord(transaction1);


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
