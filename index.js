// Stable Element
// _______________________________________________________________________
let displayPrice = document.querySelector('div#displayPrice')
let flavorList = document.querySelector('div.flavorList')
let mainImage = document.querySelector('div.imageDisplay')
let menuNarBar = document.querySelector('div.menuNarBar')
let selectedOption = document.querySelector('div.selected_options')
let toppingDD = document.querySelector('select#toppingDropDown')
let milkDD = document.querySelector('select#milkDropDown')
let scoopDD = document.querySelector('select#scoopDropDown')

let selectedTopping = document.querySelector('p#selectedTopping')
let selectedMilk = document.querySelector('p#selectedMilk')
let selectedScoop = document.querySelector('p#selectedScoop')
let selectedPrice = document.querySelector('p#totalPrice')

let seeTotalButton = document.querySelector('button#addButton')
let purchaseButton = document.querySelector('button#purchaseButton')
let reviewBox = document.querySelector('div#reviews')
let reviewUL = document.querySelector('ul#reviewUL')
let submitReviewButton = document.querySelector('button#submitReviewButton')
let reviewContent = document.querySelector('textarea#reviewContent')
let formReview = document.querySelector('div#form-review')


let foundToppingObj 
let foundMilkObj 
let foundScoopObj 
let foundFlavorObj

let foundUserObj = 1

let mainBody = document.querySelector('div.main-body')


// fetch request
// _______________________________________________________________________

fetch('http://localhost:3000/scoops')
.then(r => r.json())
.then(objArr => {
    objArr.forEach(objScoop => {
        addScoopOption(objScoop)
    })
});

fetch('http://localhost:3000/milks')
.then(r => r.json())
.then(objArr => {
    objArr.forEach(objMilk => {
        addMilkOption(objMilk)
    })
});

fetch('http://localhost:3000/toppings')
.then(r => r.json())
.then(objArr => {
    objArr.forEach(objTopping => {
        addToppingOption(objTopping)
    })
});


fetch('http://localhost:3000/flavors')
.then(r => r.json())
.then(objArr => {
    objArr.forEach(objFlavor => {
        turnintoList(objFlavor)
    })
});

// 
// _______________________________________________________________________

// menuNarBar.style.display = "none"

function turnintoList(objFlavor) {
    let listUL = document.createElement('ul')
    let listLI = document.createElement('li')
    let imageFl = document.createElement('img')
    flavorList.append(listUL)
    listUL.append(listLI)
    listLI.innerText = objFlavor.name

    let heart = document.createElement('span')
    heart.innerText = objFlavor.like ? "♥" :  "♡"
    listUL.append(heart)
    
    changeToPointer(listLI)
    listLI.addEventListener("click", (evt)=>{
        // menuNarBar.style.display = "block"
        foundFlavorObj = objFlavor

        mainImage.innerText = ""
        mainImage.append(imageFl)
        imageFl.src = objFlavor.image
        
        formReview.innerText = ""
        createReviewForm(objFlavor)

        reviewUL.innerText = ""
        objFlavor.reviews.forEach(reviewObj => {
            addingReviewObjtoHTML(reviewObj)
        })     

        displayTotal()

    })

    changeToPointer(heart)
    heart.addEventListener("click", (evt)=>{
        heartTurnOnOff(objFlavor, heart)
    })

}


// heart like methods 
// _______________________________________________________________________
let heartTurnOnOff = (objFlavor, heart) =>{
    let redheart = !objFlavor.like
    fetch(`http://localhost:3000/flavors/${objFlavor.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            like: redheart
        })  
    })
    .then(r => r.json())
    .then(objFlavorUpdate => {
        objFlavor.like = objFlavorUpdate.like
        heart.innerText = objFlavorUpdate.like ? "♥" :  "♡"
    })

}


// let purchaseNow = () => {
//     purchaseButton.addEventListener("click", (evt)=>{
//         console.log("asdasdadasa")
//     })
// }


// review helper methods 
// _______________________________________________________________________
let addingReviewObjtoHTML = (reviewObj) => {
        let reviewLI = document.createElement('li')
            reviewLI.innerText = reviewObj.review
        let reviewDeleteButton = document.createElement('button')
            reviewDeleteButton.innerText = "Remove Review"
        reviewLI.append(reviewDeleteButton)
        reviewUL.prepend(reviewLI)

        deleteAReview(reviewDeleteButton, reviewObj, reviewLI)   
    }


let deleteAReview = (reviewDeleteButton, reviewObj, reviewLI) =>{
    reviewDeleteButton.addEventListener("click", (evt)=>{
        fetch(`http://localhost:3000/reviews/${reviewObj.id}`, {
            method: "DELETE"
        })
        .then(r => r.json())
        .then(response => {
            //update the frontend
           reviewLI.remove()
        })
    })
}


let createReviewForm = (objFlavor) =>{
    let formLabel = document.createElement('label')
        formLabel.innerText = "Create a Review"
        formLabel.id = "reviewHeader"
    let formTextArea = document.createElement('textarea')
        formTextArea.id = "reviewContent"
        formTextArea.type = "text"
        formTextArea.placeholder = "Please First, Select a FLAVOR, a TOPPING, a MILK base, and the Number of SCOOPS"
        formTextArea.rows = "5"
        formTextArea.cols = "40"
    let formButton = document.createElement('button')
        formButton.type = "submit"
        formButton.id = "submitReviewButton"
        formButton.innerText = "Submit Review"
    formReview.append(formLabel,formTextArea,formButton)    

    submitAReview(formButton, formTextArea, objFlavor)
}

