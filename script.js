const noteColors = ["#fff9c4","#ffecb3","#ffcdd2","#bbdefb","#d1c4e9","#c8e6c9"];
const pinColors = ["#e53935","#1e88e5","#fdd835","#8e24aa","#43a047"];
const decors = ["📎","📌","🧷","🌸","💌","🍀","🍃","🌿"];

let userId = localStorage.getItem("userId");
if(!userId){
    userId = "u_" + Math.random().toString(36).substr(2,9);
    localStorage.setItem("userId", userId);
}

function rand(a){
    return a[Math.floor(Math.random()*a.length)];
}

/* STORAGE */
function saveNotes(d){
    localStorage.setItem("notes9A1", JSON.stringify(d));
}

function loadNotes(){
    return JSON.parse(localStorage.getItem("notes9A1") || "[]");
}

/* FORM */
function openForm(){ overlay.style.display = "flex"; }
function closeForm(e){
    if(e.target.id === "overlay") overlay.style.display = "none";
}

/* NOTE */
function createNote(data,i){
    const {name,msg,owner} = data;

    const note = document.createElement("div");
    note.className = "note";

    note.style.background = rand(noteColors);
    note.style.setProperty("--rotate",(Math.random()*8-4)+"deg");

    const pin = document.createElement("div");
    pin.className = "pin";
    pin.style.background = rand(pinColors);
    note.appendChild(pin);

    const c = document.createElement("div");
    c.className = "note-content";
    c.innerHTML = `<b>${name}</b><br><small>Xem 💌</small>`;
    note.appendChild(c);

    for(let i=0;i<2;i++){
        const d = document.createElement("div");
        d.className = "decor";
        d.innerText = rand(decors);
        d.style.top = Math.random()*100+"%";
        d.style.left = Math.random()*100+"%";
        note.appendChild(d);
    }

    note.onclick = ()=> showPopup(name+": "+msg);

    if(owner===userId){
        const del = document.createElement("div");
        del.innerText="❌";
        del.className="delete";

        del.onclick=(e)=>{
            e.stopPropagation();
            const arr=loadNotes();
            arr.splice(i,1);
            saveNotes(arr);
            render();
        };

        note.appendChild(del);
    }

    return note;
}

/* ADD */
function addNote(){
    const name=nameInput.value.trim();
    const msg=msgInput.value.trim();
    if(!name||!msg) return alert("Nhập đủ!");

    const arr=loadNotes();
    arr.push({name,msg,owner:userId});
    saveNotes(arr);

    overlay.style.display="none";
    nameInput.value="";
    msgInput.value="";

    render();
}

/* RENDER */
function render(){
    board.innerHTML="";
    loadNotes().forEach((n,i)=>{
        board.appendChild(createNote(n,i));
    });
}

/* POPUP */
function showPopup(t){
    popupText.innerText=t;
    popup.style.display="flex";
}
function closePopup(){ popup.style.display="none"; }

/* 🍃 CLOVER NHẸ (KHÔNG LAG) */
function spawnClover(){
    const c=document.createElement("div");
    c.className="clover";
    c.innerText=["🍀","🍃","🌿"][Math.floor(Math.random()*3)];
    c.style.left=Math.random()*100+"vw";
    c.style.animationDuration=(4+Math.random()*3)+"s";
    document.querySelector(".clover-container").appendChild(c);
    setTimeout(()=>c.remove(),9000);
}

/* thay setInterval → giảm lag */
function loopClover(){
    spawnClover();
    setTimeout(loopClover, 900 + Math.random()*1200);
}
loopClover();

/* INIT */
const board=document.getElementById("board");
const overlay=document.getElementById("overlay");
const nameInput=document.getElementById("name");
const msgInput=document.getElementById("msg");
const popup=document.getElementById("popup");
const popupText=document.getElementById("popupText");

render();
