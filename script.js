// ===== COLOR =====
const noteColors = ["#fff9c4","#ffecb3","#ffcdd2","#bbdefb","#d1c4e9","#c8e6c9"];
const pinColors = ["#e53935","#1e88e5","#fdd835","#8e24aa","#43a047"];

// ===== USER ID (giữ lại để đánh dấu note của mình) =====
let userId = localStorage.getItem("userId");
if(!userId){
    userId = "u_" + Math.random().toString(36).slice(2);
    localStorage.setItem("userId", userId);
}

// ===== ELEMENT =====
const board = document.getElementById("board");
const overlay = document.getElementById("overlay");
const nameInput = document.getElementById("name");
const msgInput = document.getElementById("msg");
const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");

// ===== UTILS =====
function rand(arr){
    return arr[Math.floor(Math.random()*arr.length)];
}

// ===== FORM =====
function openForm(){ overlay.style.display="flex"; }
function closeForm(e){ if(e.target===overlay) overlay.style.display="none"; }

// ===== NOTE UI =====
function createNote(n, id){
    const note = document.createElement("div");
    note.className = "note";

    note.style.background = rand(noteColors);

    if(n.owner===userId) note.classList.add("my-note");

    const pin = document.createElement("div");
    pin.className="pin";
    pin.style.background = rand(pinColors);
    note.appendChild(pin);

    note.innerHTML += `
        <div class="note-name">${n.name}</div>
        <div class="note-msg">${n.msg}</div>
        <div class="note-time">${n.time}</div>
    `;

    note.onclick = ()=>showPopup(n.name,n.msg,n.time);

    // ===== DELETE (chỉ xoá note của mình) =====
    if(n.owner===userId){
        const del = document.createElement("div");
        del.className="delete";
        del.innerText="❌";

        del.onclick = async (e)=>{
            e.stopPropagation();
            await fb.deleteDoc(fb.doc(db, "notes", id));
        };

        note.appendChild(del);
    }

    return note;
}

// ===== ADD NOTE (FIREBASE) =====
async function addNote(){
    const name = nameInput.value.trim();
    const msg = msgInput.value.trim();

    if(!name || !msg) return alert("Nhập đủ!");

    const time = new Date().toLocaleString();

    try{
        await fb.addDoc(
            fb.collection(db, "notes"),
            {
                name,
                msg,
                time,
                owner: userId
            }
        );

        overlay.style.display="none";
        nameInput.value="";
        msgInput.value="";
    }catch(err){
        console.error(err);
        alert("Lỗi: " + err.message);
    }
}

// ===== LOAD REALTIME =====
function loadNotes(){
    fb.onSnapshot(
        fb.collection(db, "notes"),
        (snapshot)=>{
            board.innerHTML="";
            snapshot.forEach(docSnap=>{
                board.appendChild(
                    createNote(docSnap.data(), docSnap.id)
                );
            });
        }
    );
}

// ===== POPUP =====
function showPopup(name,msg,time){
    popupText.innerHTML=`
        <b>${name}</b><br>
        ${msg}<br><small>${time}</small>
    `;
    popup.style.display="flex";
}
function closePopup(){ popup.style.display="none"; }

// ===== 🌿 LÁ RƠI =====
function createClover(){
    const c=document.createElement("div");
    c.className="clover";

    const icons=["🍀","🍃","🌿"];
    c.innerText=rand(icons);

    c.style.left=Math.random()*window.innerWidth+"px";
    c.style.fontSize=(12+Math.random()*20)+"px";
    c.style.animationDuration=(5+Math.random()*5)+"s";

    document.querySelector(".clover-container").appendChild(c);
    setTimeout(()=>c.remove(),10000);
}
setInterval(createClover,250);

// ===== INTRO =====
function closeIntro(){
    document.getElementById("intro").style.display="none";
}

// ===== INIT =====
loadNotes();
