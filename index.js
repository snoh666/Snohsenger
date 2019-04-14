//Firebase Initialization
var config = {
  apiKey: "AIzaSyD8_ZhbhwWrVYymiDdMTr-3yTJi3wugWHE",
  authDomain: "small-messenger.firebaseapp.com",
  databaseURL: "https://small-messenger.firebaseio.com",
  projectId: "small-messenger",
  storageBucket: "small-messenger.appspot.com",
  messagingSenderId: "614598560458"
};

document.addEventListener('DOMContentLoaded', () => {

  Notification.requestPermission();

  window.addEventListener('focus', () => {
    document.title = 'Snohsenger';
  });

  firebase.initializeApp(config);

  //Listener for click on info
  document.getElementsByClassName('info')[0].addEventListener('click',() => {
    document.getElementsByClassName('info')[0].classList.add('display');
  });

  let databaseGlobal = firebase.database();
  //Clear user1 user2 from previously messages
  databaseGlobal.ref('user1/').remove();
  databaseGlobal.ref('user2/').remove();

  databaseGlobal.ref('user1/').on('child_added', value => {
    let messageUser = value.val().message;
    if(!document.hasFocus()) {
      if(Notification.permission == 'granted') {
        const notify = new Notification(`User 1: ${messageUser}`);
      }
      document.title = 'New Message!!';
    }

    const messageCol = [document.getElementsByClassName('col-content')[0], document.getElementsByClassName('col')[0]];
    messageCol[0].innerHTML += `<div class="message user-left"><span>${messageUser}</span></div>`;
    messageCol[1].scrollTop = messageCol[1].scrollHeight;
  });
  databaseGlobal.ref('user2/').on('child_added', value => {
    let messageUser =  value.val().message;
    if(!document.hasFocus()) {
      if (Notification.permission == 'granted') {
        const notify = new Notification(`User 2: ${messageUser}`);
      }
      document.title = 'New Message!!';
    }

    const messageCol = [document.getElementsByClassName('col-content')[0], document.getElementsByClassName('col')[0]];
    messageCol[0].innerHTML += `<div class="message user-right"><span>${messageUser}</span></div>`;
    messageCol[1].scrollTop = messageCol[1].scrollHeight;
  });

  document.getElementById('message').addEventListener('keypress', e => {
    if(e.keyCode == 13) {
      e.preventDefault();
      document.querySelectorAll('button')[0].click();
      document.getElementById('message').value = '';
    }
  });
  document.getElementById('messageForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const message = document.getElementById('message');

    if(message.value !== '') {
      const selectElement = document.querySelectorAll('select')[0];

      if (selectElement.options[0].selected) {
        let databaseLocal = firebase.database().ref('user1/');

        databaseLocal.push({
          message: message.value
        });
        message.value = '';
      } else if (selectElement.options[1].selected) {
        let databaseLocal = firebase.database().ref('user2/');

        databaseLocal.push({
          message: message.value
        });
        message.value = '';
      }
    } else {
      console.log('Message undefined');
    }

  });

});