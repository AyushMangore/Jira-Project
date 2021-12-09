let addbtn = document.querySelector(".add-btn");
let rembtn = document.querySelector(".remove-btn");
let modalcont = document.querySelector(".modal-cont");
let maincont = document.querySelector(".main-cont");
let textareacont = document.querySelector(".textarea-cont")
let allprioritycolors = document.querySelectorAll(".priority-color");
let toolboxcolors = document.querySelectorAll(".color");


let colors = [ "lightpink","lightblue","lightgreen","black"];
let modalprioritycolor = colors[colors.length-1];

let addflag = false;
let remflag = false;

let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";

let ticketarr = [];

if(localStorage.getItem("jira_tickets")){
    // retrieve and display tickets
    ticketarr = JSON.parse(localStorage.getItem("jira_tickets"));
    ticketarr.forEach((ticketobj) => {
        createTicket(ticketobj.ticketcolor,ticketobj.ticketask,ticketobj.ticketid);
    })
}

for(let i=0;i<toolboxcolors.length;i++){
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
allprioritycolors.forEach((colorElem,idx) =>{
    colorElem.addEventListener("click",(e) => {
        allprioritycolors.forEach((prioritycolorElem,idx) => {
            prioritycolorElem.classList.remove("border");
        })
        colorElem.classList.add("border");
        modalprioritycolor = colorElem.classList[0];
    })
})

addbtn.addEventListener("click",(e) => {
    // alert("clicked");
    // display modal
    // generate ticket
    
    // if addflag true then modal will be displayed or vice versa
    addflag = !addflag;
    // alert(addflag)
    if(addflag){
        modalcont.style.display = "flex";
    }else{
        modalcont.style.display = "none";
    }
})

rembtn.addEventListener("click",(e) => {
    remflag = !remflag;
})

modalcont.addEventListener("keydown",(e) => {
    //shift
    let key = e.key;
    if(key === "Shift"){
        createTicket(modalprioritycolor,textareacont.value);
        addflag = false;
        setmodaltodefault();
    }
})

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

function getticketidx(id){
    let ticketidx = ticketarr.findIndex((ticketobj,idx) => {
        return ticketobj.ticketid === id;
    })
    return ticketidx;
}

function setmodaltodefault(){
    modalcont.style.display = "none";
    textareacont.value = "";
    modalprioritycolor = colors[colors.length-1];
    allprioritycolors.forEach((prioritycolorElem,idx) => {
        prioritycolorElem.classList.remove("border");
    })
    allprioritycolors[allprioritycolors.length-1].classList.add("border");
}