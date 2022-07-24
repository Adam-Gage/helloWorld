// DOM Elements
var time = document.getElementById('time'), 
    greeting = document.getElementById('greeting'), 
    nameItem = document.getElementById('name'),
    focused = document.getElementById('focus'),
    focusList = document.getElementById('focusList'),
    currentStyle = document.getElementById('currentStyle'),
    values = document.getElementById('values'),
    submit = document.getElementById('submit'),
    reset = document.getElementById('reset'),
    remove = document.getElementsByClassName('removeJob');

//Show Time
function showTime() {
    var today = new Date(),
        hour = today.getHours(),
        min = today.getMinutes(),
        sec = today.getSeconds();

    // Set AM or PM
    var amPm = hour >= 12 ? 'PM': 'AM';

    // 12hr Format
    hour = hour % 12 || 12;
    min = addZero(min);
    sec = addZero(sec);

    // Output Time
    time.innerHTML = hour + ':' + min + ":" + sec + ' ' + amPm;

    setTimeout(showTime, 500);
}

//Add Zeros
function addZero(n) {
    if (n < 10) n = '0' + n;
    return n;
}

// Set Background and Greeting
function setBgGreet() {
    var today = new Date(),
        hour = today.getHours();
    if (hour < 12) {
        // Morning
        currentStyle.href = "styles/morningStyle.css";
        greeting.innerHTML = 'Good Morning';
    } else if (hour < 18) {
        // Afternoon
        currentStyle.href = "styles/afternoonStyle.css";
        greeting.innerHTML = 'Good Afternoon';
    } else {
        // Evening
        currentStyle.href = "styles/eveningStyle.css";

        greeting.innerHTML = 'Good Evening';
        document.body.style.color = 'White';
    }
};

// Get Name
function getName() {
    if (localStorage.getItem('name') == undefined) {
        nameItem.innerText = '[Enter Name]';
    } else {
        nameItem.innerText = localStorage.getItem('name');
    }
};

// Set Name
function setName() {
    if (localStorage.getItem("name") == "" || localStorage.getItem("name") == "[Enter Name]") {
        localStorage.setItem('name', "[Enter Name]");
    } else {
        updateName;
    };
    nameItem.innerText = localStorage.getItem("name");
};

function updateName(){
    localStorage.setItem("name", nameItem.innerText);
};

// Get Focus
function getFocus() {
    if (localStorage.getItem('jobs') == "") {
        focused.innerHTML = ['[Enter Focus]'];
    } else {
        focused.innerHTML = window.localStorage.getItem('focus');
    }
};

//addFocus
function addFocus(){
    if (localStorage.getItem("jobs") == null) localStorage.setItem("jobs", "");
    var currentJobs = localStorage.getItem("jobs").split(","); 
    if (focused.value != "") currentJobs.push(focused.value);
    localStorage.setItem("jobs", currentJobs);
};

// Set Focus
function setFocus() {
    var jobList = localStorage.getItem("jobs").split(",");
    focusList.innerHTML = jobList.map(writeList).join("");
};

// Write List
function writeList(item){
    return item + "<button class = 'removeJob' id='" + item.toString() + "'>X</button></br>";
};

function runText(elem, message) {
    elem.innerHTML = message;
};

function storArr(){
    localStorage.setItem("jobs", ["1", "2"])
}

function showValues() {
    var todo = localStorage.getItem("jobs").toString().split(",");
    values.innerHTML =  "Name: " + localStorage.getItem("name") + "</br>" + "Jobs: " + todo;
}

function removeFocus(button) {
    var button = button.id;
    var currentJobs = localStorage.getItem("jobs").split(",");
    currentJobs.splice(currentJobs.indexOf(button), 1);
    localStorage.setItem("jobs", currentJobs);
}

function clearList(){
    localStorage.clear();
};

//nameItem.addEventListener('keypress', setName);
//nameItem.addEventListener('blur', setName);
//focused.addEventListener('keypress', setFocus);
//focused.addEventListener('blur', setFocus);
submit.addEventListener('click', updateName);
submit.addEventListener('click', addFocus);
reset.addEventListener('click', clearList);
//remove.addEventListener('click', removeFocus(this));



// Run
showTime();
setBgGreet();
setName();
setFocus();
//runText(focusList, "Does this work?")
//stor();
////storArr();
showValues();