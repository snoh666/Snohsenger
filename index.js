window.addEventListener('load', async() => {
  const hideLoadingScreen = () => {
    const loadScreen = document.getElementById('loadingScreen');
    loadScreen.classList.add('move-left');
    loadScreen.addEventListener('transitionend', () => {
      loadScreen.classList.add('display');
    });
    document.getElementsByClassName('info')[0].classList.add('display');
  };
  setTimeout(hideLoadingScreen, 6000);
});

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


  let username;

  if (localStorage.getItem('name') !== null) {
    username = localStorage.getItem('name');
    document.getElementsByClassName('site')[0].classList.remove('move-right');
  } else {
    document.getElementsByClassName('login')[0].classList.remove('move-left');
    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();

      let usernameInputed = document.getElementById('username').value.replace(/\s/g, "").replace(/(<([^>]+)>)/ig,"");
      if(usernameInputed === '' || usernameInputed === ' ') {
        alert('Username cant be empty!');
      } else {
        localStorage.setItem('name', usernameInputed);
        document.getElementsByClassName('login')[0].classList.add('move-left');
        document.getElementsByClassName('site')[0].classList.remove('move-right');
      }

      username = localStorage.getItem('name');
    });
  }

  //If user comeback and is focused on site set title to default
  window.addEventListener('focus', () => {
    document.title = 'Snohsenger';
  });

  //Initalize firebase with config
  firebase.initializeApp(config);

  //Set database variable
  let database = firebase.database().ref('messages/');


  /*
    ---------------------DATABASE ONCE CHILDREN---------------------------
  */
  database.once('value', value => {
    //Variables ---------------------------------
    let allMessages = value.val();
    allMessages = Object.entries(allMessages);
    const messageCol = [document.getElementsByClassName('col-content')[0], document.getElementsByClassName('col')[0]];
    //Functions -------------------------------------
    const classReturn = userFromDatabase => {
      return userFromDatabase === username ? 'user-right' : 'user-left';
    };
    const checkUser = userFromDatabase => {
      let returnElement;
      if (userFromDatabase === username) {
        returnElement = '';
      } else {
        returnElement = `<span class="username">${userFromDatabase}</span>:`;
      }
      return returnElement;
    };
    const messageJoin = msgArray => {
      msgArray.shift();
      return msgArray.join(':');
    };
    //Handling ------------------------

    allMessages.forEach((element, index) => {
      if(index !== allMessages.length - 1) {
        let message = element[1].split(':');

        messageCol[0].innerHTML += `<div class="message ${classReturn(message[0])}"><span>${checkUser(message[0])} ${messageJoin(message)}</span></div>`;
        messageCol[1].scrollTop = messageCol[1].scrollHeight;
      }
    });

    database.limitToLast(1).on('child_added', value => {
      let valueArrayGeted = value.val().split(':');

      if (!document.hasFocus()) {
        const notifyAudio = document.querySelector('audio');
        document.title = 'New Message!!';

        notifyAudio.currentTime = 0;
        notifyAudio.play();
      }

      //Input message with nickname before
      messageCol[0].innerHTML += `<div class="message ${classReturn(valueArrayGeted[0])}"><span>${checkUser(valueArrayGeted[0])} ${messageJoin(valueArrayGeted)}</span></div>`;
      //Auto scroll
      messageCol[1].scrollTop = messageCol[1].scrollHeight;
    });
  });
  /*
    --------------------TEXTAREA ENTER---------------------------
  */
  document.getElementById('message').addEventListener('keypress', e => {
    // If user pressed enter which have keyCode == 13
    if (e.keyCode == 13) {
      //Prevent input next row
      e.preventDefault();
      //Click on button to submit
      document.querySelectorAll('#messageForm > button')[0].click();
    }
  });
  /*
    ---------------------MESSAGE FORM SUBMIT---------------------------
  */
  document.getElementById('messageForm').addEventListener('submit', e => {
    e.preventDefault();

    if(username !== null) {
      const messageTextArea = document.getElementById('message');
      messageTextArea.value = messageTextArea.value.replace(/(<([^>]+)>)/ig, "");
      const pushVar = `${username}: ${messageTextArea.value}`;

      if (messageTextArea.value == '' || messageTextArea.value == ' ') {
        console.warn('Nothing inputed');
      } else {
        database.push(pushVar);
        messageTextArea.value = '';
      }

    }
  });

  /*
  ---------------------MOBILE SCROLL PAGE DOWN WHILE INPUTING TEXT---------------------------
  */
  document.getElementById('message').addEventListener('focus', () => {
    window.scrollTo({
      top: window.innerHeight,
      left: 0,
      behaviour: 'smooth'
    });
  });

/*
---------------------ABOUT BUTTON LISTENER---------------------------
*/

  document.getElementsByClassName('btn-about')[0].addEventListener('click', () => {
    document.getElementsByClassName('site')[0].classList.add('move-left');
    document.getElementsByClassName('about')[0].classList.remove('move-right');

    document.getElementsByClassName('btn-about-exit')[0].addEventListener('click', () => {
      document.getElementsByClassName('about')[0].classList.add('move-right');
      document.getElementsByClassName('site')[0].classList.remove('move-left');
    });
  });

});