let submitAReview = (formButton, formTextArea, objFlavor) => {
    formButton.addEventListener("click", (evt)=>{
        evt.preventDefault()

        let content = formTextArea.value
        fetch('http://localhost:3000/reviews', {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                //need to create userObj 
                user_id: foundUserObj,
                flavor_id: foundFlavorObj.id,
                topping_id: foundToppingObj.id,
                milk_id: foundMilkObj.id,
                scoop_id: foundScoopObj.id,
                review: content
            })
        })
        .then(r => r.json())
        .then(createReviewObj => {
            //update the frontend
            addingReviewObjtoHTML(createReviewObj)
            //Update Inner Memory
            objFlavor.reviews.push(createReviewObj)

            formReview.innerText = ""
            createReviewForm(objFlavor)
        })

    })
}


// ice cream options
// _______________________________________________________________________
function options(){  
    
    toppingDD.addEventListener("change", (evt)=>{
        currentInput = evt.target.value
        selectedTopping.innerText = `Selected Topping: ${currentInput}`
        fetch('http://localhost:3000/toppings')
        .then(r => r.json())
        .then(objArr => {
            let found = objArr.find(ele => {
                return ele.name === currentInput
            }) 
            foundToppingObj = found
            displayTotal()
        })
    })

    milkDD.addEventListener("change", (evt)=>{
        currentInput = evt.target.value
        selectedMilk.innerText = `Selected Milk: ${currentInput}`

        fetch('http://localhost:3000/milks')
        .then(r => r.json())
        .then(objArr => {
            let found = objArr.find(ele => {
                return ele.name === currentInput
            }) 
            foundMilkObj = found
            displayTotal()
        })
    })

    scoopDD.addEventListener("change", (evt)=>{
        currentInput = evt.target.value
        selectedScoop.innerText = `Selected Scoop: ${currentInput}`

        fetch('http://localhost:3000/scoops')
        .then(r => r.json())
        .then(objArr => {
            let found = objArr.find(ele => {
                return ele.number === Number(currentInput)
            }) 
            foundScoopObj = found
            displayTotal()
        })
    })

    displayTotal()

}


options()



// ice cream options display
// _______________________________________________________________________

function addToppingOption (objTopping) {
    let optionsTop = document.createElement('option')
        optionsTop.value = objTopping.name
        optionsTop.innerText = `$${objTopping.price} - ${objTopping.name}`
    toppingDD.append(optionsTop)
}



function addMilkOption (objMilk) {
    let optionsMilk = document.createElement('option')
        optionsMilk.value = objMilk.name
        optionsMilk.innerText = `$${objMilk.price} - ${objMilk.name}`
    milkDD.append(optionsMilk)
}

function addScoopOption (objScoop) {
    let optionsScoop = document.createElement('option')
        optionsScoop.value = objScoop.number
        optionsScoop.innerText = `$${objScoop.price} - ${objScoop.number}`
    scoopDD.append(optionsScoop)
}

function displayTotal(){
    // seeTotalButton.addEventListener("click", (evt)=>{   
        displayPrice.innerText = ''
        let priceH2 = document.createElement('h2')
            priceH2.innerText = `Total Price: $${foundToppingObj.price +foundMilkObj.price + foundScoopObj.price + foundFlavorObj.price}`
        displayPrice.append(priceH2)

        purchaseNow()
    // })
}

function purchaseNow(){
    purchaseButton.addEventListener("click", (evt)=>{ 
        fetch('http://localhost:3000/purchased_logs', {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                //need to create userObj 
                user_id: foundUserObj,
                flavor_id: foundFlavorObj.id,
                topping_id: foundToppingObj.id,
                milk_id: foundMilkObj.id,
                scoop_id: foundScoopObj.id,
                price: foundToppingObj.price +foundMilkObj.price + foundScoopObj.price + foundFlavorObj.price
            })
        })
        .then(r => r.json())
        .then(createPurchasedObj => {
            mainBody.innerText = ""
            let thankYouH1 = document.createElement('h1')
                thankYouH1.id = "thankyou"
                thankYouH1.innerText = `Thank You For Your Purchase!!! See You Again. 
                Flavor: ${foundFlavorObj.name}
                Topping: ${foundToppingObj.name} 
                Milk Base: ${foundMilkObj.name}  
                # of Scoops: ${foundScoopObj.number}
                Total Price: $${foundToppingObj.price + foundMilkObj.price + foundScoopObj.price + foundFlavorObj.price}` 
            mainBody.append(thankYouH1)
        })
    })
}

// extra
// _______________________________________________________________________=

function changeToPointer(li){
    li.addEventListener("mouseover", (evt)=>{
        li.style.cursor = "pointer"
    })
}






// let topDD = document.querySelector('div#topDDButton')

// function addToppingOption (objTopping) {
//     let aTop = document.createElement('a')
//         aTop.classList.add("dropdown-item", "topping-dropdown-item")
//         aTop.innerText = objTopping.name
//     topDD.append(aTop)

//     aTop.addEventListener("click", (evt)=>{
//         foundToppingObj = objTopping
//         selectedTopping.innerText = `Selected Topping: ${objTopping.name}`
//     })
// }