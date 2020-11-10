function Validator(options){
  var selectorRules = {};
  function validate(inputElement , rule){
    var errorMessage;
    var errorMessageElement = inputElement.parentElement.querySelector('.form-message');
    var rules = selectorRules[rule.selector];
    for(var i = 0 ; i < rules.length ; i++) {
      errorMessage = rules[i](inputElement.value);
      if(errorMessage) break;
    }
    if(errorMessage){
      errorMessageElement.innerText = errorMessage;
      inputElement.parentElement.classList.add("invalid");
    }
    else{
      errorMessageElement.innerText = "";
      inputElement.parentElement.classList.remove("invalid");
    }
    inputElement.oninput = function(){
      errorMessageElement.innerText = "";
      inputElement.parentElement.classList.remove("invalid");
    }
  }
  var formElement = document.querySelector(options.form);
  if(formElement){
    formElement.onsubmit = function (e){
      e.preventDefault();
      options.rules.forEach(function (rule){
        var inputElement = formElement.querySelector(rule.selector);
        validate(inputElement , rule);
      })
    }
    options.rules.forEach(function (rule){

      if (Array.isArray(selectorRules[rule.selector])){
        selectorRules[rule.selector].push(rule.test)
      }
      else {
        selectorRules[rule.selector] = [rule.test];
      }
      var inputElement = formElement.querySelector(rule.selector);
      if(inputElement){
        inputElement.onblur = function() {
         validate(inputElement , rule);
        }
      }
    })
    console.log(selectorRules);
  }
}
Validator.isRequired = function(selector){
  return {
    selector : selector,
    test : function(value){
      return value.trim() ? undefined :'Vui long nhap !';
    }
  }
}
Validator.isEmail = function(selector){
  return {
    selector : selector,
    test : function(value){
      var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      return regex.test(value) ? undefined : 'Vui long nhap lai !'
    }
  }
}
Validator.minLength = function(selector , min) {
  return {
    selector : selector,
    test : function(value) {
      return value.length >= min ? undefined : `PassWord phai dai hon ${min} ki tu`;
    }
  }
}
Validator.isConformed = function(selector , getConformation){
  return {
    selector : selector,
    test : function(value) {
      return value === getConformation() ? undefined : 'Nhap khong chinh xac!';
    }
  }
}
