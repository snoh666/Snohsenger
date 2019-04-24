window.addEventListener('load', async() => {
  const hideLoadingScreen = () => {
    document.getElementById('loadingScreen').classList.add('display');
    document.getElementsByClassName('info')[0].classList.add('display');
  };
  setTimeout(hideLoadingScreen, 4000);
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
    ---------------------DATABASE ON CHILDREN---------------------------
  */
  database.on('child_added', value => {

    let valueArrayGeted = value.val().split(':');

    if (!document.hasFocus()) {
      document.title = 'New Message!!';
    }

    //Get elements into array to input message and scroll
    // messageCol[0] - element for grid to input message
    // messageCol[1] - column for auto scroll with overflow style
    const messageCol = [document.getElementsByClassName('col-content')[0], document.getElementsByClassName('col')[0]];
    //Function to return correct class
    const classReturn = userFromDatabase => {
      return userFromDatabase === username ? 'user-right' : 'user-left';
    };
    //User check function
    const checkUser = userFromDatabase => {
      let returnElement;
      if (userFromDatabase === username) {
        returnElement = '';
      } else {
        returnElement = `<span class="username">${userFromDatabase}</span>:`;
      }
      return returnElement;
    };
    //Function to join whole message
    const messageJoin = msgArray => {
      //Deletes first element from array (username)
      msgArray.shift();
      //Returnes rest of array joined by ':' cause of it was splited firstly to get username
      return msgArray.join(':');
    };
    //Input message with nickname before
    messageCol[0].innerHTML += `<div class="message ${classReturn(valueArrayGeted[0])}"><span>${checkUser(valueArrayGeted[0])} ${messageJoin(valueArrayGeted)}</span></div>`;
    //Auto scroll
    messageCol[1].scrollTop = messageCol[1].scrollHeight;
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
        console.log('Nothing inputed');
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