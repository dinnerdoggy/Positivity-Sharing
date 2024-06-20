import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://endorsement-database-7d395-default-rtdb.firebaseio.com/"
}

//variable declarations
const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementListInDB = ref(database, "endorsementList")

const inputFieldEl = document.getElementById("input-field")
const publishButtonEl = document.getElementById("publish-button")
const endorsementListEl = document.getElementById("endorsement-list")

//function declarations
function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function clearEndorsementListEl() {
    endorsementListEl.innerHTML = ""
}

function appendToEndorsementListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `endorsementList/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })
    
    endorsementListEl.append(newEl)
}

//
publishButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    
    push(endorsementListInDB, inputValue)
    
    clearInputFieldEl()
})

onValue(endorsementListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearEndorsementListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendToEndorsementListEl(currentItem)
        }    
    } else {
        endorsementListEl.innerHTML = "No items here... yet"
    }
})