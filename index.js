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

  firebase.initializeApp(config);

  //Listener for click on info
  document.getElementsByClassName('info')[0].addEventListener('click',() => {
    document.getElementsByClassName('info')[0].classList.add('display');
  });

  let databaseGlobal = firebase.database();
  //Clear user1 user2 from previously messages
  databaseGlobal.ref('user1/').remove();
  databaseGlobal.ref('user2/').remove();

  databaseGlobal.ref('user1/').on('child_removed', () => {
    document.getElementsByClassName('col')[0].innerHTML = '';
  });
  databaseGlobal.ref('user2/').on('child_removed', () => {
    document.getElementsByClassName('col')[0].innerHTML = '';
  });

  databaseGlobal.ref('user1/').on('child_added', value => {
    let messageUser = value.val().message;

    document.getElementsByClassName('col')[0].innerHTML += `<div class="user-left"><span>${messageUser}</span></div>`;
  });
  databaseGlobal.ref('user2/').on('child_added', value => {
    let messageUser =  value.val().message;

    document.getElementsByClassName('col')[0].innerHTML += `<div class="user-right"><span>${messageUser}</span></div>`;
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