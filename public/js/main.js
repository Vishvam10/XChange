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
socket.on('roomUsers', ({ room, users }) => {
    opRoomName(room);
    opUsers(users);
});

// Message form server
socket.on('message', message => {
    opMessage(message);

    // Scroll down
    chatArea.scrollTop = chatArea.scrollHeight;
});

// Chat Entry - Login
btn.addEventListener('click', (e) => {
    e.preventDefault();
    const msg = document.getElementById('message1').value;
    if(msg != "") {
        socket.emit('chatMessage', msg);
        document.getElementById('message1').value = "";
    } 
});

// Output message to DOM
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

// Add room name to DOM
function opRoomName(room) {
    roomNo.innerText = room;
}

// Add users to DOM

// function opUsers(users) {
//     userList.innerHTML = '';
//     users.forEach((user) => {
//       const li = document.createElement('li');
//       li.classList.add("user")
//       li.innerText = user.username;
//       userList.appendChild(li);
//     });
//   }

function opUsers(users) {
    userList.innerHTML = `${users.map(user => `<li class="user">${user.username}</li>`).join('')}`;
}


leave.addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
      window.location = '../index.html';
    } else {
    }
});