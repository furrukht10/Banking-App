"use strict";

/***********************************************************************/
// BANKIST APP

/////////////////////////////////////////////////
// Data
const account1 = {
  owner: "James May",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Olivia Smith",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Stephen James",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Mary Jane",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

/***********************************************************************/
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/***********************************************************************/
// Functions

//Display the movements on the chart
/* Takes in the array of movements, and a boolean if the list will be sorted or not*/
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  //If sort = true, sort the movements
  //Sort from most recent - least recent when clicked
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  //Loop through the movemeents array with a counter
  movs.forEach(function (mov, i) {
    //If the movement > 0, it means a deposit, else withdrawal, and set that to type
    const type = mov > 0 ? "deposit" : "withdrawal";

    //Update the HTML markup
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}$</div>
      </div>
    `;

    //Insert the HTML
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

//Calculate and display the total account balance
// Use the reduce method to reduce array to a single value which will be the balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}$`; //Update the balance
};

//Calculate and display a summary of deposits and withdrawals
const calcDisplaySummary = function (acc) {
  /* For income, use the filter method to find any movements greater than 0 (deposits) 
  Chain the reduce method and join all the deposits into a single value*/
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}$`;

  /* For withdrawals, use the filter method to find any movements less than 0 (withdrawals) 
  Chain the reduce method and join all the withdrawals into a single value*/
  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}$`;

  /* For interest, use the filter method to find any movements greater than 0 (deposits) 
  Chain the map method to apply the interest rates to all deposits (make sure > 1) and chain
  the reduce method to sum it all into a single value */
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}$`;
};

//Create the login information
/* Go through each account owner and make a username of the first letter of their first and last name*/
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    // Create new object property called username on each account
    acc.username = acc.owner
      .toLowerCase() //Convert to lowercase
      .split(" ") // Split by space ("Furrukh[" "]Tanveer")
      .map((name) => name[0]) //Get only the first characters of the two array elements(first and last name)
      .join(""); //join them together as a string
  });
};
createUsernames(accounts);

// Method to update the UI
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  //Timer function
  const tick = function () {
    //Calculate Minute
    const min = String(Math.trunc(time / 60)).padStart(2, 0); //Add some padding to string of length 2
    //Calculate seconds
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }

    // Decrease 1s
    time--;
  };

  // Set time to 5 minutes
  let time = 300;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

/***********************************************************************/
// Event handlers
let currentAccount;
let timer;

// Handle Login
btnLogin.addEventListener("click", function (e) {
  // Prevent form from submitting
  e.preventDefault();

  //Search through the account object's usernames to see if the inputted value matches
  //If so, assign that account to currentAccount
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  //Search through the account object's pins to see if the inputted value matches
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100; //Showcase the UI

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI with the specified account
    updateUI(currentAccount);
  }
});

// Handle Transfer
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  //Get the amount user would like to transfer (from form)
  const amount = Number(inputTransferAmount.value);
  //Get the account the user would like to transfer to (first check if it exists using find method)
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  //Clear input fields
  inputTransferAmount.value = inputTransferTo.value = "";

  //Check data
  /* Check if the inputted amount > 0, the reciever account exits, current balance is greater than amount
  and the reciever account username does not equal to the current username (prevent sending to yourself) */
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    /* Add a negative movement to the movements array (withdrawal) */
    currentAccount.movements.push(-amount);
    /* Add a positive movement to the reciever account's movement array*/
    receiverAcc.movements.push(amount);

    // Update UI with the current account
    updateUI(currentAccount);
  }
});

//Handle Loan
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  //Get the loan amount user would like to request
  const amount = Number(inputLoanAmount.value);

  //Check if the amount is greater than 0 and greater than 0.1 of one of the accounts movements
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    // Add the movement to current accounts movements
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = "";
});

//Handle close
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  //Check if the account input is valid
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    //Find the index of that current user
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    // Delete account (remove the account at that index)
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;

    labelWelcome.textContent = `Log in to get started`;
  }
  //Empty fields
  inputCloseUsername.value = inputClosePin.value = "";
});

//Handle sort (initally to false)
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  // Set to not sorted (sorted = true)
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
