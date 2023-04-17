import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { getFirestore, doc, setDoc, updateDoc, getDoc, getDocs, serverTimestamp, collection } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js"

const firebaseConfig = {
    apiKey: "AIzaSyBx-MUjg0YjDIPSNg1Gl8Ba_etWZk_J3Og",
    authDomain: "treasure-hunt-3166e.firebaseapp.com",
    projectId: "treasure-hunt-3166e",
    storageBucket: "treasure-hunt-3166e.appspot.com",
    messagingSenderId: "1080057224915",
    appId: "1:1080057224915:web:35ab07280a0ca257dbfe26",
    measurementId: "G-VCZEJ28Q81",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider(app);
const db = getFirestore(app);
var uuid = "";


//for logging admin using email and password
const signIn = document.getElementById("signin-form");
signIn.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("signup-email").value; // Get the user's email
    var password = document.getElementById("signup-password").value; // Get the user's password
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            // alert('Admin logged in successfully.')
            const user = userCredential.user;
            loginPage.style.display = "none"; // Show the next div with the form
            // addUserIdToFirestore(user.uid);
            adminPage();
        })
        .catch((error) => {
            setError(true);
            console.log(error);
        });
});

// async function adminPage() {
//     const querySnapshot = await getDocs(collection(db, "users"));

//     querySnapshot.forEach((doc) => {
//         // doc.data() is never undefined for query doc snapshots
//         console.log(doc.id, " => ", doc.data());
//     });
// }


async function adminPage() {
    const querySnapshot = await getDocs(collection(db, "users"));

    const table = document.createElement("table");
    table.classList.add("user-table");

    // Create the table header
    const headerRow = document.createElement("tr");
    const idHeader = document.createElement("th");
    idHeader.textContent = "User ID";
    headerRow.appendChild(idHeader);
    const emailHeader = document.createElement("th");
    emailHeader.textContent = "First login";
    headerRow.appendChild(emailHeader);
    const levelHeader = document.createElement("th");
    levelHeader.textContent = "Level";
    headerRow.appendChild(levelHeader);
    table.appendChild(headerRow);

    // Loop through the documents and add the data to the table
    querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const row = document.createElement("tr");
        const idCell = document.createElement("td");
        idCell.textContent = doc.id;
        row.appendChild(idCell);
        const emailCell = document.createElement("td");
        emailCell.textContent = userData.createdAt;
        row.appendChild(emailCell);
        const levelCell = document.createElement("td");
        levelCell.textContent = userData.level;
        row.appendChild(levelCell);
        table.appendChild(row);
    });

    // Add the table to the page
    const container = document.getElementById("admin-container");
    container.innerHTML = "";
    container.appendChild(table);
}









// Add event listener to login button
// Define a function to handle login
function handleLogin() {
    signInWithRedirect(auth, provider);
}

// Listen for redirect result after login
getRedirectResult(auth).then((result) => {
    const user = result.user;
    if (user) {
        // User is signed in
        loginPage.style.display = "none"; // Show the next div with the form
        addUserIdToFirestore(user.uid);
    }
});


//loginEnd

async function addUserIdToFirestore(uid) {
    const userDocRef = doc(db, "users", uid);
    // alert('here')
    uuid = uid;
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
        // alert("new user login: " + uid);
        await setDoc(userDocRef, {
            uid: uid,
            // name: "working",
            level: 0,
            createdAt: serverTimestamp()
            // createdAt: Timestamp.GetCurrentTimestamp()
        });
        div1.style.display = "block"; // Show the next div with the form
    }
    else {
        const userData = userDoc.data();
        const currentLevel = userData.level;
        // alert("old user login: " + uid);
        // alert("current level: " + currentLevel);
        switch (currentLevel) {
            case 0:
                alert("Welcome Back!")
                div1.style.display = "block"; // Show the next div with the form
                break;
            case 1:
                div2.style.display = "block"; // Show the next div with the form
                break;
            case 2:
                div3.style.display = "block"; // Show the next div with the form
                break;
            case 3:
                div4.style.display = "block"; // Show the next div with the form
                break;
            case 4:
                div5.style.display = "block"; // Show the next div with the form
                break;
            case 5:
                div6.style.display = "block"; // Show the next div with the form
                break;
            default:
                console.error(`Unknown level: ${currentLevel}`);
        }
    }
}

