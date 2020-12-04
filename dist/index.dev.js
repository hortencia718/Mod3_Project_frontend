"use strict";

// Stable Element
// _______________________________________________________________________
var flavorList = document.querySelector('div.flavorList');
var mainImage = document.querySelector('div.imageDisplay');
var menuNarBar = document.querySelector('div.menuNarBar');
var selectedOption = document.querySelector('div.selected_options');
var toppingDD = document.querySelector('select#toppingDropDown');
var milkDD = document.querySelector('select#milkDropDown');
var scoopDD = document.querySelector('select#scoopDropDown');
var selectedTopping = document.querySelector('p#selectedTopping');
var selectedMilk = document.querySelector('p#selectedMilk');
var selectedScoop = document.querySelector('p#selectedScoop');
var selectedPrice = document.querySelector('p#totalPrice');
var purchaseButton = document.querySelector('button#purchaseButton');
var reviewBox = document.querySelector('div#reviews');
var reviewUL = document.querySelector('ul#reviewUL');
var foundToppingPrice = 0;
var priceHolder = 0; // fetch request
// _______________________________________________________________________

fetch('http://localhost:3000/milks').then(function (r) {
  return r.json();
}).then(function (objArr) {
  objArr.forEach(function (objMilk) {
    addMilkOption(objMilk);
  });
});
fetch('http://localhost:3000/toppings').then(function (r) {
  return r.json();
}).then(function (objArr) {
  objArr.forEach(function (objTopping) {
    addToppingOption(objTopping); // options(objTopping)
  });
});
fetch('http://localhost:3000/flavors').then(function (r) {
  return r.json();
}).then(function (objArr) {
  objArr.forEach(function (objFlavor) {
    turnintoList(objFlavor);
  });
}); // 
// _______________________________________________________________________

function turnintoList(objFlavor) {
  var listUL = document.createElement('ul');
  var listLI = document.createElement('li');
  var imageFl = document.createElement('img');
  flavorList.append(listUL);
  listUL.append(listLI);
  listLI.innerText = objFlavor.name;
  changeToPointer(listLI);
  listLI.addEventListener("click", function (evt) {
    mainImage.innerText = "";
    mainImage.append(imageFl);
    imageFl.src = objFlavor.image;
    reviewUL.innerText = "";
    objFlavor.reviews.forEach(function (reviewObj) {
      var reviewLI = document.createElement('li');
      reviewLI.innerText = reviewObj.review;
      reviewUL.append(reviewLI);
    });
  });
} // ice cream options
// _______________________________________________________________________


function options() {
  var top = 0;
  var mi = 0;
  var sco = 0;
  var total = top + mi + sco;
  toppingDD.addEventListener("change", function (evt) {
    currentInput = evt.target.value;
    selectedTopping.innerText = "Selected Topping: ".concat(currentInput); // if (objTopping.name === currentInput) {
    //     return top = objTopping.price
    // }
  });
  milkDD.addEventListener("change", function (evt) {
    currentInput = evt.target.value;
    selectedMilk.innerText = "Selected Milk: ".concat(currentInput);
  });
  scoopDD.addEventListener("change", function (evt) {
    currentInput = evt.target.value;
    selectedScoop.innerText = "Selected Scoop: ".concat(currentInput);
  });
}

options();

function addToppingOption(objTopping) {
  var optionsTop = document.createElement('option');
  optionsTop.value = objTopping.name;
  optionsTop.innerText = objTopping.name;
  toppingDD.append(optionsTop);
}

function addMilkOption(objMilk) {
  var optionsMilk = document.createElement('option');
  optionsMilk.value = objMilk.name;
  optionsMilk.innerText = objMilk.name;
  milkDD.append(optionsMilk);
} // extra
// _______________________________________________________________________=


function changeToPointer(li) {
  li.addEventListener("mouseover", function (evt) {
    li.style.cursor = "pointer";
  });
}