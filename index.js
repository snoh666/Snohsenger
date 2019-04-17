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

      let usernameInput = document.getElementById('username').value.replace(/\s/g, "").replace(/(<([^>]+)>)/ig,"");
      if(usernameInput === '' || usernameInput === ' ') {
        alert('Username cant be empty!');
      } else {
        localStorage.setItem('name', usernameInput);
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

  //Listener for click on info element
  document.getElementsByClassName('info')[0].addEventListener('click', () => {
    document.getElementsByClassName('info')[0].classList.add('display');
  });

  //Set database variable
  let database = firebase.database().ref('messages/');


  /*
    ---------------------DATABASE ON CHILDREN---------------------------
  */
  database.on('child_added', value => {

    let valueArr = value.val().split(':');

    if (!document.hasFocus()) {
      //Change title to notify user
      document.title = 'New Message!!';
    }

    //Get elements into array to input message and scroll
    // messageCol[0] - element for grid to input message
    // messageCol[1] - column for auto scroll with overflow style
    const messageCol = [document.getElementsByClassName('col-content')[0], document.getElementsByClassName('col')[0]];
    //Function to return correct class
    const classReturn = (user) => {
      return user === username ? 'user-right' : 'user-left';
    };
    //User check function
    const checkUser = user => {
      let returnElement;
      //If user equals user from localStorage
      if (user === username) {
        //Don't return any addition name span
        returnElement = '';
      } else {
        //Return span with username
        returnElement = `<span class="username">${user}</span>:`;
      }
      return returnElement;
    };
    //Function to join whole message
    const messageJoin = msgArray => {
      //Deltes first element from array (username)
      msgArray.shift();
      //Returnes rest of array joined by ':' cause of it was splited firstly to get username
      return msgArray.join(':');
    };
    //Input message with nickname before
    messageCol[0].innerHTML += `<div class="message ${classReturn(valueArr[0])}"><span>${checkUser(valueArr[0])} ${messageJoin(valueArr)}</span></div>`;
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
      //Clear textarea
      document.getElementById('message').value = '';
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

});