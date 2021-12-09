// saving the instance of add button html element
let addbtn = document.querySelector(".add-btn");
// saving the instance of add button html element
let rembtn = document.querySelector(".remove-btn");
// saving the instance of modal container
let modalcont = document.querySelector(".modal-cont");
// saving the instance of main container
let maincont = document.querySelector(".main-cont");
// saving the instance of add text area
let textareacont = document.querySelector(".textarea-cont")
// saving the instance of all the color elements through which priority will be assigned
let allprioritycolors = document.querySelectorAll(".priority-color");
// saving the instance of all color elements in our header container
let toolboxcolors = document.querySelectorAll(".color");


// we will store our four colors in an array as it will be required rapidly in further code
let colors = [ "lightpink","lightblue","lightgreen","black"];
// by default we will set priority to our black color
let modalprioritycolor = colors[colors.length-1];

// we will toggle with our add and remove button therefore 
// initially we have put false in both of them
let addflag = false;
let remflag = false;

// To manipulate the ui by show lock and unlock option we have kept these classes
let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";

// we will store all our tickets in an array
let ticketarr = [];

// we have created a localstorage which is provided through our browser
// it is named as jira_tickets
// so, first we are checking are there any tickets already stored in the localstorage
// if yes then we have to display them
if(localStorage.getItem("jira_tickets")){
    // retrieve and display tickets
    // we have saved the data of our tickets in json format
    // therefore when we will retrieve our data we will parse it
    // and put it in our tickets array
    ticketarr = JSON.parse(localStorage.getItem("jira_tickets"));
    // Now iterating through every ticlet we will display them one by one
    // we have a separate function for doing this task it takes three arguments
    // color,content and unique ticket id
    ticketarr.forEach((ticketobj) => {
        createTicket(ticketobj.ticketcolor,ticketobj.ticketask,ticketobj.ticketid);
    })
}

// we will manage the event when user will click on the colors present in header
// for this we will iterate through every color element and add a click listener
// there are two kinds of events we are trying to handle
// one is of single click on the color and second is of
// double click on the color, when user will perform single click then we have to filter
// ṭhe tickets with that particular color, whereas when user will double click on any of 
// the color then we will display all the tickets
for(let i=0;i<toolboxcolors.length;i++){
    // single click event
    // we have written the class names such that their text can be used
    // therefore whenever user will perform single click on any of the color
    // then we will fetch the color name through first attribute of its class
    // we have a method called classlist it will bring all the classes of html element
    // first class defines color therefore we will fetch it, and then we will filter the tickets
    // we will check in our tickets array which contains all the tickets if any of the ticket there
    // contains the same color then we will store it in another filtered ticket array
    // after acquiring all the tickets associated with the clicked color first we will remove all the 
    // tickets from the view that can be done through html selector, we will save its instance and then
    // iterate over it and one by one simply remove it and removal now we will iterate through our filtered 
    // tickets array and now we will display them with the help of our create ticket function
    toolboxcolors[i].addEventListener("click",(e) => {
        let currenttoolboxcolor = toolboxcolors[i].classList[0];
        let filteredtickets = ticketarr.filter((ticketobj,idx) => {
            return currenttoolboxcolor===ticketobj.ticketcolor;
        })
        //remove previous tickets
        let allticketcont = document.querySelectorAll(".ticket-cont");
        for(let i=0;i<allticketcont.length;i++){
            allticketcont[i].remove();
        }
        //display filtered tickets
        filteredtickets.forEach((ticketobj,idx) => {
            createTicket(ticketobj.ticketcolor,ticketobj.ticketask,ticketobj.ticketid);
        })
    })
    // double click event
    // here we will use simply logic simply we remove all the tickets from the view and 
    // by iterating through each tickets stored in tickets array we will display them one by one with
    // the help of the same create ticket function
    toolboxcolors[i].addEventListener("dblclick",(e) => {
        let allticketcont = document.querySelectorAll(".ticket-cont");
        for(let i=0;i<allticketcont.length;i++){
            allticketcont[i].remove();
        }
        ticketarr.forEach((ticketobj,idx) => {
            createTicket(ticketobj.ticketcolor,ticketobj.ticketask,ticketobj.ticketid);
        })
    })
}

