/* Banking app JS by Boban Jankovic */

// Testing accounts on load
window.addEventListener('load', checkLocalStorage);
window.addEventListener('load', allAccounts);

// DOM selection
var main = document.getElementsByTagName('main')[0];
var navButtons = document.getElementsByClassName('navbtn');
var subtitle = document.getElementsByTagName('h2')[0];
subtitle.innerHTML = 'All accounts';

// Other variables
var accounts = [];

// Event listeners
for (var i = 0; i < navButtons.length; i++) {
  navButtons[i].addEventListener('click', createPage);
}

// Functions
function checkLocalStorage() {
  if (!localStorage['Accounts']) {
    localStorage.setItem('Accounts', JSON.stringify(accounts));
  } else {
    accounts = JSON.parse(localStorage.getItem('Accounts'));
  }
}

function createPage(e) {
  var targetValue = e.target.getAttribute('value');
  subtitle.innerHTML = targetValue;
  if (e.target === navButtons[1]) {
    addAccount();
  } else if (e.target === navButtons[0]) {
    allAccounts();
  } else {
    editAccounts();
  }
}

function allAccounts() {
  var mainInner =
    `<table class="table table-hover">
      <thead>
        <tr>
          <th>Id</th>
          <th>First name</th>
          <th>Last name</th>
          <th>Deposit</th>
          <th>Credit card</th>
        </tr>
      </thead>
      <tbody>`;

  for (var i = 0; i < accounts.length; i++) {
    mainInner +=
      `
        <tr>
          <th>${accounts[i].id}</th>
          <td>${accounts[i].firstname}</td>
          <td>${accounts[i].lastname}</td>
          <td>${accounts[i].deposit}</td>
          <td>${accounts[i].creditcard}</td>
        </tr>
    `;
  }

  mainInner += `</tbody></table>`;
  main.innerHTML = mainInner;
}

function addAccount() {
  var mainInner =
    `
  <input id="first-name" type="text" class="form-control" placeholder="First name"><br>
  <input id="last-name" type="text" class="form-control" placeholder="Last name"><br>
  <input id="deposit" type="number" class="form-control" placeholder="Deposit"><br>
  <select id="credit-card" class="form-control">
    <option value="" disabled selected>Please choose a credit card</option>
    <option value="Visa">Visa</option>
    <option value="MasterCard">MasterCard</option>
    <option value="Dina">Dina</option>
  </select><br>
  <input type="submit" class="form-control btn btn-info" value="Submit new account">
  `;
  main.innerHTML = mainInner;
  selectSubmit(newAccount);
}

function editAccounts() {
  var mainInner =
    `<table class="table table-hover">
        <thead>
          <tr>
            <th>Id</th>
            <th>First name</th>
            <th>Last name</th>
            <th>Deposit</th>
            <th>Credit card</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>`;

  for (var i = 0; i < accounts.length; i++) {
    mainInner +=
      `
          <tr id="${accounts[i].id}">
            <th>${accounts[i].id}</th>
            <td>${accounts[i].firstname}</td>
            <td>${accounts[i].lastname}</td>
            <td>${accounts[i].deposit}</td>
            <td>${accounts[i].creditcard}</td>
            <td><input type="button" class="btn btn-info edit btn-xs" value="Edit"></td>
            <td><input type="button" class="btn btn-danger delete btn-xs" value="Delete"></td>
          </tr>
      `;
  }

  mainInner += `</tbody></table>`;
  main.innerHTML = mainInner;
  selectButtons();
}

function selectSubmit(choice) {
  var submitButton = document.querySelector('input[type=submit]');
  submitButton.addEventListener('click', choice);
}

function selectButtons() {
  var editButtons = document.getElementsByClassName('edit');
  var deleteButtons = document.getElementsByClassName('delete');

  for (var i = 0; i < editButtons.length; i++) {
    editButtons[i].addEventListener('click', accountEdit);
    deleteButtons[i].addEventListener('click', accountDelete);
  }
}

function accountEdit(e) {
  var x = e.target.parentNode;
  var id = parseInt(x.parentNode.id);

  for (var i = 0; i < accounts.length; i++) {
    if (accounts[i].id === id) {
      var mainInner =
        `
      <input id="unique-id" type="number" class="form-control" value="${accounts[i].id}" disabled><br>
      <input id="first-name" type="text" class="form-control" value="${accounts[i].firstname}"><br>
      <input id="last-name" type="text" class="form-control" value="${accounts[i].lastname}"><br>
      <input id="deposit" type="number" class="form-control" value="${accounts[i].deposit}"><br>
      <select id="credit-card" class="form-control">
        <option value="Visa">Visa</option>
        <option value="MasterCard">MasterCard</option>
        <option value="Dina">Dina</option>
      </select><br>
      <input type="submit" class="form-control btn btn-info" value="Update account">
      `;
      main.innerHTML = mainInner;
      var options = document.getElementsByTagName('option');

      for (var j = 0; j < options.length; j++) {
        if (options[j].value === accounts[i].creditcard) {
          options[j].setAttribute('selected', 'selected');
        }
      }
    }
  }
  selectSubmit(updateAccount);
}

function updateAccount() {
  var uniqueId = document.getElementById('unique-id').value;
  var parsedId = parseInt(uniqueId);
  var firstName = document.getElementById('first-name').value;
  var lastName = document.getElementById('last-name').value;
  var deposit = parseInt(document.getElementById('deposit').value);
  var creditCard = document.getElementById('credit-card').value;

  var updatedAccount = {
    id: parsedId,
    firstname: firstName,
    lastname: lastName,
    deposit: deposit,
    creditcard: creditCard
  };

  for (var i = 0; i < accounts.length; i++) {
    if (accounts[i].id === updatedAccount.id) {
      accounts[i] = updatedAccount;
    }
  }

  updateLocalStorage(accounts);
  allAccounts();
}

function accountDelete(e) {
  var x = e.target.parentNode;
  var id = parseInt(x.parentNode.id);

  for (var i = 0; i < accounts.length; i++) {
    if (accounts[i].id === id) {
      accounts.splice(i, 1);
      updateLocalStorage(accounts);
      editAccounts();
    }
  }
}

function randomId() {
  var random = Math.floor(Math.random() * (999 - 100) + 100);
  if (accounts.length === 0) {
    return random;
  } else {
    for (var i = 0; i < accounts.length; i++) {
      if (random === accounts[i].id) {
        randomId();
      } else {
        return random;
      }
    }
  }
}

function newAccount() {
  var id = randomId();
  var firstName = document.getElementById('first-name').value;
  var lastName = document.getElementById('last-name').value;
  var deposit = parseInt(document.getElementById('deposit').value);
  var creditCard = document.getElementById('credit-card').value;

  var newAccount = {
    id: id,
    firstname: firstName,
    lastname: lastName,
    deposit: deposit,
    creditcard: creditCard
  };

  accounts.push(newAccount);
  updateLocalStorage(accounts);
  allAccounts();
}

function updateLocalStorage(data) {
  localStorage['Accounts'] = JSON.stringify(data);
}

console.log(
  `
  ************************
    Thanks for your visit :)
      Boban Jankovic
      ************************
  `
);
