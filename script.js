const noteColors = ["#fff9c4","#ffecb3","#ffcdd2","#bbdefb","#d1c4e9","#c8e6c9"];
const pinColors = ["#e53935","#1e88e5","#fdd835","#8e24aa","#43a047"];
const decors = ["📎","📌","🧷","🌸","💌","🍃"];

let userId = localStorage.getItem("userId");
if(!userId){
    userId = "u_" + Math.random().toString(36).substr(2,9);
    localStorage.setItem("userId", userId);
}

function saveNotes(data){
    localStorage.setItem("notes9A1", JSON.stringify(data));
}

function loadNotes(){
    return JSON.parse(localStorage.getItem("notes9A1") || "[]");
}

function rand(arr){
    return arr[Math.floor(Math.random()*arr.length)];
}

/* FORM */
function openForm(){
    overlay.style.display = "flex";
}

function closeForm(e){
    if(e.target === overlay){
        overlay.style.display = "none";
    }
}

/* NOTE */
function createNote(noteData, index){
    const {name, msg, owner, time} = noteData;

    const note = document.createElement("div");
    note.className = "note";

    note.style.background = rand(noteColors);
    note.style.setProperty("--rotate",(Math.random()*8-4)+"deg");

    if(owner === userId){
        note.classList.add("my-note");
    }

    const pin = document.createElement("div");
    pin.className = "pin";
    pin.style.background = rand(pinColors);
    note.appendChild(pin);

    if(owner === userId){
        const crown = document.createElement("div");
        crown.className = "owner-icon";
        crown.innerText = "👑";
        note.appendChild(crown);
    }

    const content = document.createElement("div");
    content.className = "note-content";

    content.innerHTML = `
        <div class="note-name">${name}</div>
        <div class="note-msg">${msg}</div>
        <div class="note-time">${time}</div>
        <div class="more-hint">xem thêm 💌</div>
    `;

    note.appendChild(content);

    note.onclick = () => showPopup(name, msg, time);

    if(owner === userId){
        const del = document.createElement("div");
        del.innerText = "❌";
        del.className = "delete";

        del.onclick = (e)=>{
            e.stopPropagation();
            const notes = loadNotes();
            notes.splice(index,1);
            saveNotes(notes);
            renderNotes();
        };

        note.appendChild(del);
    }

    return note;
}

function addNote(){
    const name = nameInput.value.trim();
    const msg = msgInput.value.trim();

    if(!name || !msg) return alert("Nhập đủ!");

    const time = new Date().toLocaleString();

    const notes = loadNotes();
    notes.push({name, msg, owner:userId, time});
    saveNotes(notes);

    overlay.style.display="none";
    nameInput.value="";
    msgInput.value="";

    renderNotes();
}

function renderNotes(){
    board.innerHTML = "";
    loadNotes().forEach((n,i)=>{
        board.appendChild(createNote(n,i));
    });
}

/* POPUP */
function showPopup(name, msg, time){
    popupText.innerHTML = `
        <div class="popup-name">${name}</div>
        <div class="popup-msg">${msg}</div>
        <div class="popup-time">${time}</div>
    `;
    popup.style.display="flex";
}

function closePopup(){
    popup.style.display="none";
}

/* EFFECT */
function createClover(){
    const c = document.createElement("div");
    c.className = "clover";

    const icons = ["🍀","🍃","🌿"];
    c.innerText = rand(icons);

    c.style.left = Math.random()*100 + "vw";
    c.style.animationDuration = (3+Math.random()*4) + "s";

    document.querySelector(".clover-container").appendChild(c);
    setTimeout(()=>c.remove(),8000);
}

setInterval(createClover,300);

/* INTRO */
function closeIntro(){
    document.getElementById("intro").style.display = "none";
}

/* INIT */
const board = document.getElementById("board");
const overlay = document.getElementById("overlay");
const nameInput = document.getElementById("name");
const msgInput = document.getElementById("msg");
const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");

renderNotes();