// listener for modal colouring (priority)
// we have basically four priority color we have to chnage the priority
// whenever user will click on them, for this we will iterate through all priority
// color elements and add a click listener on them, whenever any one of them is clicked
// we will change the priority by manipulating the border style of the color box
// first we will remove border from all the colors and then we will add border to that element
// only which is clicked
allprioritycolors.forEach((colorElem,idx) =>{
    colorElem.addEventListener("click",(e) => {
        allprioritycolors.forEach((prioritycolorElem,idx) => {
            prioritycolorElem.classList.remove("border");
        })
        colorElem.classList.add("border");
        modalprioritycolor = colorElem.classList[0];
    })
})

// Add button event listener
// whenever user will click add button then we have to display our modal
// where user can write the text and assign priority, we will toggle our
// add flag if it is true then we will make it false it is showing that
// initially our modal was there in the view now we have to remove it or vice versa
// it is very simply we will simply manipulate the style of our modal conatiner
// on the basis of add flag status if our flag is true then we will simply chnage the
// display property to flex or else we will change it to none
addbtn.addEventListener("click",(e) => {
    
    // if addflag true then modal will be displayed or vice versa
    addflag = !addflag;
    // alert(addflag)
    if(addflag){
        modalcont.style.display = "flex";
    }else{
        modalcont.style.display = "none";
    }
})

// Remove button event listener
// whenever user will click on remove button we will simple toggle our remove flag
rembtn.addEventListener("click",(e) => {
    remflag = !remflag;
})

// It is the listener when your want to save the ticket, whenever user press shift
// key then our ticket should be saved, we have a listener for doing thi operation called 
// key down event and in call back function we will simply check the whether shift key is 
// pressed or not if pressed then we will create the ticket with our create ticket function
// and when ticket is created and displayed in the view then we have to set the state of our 
// modal to default we have separate function for that which will set our modal to default  
modalcont.addEventListener("keydown",(e) => {
    //shift
    let key = e.key;
    if(key === "Shift"){
        createTicket(modalprioritycolor,textareacont.value);
        addflag = false;
        setmodaltodefault();
    }
})

// This is the function which when called will create the ticket and display it
// we have used node api to generate the unique id we have added that api in script tag
// in our index html file, three arguments are being passed in the function color,content
// and id if id is not provided that we will generate it with our api function shortid()
// for ticket creation task we have create element function through which we will create one div
// element and add an attribute class name as ticket container and finally we have to mention the html
// of this container for this we have method called innerhtml through which we can mention small html code
// we will write the inner html and will use our color, id and content to fill the area
// and when our ticket container is ready we will simply append it in our main container
// till this part we have made change to the ui but we also have to update the database for that
// we will check if our ticket id is not null then we will push our ticket in ticket array
// and finally we will save our array in our local storage but we have to convert the content into string for
// this we will use JSON stringify method and save our data
// After creation we have to handle its removal, lock and unlock status and color as well
// we have created separate function to hanle those events
function createTicket(ticketcolor,ticketask,ticketid){
    let id = ticketid || shortid();
    let ticketcont = document.createElement("div");
    ticketcont.setAttribute("class","ticket-cont");
    ticketcont.innerHTML = `
            <div class="ticket-color ${ticketcolor}"></div>
            <div class="ticket-id">#${id}</div>
            <div class="task-area">${ticketask}</div>
            <div class="ticket-lock"><i class="fas fa-lock"></i></div>
    `
    maincont.appendChild(ticketcont);
    //create and add to array
    if(!ticketid){
        ticketarr.push({ticketcolor,ticketask,ticketid: id});
        localStorage.setItem("jira_tickets",JSON.stringify(ticketarr));
    }
    handleRemoval(ticketcont);
    handleLock(ticketcont,id);
    handleColor(ticketcont,id);
}

