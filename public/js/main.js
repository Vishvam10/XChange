const chatContainer = document.querySelector(".chat-container");
const chatArea = document.querySelector(".chat-area");
const chatDisplay = document.querySelector(".chat-display");
const roomNo = document.querySelector(".roomno");
const lines = document.querySelector(".lines");
const line1 = document.querySelector(".line1");
const line2 = document.querySelector(".line2");
const currentUser = document.querySelector(".username");
const userList = document.querySelector(".users-list");
const user = document.querySelector(".user");
const inp = document.getElementById('message1');
const btn = document.querySelector(".send-btn");
const panel = document.querySelector(".panel");
const leave = panel.childNodes[3];
const l1 = document.getElementById('l1');

var i;
// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users info
socket.on('roomUsers', ({ room, users, curUser }) => {
    opRoomName(room);
    opUsers(users);
    opCurUser(curUser.username);
});

// Message form server
socket.on('message', message => {
    opMessage(message);

    // Scroll down
    chatArea.scrollTop = chatArea.scrollHeight;
});

//- Chat Entry - Login

function getMessageFromUser(e) {
    e.preventDefault();
    const msg = inp.value;
    if(msg != "") {
        socket.emit('chatMessage', msg);
        document.getElementById('message1').value = "";
    } 
}

inp.addEventListener("keyup", (e) => {
    if (e.keyCode === 13) {
      getMessageFromUser(e);
    }
});

  btn.addEventListener('click', (e) => {
   getMessageFromUser(e)
});

//- Output message to DOM
function opMessage(message) {
    const markup =
    `
        <div class="message-box">
            <div class="details">
                <div class="n">${message.username} | ${message.time}</div>
                <div class="msg">${message.textMsg}</div>
            </div>
        </div>
    `
    const chatArea = document.querySelector(".chat-area");
    chatArea.insertAdjacentHTML('beforeend', markup);
}

//- Add room name to DOM
function opRoomName(room) {
    roomNo.innerText = room;
}

//- Add users to DOM
function opUsers(users) {
    userList.innerHTML = `${users.map(user => `<li class="user">${user.username}</li>`).join('')}`;
}

//- Add current user to DOM
function opCurUser(curUser) {
    currentUser.innerText = curUser;
}

leave.addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
      window.location = '../index.html';
    } else {
    }
});

//- Dark theme
const themeSwitch = document.querySelector(".panel").childNodes[1];
// console.log(themeSwitch);
themeSwitch.addEventListener("click", () => {
    if(chatContainer.style.background != "rgba(0, 0, 0, 0.9)") {
        chatContainer.style.background = "rgba(0,0,0,0.9)";
        chatDisplay.style.border = "2px solid white";
        chatDisplay.style.boxShadow = "none";
        lines.style.backgroundColor = "white";
        line1.style.backgroundColor = "white";
        line2.style.backgroundColor = "white";
        currentUser.style.color = "white";
        user.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
        inp.style.color = "rgba(255, 255, 255, 1)";
        l1.style.color = "white";
    } 
    if(chatContainer.style.background == "rgba(0, 0, 0, 0.9)") {
        chatContainer.style.background = "linear-gradient(to right, #d3cce3, #e9e4f0)";
        chatDisplay.style.border = "1px solid black";
        chatDisplay.style.boxShadow = "0px 1.4rem 4.2rem rgb(0 0 0 / 20%)";
        lines.style.backgroundColor = "black";
        line1.style.backgroundColor = "black";
        line2.style.backgroundColor = "black";
        currentUser.style.color = "black";
        user.style.backgroundColor = "rgba(0, 0, 0, 0.2)";  
        inp.style.color = "black";
        l1.style.color = "black";
    } 
})