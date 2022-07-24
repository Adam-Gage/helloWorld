function job(item, no){
    if (item !== "" || item != undefined) {
        document.getElementById("focusList").innerHTML = 
            "<p class='todo' id='" + no + "'>" + item + "</p>" 
        +   "<input type='checkbox' class='removeBtn' id='remove" + no + "'>X</button>"
        +   "<button class='removeBtn' id='remove" + no + "'>X</button>";
    };
};

// Show jobs
function showJoblist() {
    var list = localStorage.getItem("jobs").split(",");
    for (var i=0; i<list.length; i++) {
        job(list[i], i+1)
    };
};

// Add Job
function addFocus(){
    var currentJobs = localStorage.getItem("jobs").split(","); 
    if (focused.value != "") currentJobs.push(focused.value);
    localStorage.setItem("jobs", currentJobs);
};

// To do list objects
function todoItem(item){
    var idxNo = localStorage.getItem("jobs").split(",").indexOf(item);
    var todo = document.createElement("P");
    todo.class = "todoItem";
    todo.id = idxNo;
    var tick = document.createElement("BUTTON");
    tick.class = "tick";
    var cross = document.createElement("BUTTON");
    cross.class = "cross";

    
    document.getElementById(idxNo).appendChild(tick);
    document.getElementById(idxNo).appendChild(cross);
}