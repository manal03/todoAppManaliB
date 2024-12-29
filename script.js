import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js';
import { getDatabase, ref, push, onValue, remove } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js';
const appSettings ={
    apiKey: "AIzaSyCUIegCKs_aNHB2c27QjEANNM0R1qTmka4",
    authDomain: "playground-951e0.firebaseapp.com",
    databaseURL: "https://playground-951e0-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
//const todoData = ref(database,"todo");
const inputField = document.getElementById('input-field');
const addBtn = document.getElementById('addBtn');
const shoppingList = document.getElementById('shopping-list');
const viewLoggedIn = document.getElementById('view-logged-in');
const viewLoggedOut = document.getElementById('view-logged-out');

const continueWithGoogle = document.getElementById('googleBtn');

continueWithGoogle.addEventListener('click',()=>{
    signInWithPopup(auth, provider)
        .then((result) =>{
            console.log('logged in with google')
        })
        .catch((error)=>{
            console.log(error.code)
        })
})

const logoutBtn = document.getElementById('logoutBtn')
logoutBtn.addEventListener('click',()=>{
    signOut(auth);
})
onAuthStateChanged(auth, function(user){
    if(user){
        viewLoggedIn.style.display = "block";
        viewLoggedOut.style.display = "none";
        fetchFromDB();
        console.log(auth.current.uid);

    }else{
        console.log('logged out')
        viewLoggedIn.style.display = "none";
        viewLoggedOut.style.display = "block";
    }

})
function fetchFromDB(){
    const todoData = ref(database, `users/${auth.currentUser.uid}/todo`)
    onValue(todoData, function(snapshot){
        if(snapshot.exists()){
        let todoArray = Object.entries(snapshot.val())
        shoppingList.innerHTML = ""; //makes sure we dont append unnecessary
        for(const data of todoArray){
        appendItemToList(data);
    }
        }else{
        shoppingList.innerHTML = 'Items do not exist....';
    }
})
}

function appendItemToList(data){
        let currentItemID = data[0];
        let currentItemValue = data[1];
        const liItem = document.createElement('li');
        liItem.textContent = currentItemValue;
        liItem.addEventListener('dblclick', ()=>{
            let exactLocationOfItemInDb = ref(database, `users/${auth.currentUser.uid}/todo/${currentItemID}`)
            remove(exactLocationOfItemInDb);
            shoppingList.removeChild(liItem);
        })
        shoppingList.appendChild(liItem);
        

}
addBtn.addEventListener('click', ()=>{
    if(inputField.value == ''){
        return;
    }
    const userListDb = ref(database, `users/${auth.currentUser.uid}/todo`);
    push(userListDb, inputField.value)
    console.log(displayText())
    clearText();
})



function clearText(){
    return inputField.value = "";
}

function displayText(){
    return`${inputField.value} has been added to the database`;

}