const loginButton = document.getElementById('login');
  if (loginButton) {
        loginButton.addEventListener('click', handleLogin);
  }

async function updateVal(val) {
    alert('Correct Answer!!');
    const userDocRef = doc(db, "users", uuid);
    const userDoc = await getDoc(userDocRef);
    // alert('her2')
    if (userDoc.exists()) {
        if (val === 5) {
            await setDoc(userDocRef, {
                uid: uuid,
                level: val,
                createdAt: uuid.createdAt,
                finishedAt: serverTimestamp()
            });
            alert("Thank you for playing.")
        }
        else {
            await setDoc(userDocRef, {
                uid: uuid,
                // name: "ok working",
                level: val,
            });
        }
    }
}

// Get the first form element
var form1 = document.getElementById("form1");

// Add an event listener to the submit button
form1.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting
    var answer1 = document.getElementById("answer1").value; // Get the user's answer
    var fixedValue = "olympus"; // Set the fixed value
    if (answer1 === fixedValue) {
        var div2 = document.getElementById("div2");
        div1.style.display = "none"; // Show the next div with the form
        div2.style.display = "block"; // Show the next div with the form
        updateVal(1);
    }
    else {
        alert('Wrong Answer. Try Again! \n(Remember answer is in lowercase)');
    }
});

// Get the second form element
var form2 = document.getElementById("form2");

// Add an event listener to the submit button
form2.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting
    var answer2 = document.getElementById("answer2").value; // Get the user's answer
    var fixedValue = "michael collins"; // Set the fixed value
    if (answer2 === fixedValue) {
        var div3 = document.getElementById("div3");
        div2.style.display = "none"; // Show the next div with the form
        div3.style.display = "block"; // Show the next div with the form
        updateVal(2);
    }
    else {
        alert('Wrong Answer. Try Again! \n(Remember answer is in lowercase)');
    }
});
// Get the second form element
var form3 = document.getElementById("form3");

// Add an event listener to the submit button
form3.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting
    var answer3 = document.getElementById("answer3").value; // Get the user's answer
    var fixedValue1 = "buran"; // Set the fixed value
    var fixedValue2 = "soyuz"; // Set the fixed value
    if (answer3 === fixedValue1) {
        var div4 = document.getElementById("div4");
        div3.style.display = "none"; // Show the next div with the form
        div4.style.display = "block"; // Show the next div with the form
        updateVal(3);
    }
    else if (answer3 === fixedValue2) {
        alert('Oops! You guessed wrong. \nTry Again.')
    }
    else {
        alert('Wrong Answer. Try Again! \n(Remember answer is in lowercase)');
    }
});
// Get the second form element
var form4 = document.getElementById("form4");

// Add an event listener to the submit button
form4.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting
    var answer4 = document.getElementById("answer4").value; // Get the user's answer
    var fixedValue = "artemis"; // Set the fixed value
    if (answer4 === fixedValue) {
        var div5 = document.getElementById("div5");
        div4.style.display = "none"; // Show the next div with the form
        div5.style.display = "block"; // Show the next div with the form
        updateVal(4);
    }
    else {
        alert('Wrong Answer. Try Again! \n(Remember answer is in lowercase)');
    }
});
// Get the second form element
var form5 = document.getElementById("form5");

// Add an event listener to the submit button
form5.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting
    var answer5 = document.getElementById("answer5").value; // Get the user's answer
    var fixedValue1 = "messier 87"; // Set the fixed value
    var fixedValue2 = "black hole"; // Set the fixed value
    if (answer5 === fixedValue1) {
        alert('Wohoo! Congratulation!!\nYou are certified space geek.')
        var div6 = document.getElementById("div6");
        div5.style.display = "none"; // Show the next div with the form
        div6.style.display = "block"; // Show the next div with the form
        updateVal(5);
    }
    else if (answer5 === fixedValue2) {
        alert('Come on buddy, be more specific!!');
    }
    else {
        alert('Wrong Answer. Try Again! \n(Remember answer is in lowercase)');
    }
});
