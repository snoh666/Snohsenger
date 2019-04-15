/*

  Todos:
    - Make functions to simplify code

*/
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

  //If user comeback and is focused on site set title to default
  window.addEventListener('focus', () => {
    document.title = 'Snohsenger';
  });

  //Initalize firebase with config
  firebase.initializeApp(config);

  //Listener for click on info element
  document.getElementsByClassName('info')[0].addEventListener('click',() => {
    document.getElementsByClassName('info')[0].classList.add('display');
  });

  let databaseGlobal = firebase.database();
  //Clear user1 user2 from previously messages
  databaseGlobal.ref('user1/').remove();
  databaseGlobal.ref('user2/').remove();

  //If added child to correct user call InputMessage function
  databaseGlobal.ref('user1/').on('child_added', value => {
    InputMessage(value, 'user1');
  });
  databaseGlobal.ref('user2/').on('child_added', value => {
    InputMessage(value, 'user2');
  });

  //Function to output data into site
  const InputMessage = (value, user) => {
    let messageUser = value.val().message;

    if (!document.hasFocus()) {
      //If notification allowed
      if (Notification.permission == 'granted') {
        //Notify user
        if(user === 'user1') {
          const notify = new Notification(`User 1: ${messageUser}`);
        } else if(user === 'user2') {
          const notify = new Notification(`User 2: ${messageUser}`);
        }
      }
      //Change title to notify user
      document.title = 'New Message!!';
    }

    //Get elements into array to input message and scroll
    // messageCol[0] - element for grid to input message
    // messageCol[1] - column for auto scroll with overflow style
    const messageCol = [document.getElementsByClassName('col-content')[0], document.getElementsByClassName('col')[0]];
    //Input element
    //Function to return correct class
    const classReturn = (user) => {
      let userClass;
      //If it is user1 set class to user-left
      if (user === 'user1') {
        userClass = 'user-left';
      } else if(user === 'user2'){ //If it is user2 set class to user-right
        userClass = 'user-right';
      }
      return userClass;
    };
    //Output data into grid column with matching class for placement
    messageCol[0].innerHTML += `<div class="message ${classReturn(user)}"><span>${messageUser}</span></div>`;
    //Scroll
    messageCol[1].scrollTop = messageCol[1].scrollHeight;
  };

  //Add listener to keydown while focused on textarea
  document.getElementById('message').addEventListener('keypress', e => {
    // If user pressed enter which have keyCode == 13
    if(e.keyCode == 13) {
      //Prevent input next row
      e.preventDefault();
      //Click on button to submit
      document.querySelectorAll('button')[0].click();
      //Clear textarea
      document.getElementById('message').value = '';
    }
  });
  //Listener for form submiting
  document.getElementById('messageForm').addEventListener('submit', (e) => {
    //Prevent default php form sending
    e.preventDefault();

    //Get textarea object
    const message = document.getElementById('message');

    //If user have inputed something
    if(message.value !== '') {
      //Get select element object
      const selectElement = document.querySelectorAll('select')[0];

      if (selectElement.options[0].selected) { //If user 1 is selected
        let databaseLocal = firebase.database().ref('user1/'); //

        databaseLocal.push({
          message: message.value
        });
        message.value = '';
      } else if (selectElement.options[1].selected) { //If user 2 is selected
        let databaseLocal = firebase.database().ref('user2/'); //Set database ref to match user2

        databaseLocal.push({
          message: message.value
        });
        message.value = '';
      }
    } else { //If user havent inputed anything cl error
      console.log('Message undefined');
    }

  });

});