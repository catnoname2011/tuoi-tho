const noteColors = ["#fff9c4","#ffecb3","#ffcdd2","#bbdefb","#d1c4e9","#c8e6c9"];
const pinColors = ["#e53935","#1e88e5","#fdd835","#8e24aa","#43a047"];
const decors = ["📎","📌","🧷","📖","✏️","📝","🌿","🍃","🌸","💌","📮","💭"];

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
    if(e.target.id === "overlay"){
        overlay.style.display = "none";
    }
}

/* POPUP */
function showPopup(name, msg, time){
    popupText.innerHTML = `
        <div class="popup-name">${name}</div>
        <div class="popup-msg">${msg}</div>
        <div class="popup-time">${time || ""}</div>
    `;
    popup.style.display="flex";
}

function closePopup(){
    popup.style.display="none";
}

/* NOTE */
function createNote(noteData, index){
    const {name, msg, owner, time} = noteData;

    const note = document.createElement("div");
    note.className = "note";

    const bg = rand(noteColors);
    note.style.background = bg;
    note.style.setProperty("--rotate",(Math.random()*8-4)+"deg");

    let pinColor;
    do {
        pinColor = rand(pinColors);
    } while(pinColor === bg);

    const pin = document.createElement("div");
    pin.className = "pin";
    pin.style.background = pinColor;
    note.appendChild(pin);

    const c = document.createElement("div");
    c.className = "note-content";
    c.innerHTML = `
        <div class="note-name">${name}</div>
        <div class="note-msg">${msg}</div>
        <div class="more-hint">Xem thêm...</div>
        <div class="note-time">${time || ""}</div>
    `;
    note.appendChild(c);

    setTimeout(()=>{
        const msgDiv = c.querySelector(".note-msg");
        const hint = c.querySelector(".more-hint");
        if(msgDiv.scrollHeight <= msgDiv.clientHeight){
            hint.style.display = "none";
        }
    },0);

    const positions = [
        {top:"5px",left:"5px"},
        {top:"5px",right:"5px"},
        {bottom:"5px",left:"5px"},
        {bottom:"5px",right:"5px"}
    ];

    for(let i=0;i<2;i++){
        const d = document.createElement("div");
        d.className = "decor";
        d.innerText = rand(decors);
        Object.assign(d.style, rand(positions));
        note.appendChild(d);
    }

    note.onclick = () => showPopup(name, msg, time);

    if(owner === userId){
        note.classList.add("my-note");

        const crown = document.createElement("div");
        crown.innerText = "👑";
        crown.className = "owner-icon";
        note.appendChild(crown);

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

    const notes = loadNotes();
    const time = new Date().toLocaleString();

    notes.push({name,msg,owner:userId,time});
    saveNotes(notes);

    overlay.style.display="none";
    nameInput.value="";
    msgInput.value="";

    const sound = document.getElementById("popSound");
    if(sound){
        sound.currentTime = 0;
        sound.play();
    }

    renderNotes();
}

function renderNotes(){
    board.innerHTML = "";
    loadNotes().forEach((n,i)=>{
        board.appendChild(createNote(n,i));
    });
}

/* CLOVER */
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

/* INIT */
const board = document.getElementById("board");
const overlay = document.getElementById("overlay");
const nameInput = document.getElementById("name");
const msgInput = document.getElementById("msg");
const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");

renderNotes();