// In this function we will handle the lock and unlock event, if user has to manipulate the
// data of the ticket then first lock has to be removed or vice versa
// we will first fetch both our lock element and our text area, and 
// we will add click event listener to our lock-unclock element, to ensure whidh ticket's lock 
// has been clicked we have passed id as well, we will get the ticket index with the help of unique id
// if our ticket initially conataining the lock class then we will change it to unlock class
// and make our text area editable by manipulating html property as contenteditable true
// or else we will change unlock class to lock class and make our text area un editable
// now we have to make change in the data base as well therefore we will extract the text of the text area
// and update our ticket with the text 
function handleLock(ticket,id){
    let lockElem = ticket.querySelector(".ticket-lock");
    let ticketLock = lockElem.children[0];
    let tickettaskarea = ticket.querySelector(".task-area");
    ticketLock.addEventListener("click", (e) => {
        let ticketidx = getticketidx(id);
        if(ticketLock.classList.contains(lockClass)){
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClass);
            tickettaskarea.setAttribute("contenteditable","true");
        }else{
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass);
            tickettaskarea.setAttribute("contenteditable","false");
        }
        // modify data in local storage
        ticketarr[ticketidx].ticketask = tickettaskarea.innerText;
        localStorage.setItem("jira_tickets",JSON.stringify(ticketarr));
    })
}

// In this function we have managed removal operation, we will add click listener on the
// ticket and check out removal flag if it is false then we will do nothing and simply return
// or else we will get the index of the ticket with the help of id and with the help of splice 
// function we will remove that ticket and update our data base as well and finally we will remove
// the ticket from the ui as well
function handleRemoval(ticket,id){
    // if remove flag is true
    ticket.addEventListener("click",(e) => {
        if(!remflag) return;
        // db removal
        let idx =  getticketidx(id);
        ticketarr.splice(idx,1); // from 1 element start from idx
        let stringticketsarr = JSON.stringify(ticketarr);
        localStorage.setItem("jira_tickets",stringticketsarr);
        // ui removal
        ticket.remove();
    })
}

// In this function color event is handled if user want to change the priority of the ticket
// then this can be done by changing the color of the tickets header, if user click the header then will
// change the color in a cyclic manner, whenever user will click on ticket header we will fetch its current color
// index by comparing it with our colors array, and simply increment the current color index and we will implement 
// cyclic behaviour with the help of modulo operation, after that we will acquire our new color from colors array
// then we will remove the current color and the nadd our new color class in class list of ticket color, now once ui
// has changed then we have to update database as well for this with the help of index we will change the ticket color
// and update our local storage database
function handleColor(ticket,id){
    let ticketcolor = ticket.querySelector(".ticket-color");
    ticketcolor.addEventListener("click",(e) => {
        // get ticketidx from ticket array
        let ticketidx = getticketidx(id);
        let currentticketcolor = ticketcolor.classList[1];
        // index of current color
        let currticcolidx = colors.findIndex((color) => {
            return currentticketcolor===color;
        })
        currticcolidx++;
        let newticketcoloridx = currticcolidx%colors.length;
        let newticketcolor = colors[newticketcoloridx];
        ticketcolor.classList.remove(currentticketcolor);
        ticketcolor.classList.add(newticketcolor);
        // modify data in local storage
        ticketarr[ticketidx].ticketcolor = newticketcolor;
        localStorage.setItem("jira_tickets",JSON.stringify(ticketarr));
    })
}

// This is very important function which returns the index of the ticket from the tickets array with
// the help of unique id, we will iterate through our tickets array and compare our id with all the 
// tickets wherever it matches we will simply return its index
function getticketidx(id){
    let ticketidx = ticketarr.findIndex((ticketobj,idx) => {
        return ticketobj.ticketid === id;
    })
    return ticketidx;
}

// This function will set our modal porperties to deafult
// default properties like removing modal fromthe ui and empty the 
// text from the text area as well as setting the priority color to black 
// and will remove the border from the last color and add the border in black color box
function setmodaltodefault(){
    modalcont.style.display = "none";
    textareacont.value = "";
    modalprioritycolor = colors[colors.length-1];
    allprioritycolors.forEach((prioritycolorElem,idx) => {
        prioritycolorElem.classList.remove("border");
    })
    allprioritycolors[allprioritycolors.length-1].classList.add("border");
}