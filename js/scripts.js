class Validator {

  constructor() {

    this.validations = [
      'data-required',
      'data-min-length',
      'data-max-length',
      'data-email-validate',
      'data-only-letters',
      'data-equal',
      'data-password-validate',
    ]
  }

  // start validating all fields
  validate(form) {

    // retrieves all validations
    let currentValidations = document.querySelectorAll('form .error-validation');

    if(currentValidations.length > 0) {
      this.cleanValidations(currentValidations);
    }

    // get the inputs
    let inputs = form.getElementsByTagName('input');

    // transform HTMLCollection -> array
    let inputsArray = [...inputs];

    // loop on inputs and validation based on what is found
    inputsArray.forEach(function(input) {
      
      // loop over all existing validations
      for(let i = 0; this.validations.length > i; i++) {
        // checks if the current validation exists on the input
        if(input.getAttribute(this.validations[i]) != null) {
          
          // clearing the string to turn it into a method
          let method = this.validations[i].replace('data-', '').replace('-', '');

          // value input
          let value = input.getAttribute(this.validations[i]);

          // invoke the method
          this[method](input, value);

        }
      }

    }, this);
  }

  // checks if an input has a minimum number of characters
  minlength(input, minValue) {

    let inputLength = input.value.length;

    let errorMessage = `Field must be at least ${minValue} characters`;

    if(inputLength < minValue) {
      this.printMessage(input, errorMessage);
    }

  }

  // checks if an input has exceeded the character limit
  maxlength(input, maxValue) {

    let inputLength = input.value.length;

    let errorMessage = `Field must be less than ${maxValue} characters`;

    if(inputLength > maxValue) {
      this.printMessage(input, errorMessage);
    }

  }

  // validate emails
  emailvalidate(input) {

    // email@anything.com
    let re = /\S+@\S+\.\S+/;

    let email = input.value;

    let errorMessage = `Enter an email in the pattern name@email.com`;

    if(!re.test(email)) {
      this.printMessage(input, errorMessage);
    }

  }

  // validates if the field has only letters
  onlyletters(input) {

    let re = /^[A-Za-z]+$/;

    let inputValue = input.value;

    let errorMessage = `This field does not accept numbers and special characters`;

    if(!re.test(inputValue)) {
      this.printMessage(input, errorMessage);
    }
  }

  // checks if input is required
  required(input) {

    let inputValue = input.value;

    if(inputValue === '') {
      let errorMessage = `This field is required`;

      this.printMessage(input, errorMessage);
    }

  }

  // checks if two fields are equal
  equal(input, inputName) {

    let inputToCompare = document.getElementsByName(inputName)[0];

    let errorMessage = `This field must be equal to ${inputName}`;

    if(input.value != inputToCompare.value) {
      this.printMessage(input, errorMessage);
    }

  }

  // validate the password field
  passwordvalidate(input) {

    // explode string into an array
    let charArr = input.value.split("");

    let uppercases = 0;
    let numbers = 0;

    for(let i = 0; charArr.length > i; i++) {
      if(charArr[i] === charArr[i].toUpperCase() && isNaN(parseInt(charArr[i]))) {
        uppercases++;
      } else if(!isNaN(parseInt(charArr[i]))) {
        numbers++;
      }
    }

    if(uppercases === 0 || numbers === 0) {
      let errorMessage = `Password needs an uppercase character and a number`;

      this.printMessage(input, errorMessage);
    }

  }

  // method to print error messages to the screen
  printMessage(input, msg) {

    // amount of errors
    let errorsQty = input.parentNode.querySelector('.error-validation');

    if(errorsQty === null) {

      let template = document.querySelector('.error-validation').cloneNode(true);

      template.textContent = msg;

      let inputParent = input.parentNode;

      template.classList.remove('template');

      inputParent.appendChild(template);

    }

  }

  // clear validations
  cleanValidations(validations) {
    validations.forEach(el => el.remove());
  }

}

let form = document.getElementById("register-form");
let submit = document.getElementById("btn-submit");

let validator = new Validator();

// event that triggers validations
submit.addEventListener('click', function(e) {

  e.preventDefault();

  validator.validate(form);

});