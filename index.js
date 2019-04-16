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
    document.getElementsByClassName('login')[0].classList.add('move-left');
    document.getElementsByClassName('site')[0].classList.remove('move-right');
  } else {
    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();

      localStorage.setItem('name', document.getElementById('username').value);
      document.getElementsByClassName('login')[0].classList.add('move-left');
      document.getElementsByClassName('site')[0].classList.remove('move-right');

      username = localStorage.getItem('name');
    });
  }

  //Ask user to allow system notification from site
  Notification.requestPermission();

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
      //If notification allowed
      // if (Notification.permission == 'granted') {
      //   //Notify user
      //   new Notification('New Message in Snohsenger!');
      // }
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
      if (user === username) {
        returnElement = '';
      } else {
        returnElement = `<span class="username">${user}</span>:`;
      }
      return returnElement;
    };
    //Input message with nickname before
    messageCol[0].innerHTML += `<div class="message ${classReturn(valueArr[0])}"><span>${checkUser(valueArr[0])} ${valueArr[1]}</span></div>`;
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