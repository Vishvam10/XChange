const chatArea = document.querySelector(".chat-area");
const roomNo = document.querySelector(".roomno");
const currentUser = document.querySelector(".username");
const userList = document.querySelector(".users-list");
const btn = document.querySelector(".send-btn");
const panel = document.querySelector(".panel");
const leave = panel.childNodes[3];

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
const inp = document.getElementById('message1');

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