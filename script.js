'use strict';
const container = document.querySelector('.container');
const input = document.querySelector('.task-input');
const submit = document.querySelector(' .parent .submit');
const eraseAll = document.querySelector('.delete-all');
const completeAll = document.querySelector('.complete-all');
let arrOfTasks = [];

if (localStorage.getItem('tasks')) {
  arrOfTasks = JSON.parse(localStorage.getItem('tasks'));
}

const sweetAlert = function () {
  Swal.fire({
    title: 'Oops...',
    text: 'It looks like you forgot to enter a value!',
    icon: 'warning',
    confirmButtonText: 'Got it!',
    iconColor: '#f05053',
  });
};

// To retrive the data
getDataFromLocalStorage();

const addTaskToArr = text => {
  const data = {
    id: Date.now() + '',
    date: new Date().toISOString().slice(0, 10),
    title: text,
  };
  arrOfTasks.push(data);

  // Call addTaskToPage with the new task data
  addTaskToPage(data);
};

function addTaskToPage(data) {
  // Create the div elelment
  const div = document.createElement('div');
  div.className = 'text child';
  div.setAttribute('data-id', data.id);

  // Create input element
  const input = document.createElement('input');
  input.className = 'task-input';
  input.value = data.title; // Set the input value to the task title
  div.appendChild(input);

  // Create First <i> element
  const icon = document.createElement('i');
  icon.className = 'fa-solid fa-x delete';
  div.appendChild(icon); // Append icon to the div

  // Create Second <i> element
  const icon2 = document.createElement('i');
  icon2.className = 'fa-solid fa-check complete';
  div.appendChild(icon2);

  // Append the div to a container
  container.appendChild(div);
}

const addDataToLocalStorage = arrOfTasks => {
  localStorage.setItem('tasks', JSON.stringify(arrOfTasks));
};

const clearInputAndFocus = input => {
  input.value = '';
  input.focus();
};

function getDataFromLocalStorage() {
  const data = localStorage.getItem('tasks');
  if (data) {
    let tasks = JSON.parse(data);
    tasks.forEach(task => addTaskToPage(task));
  }
}

// Function to handle task submission
const handleTaskSubmission = () => {
  if (input.value) {
    addTaskToArr(input.value);
    clearInputAndFocus(input);
    addDataToLocalStorage(arrOfTasks);
  } else {
    sweetAlert();
  }
};

// Submit the input (button)
submit.addEventListener('click', handleTaskSubmission);

// Submit the input (enter)
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    handleTaskSubmission();
  }
});

// Delete one Task
container.addEventListener('click', function (e) {
  if (e.target.classList.contains('delete')) {
    const taskElement = e.target.closest('.child');

    if (taskElement) {
      const taskId = taskElement.getAttribute('data-id'); // Get the task ID
      taskElement.remove(); // Remove from DOM

      // Remove from local storage
      arrOfTasks = arrOfTasks.filter(task => task.id !== taskId);
      addDataToLocalStorage(arrOfTasks);
    }
  }
  clearInputAndFocus(input);
});

// Delete all tasks
eraseAll.addEventListener('click', function () {
  container.innerHTML = '';
  localStorage.removeItem('tasks');
  // location.reload();
  arrOfTasks = [];
  clearInputAndFocus(input);
});

// complete one task
container.addEventListener('click', function (e) {
  const target = e.target.closest('.child');
  e.target.classList.contains('complete') && target.classList.toggle('op');
});

// complete all tasks
completeAll.addEventListener('click', function () {
  container.childNodes.forEach(child => child.classList.toggle('op'));
  clearInputAndFocus(input);
});

// App Colors
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const app = document.querySelector('.app');
  const h1 = document.querySelector('h1');
  const stylesContainer = document.querySelector('.styles');
  const buttons = document.querySelectorAll('.options button');

  const colorStyles = {
    'cl-linen': {
      bodyBackground: 'linear-gradient(to right, #e1eec3, #f05053)',
      appBackground: '#fbeee0',
      h1Color: '#422800',
      buttonStyles: {
        backgroundColor: '#fbeee0',
        color: '#422800',
        border: '2px solid #422800',
        boxShadow: '#422800 4px 4px 0 0',
      },
    },
    'cl-green': {
      bodyBackground: 'linear-gradient(to right, #a8edea,#1abc9c)',
      appBackground: '#74f874',
      h1Color: 'black',
      buttonStyles: {
        backgroundColor: '#74f874',
        color: 'black',
        border: '2px solid black',
        boxShadow: '#000 4px 4px 0 0',
      },
    },
    'cl-blue': {
      bodyBackground: 'linear-gradient(to right, #6a11cb, #2575fc)', 
      appBackground: '#2575fc', 
      h1Color: 'white', 
      buttonStyles: {
        backgroundColor: '#2575fc', 
        color: 'white', 
        border: '2px solid #000', 
        boxShadow: '#000 4px 4px 0 0', 
      },
    },
    'cl-Tropical': {
      bodyBackground: 'linear-gradient(to right, #ff9a9e, #fecfef, #ffdde1)', 
      appBackground: '#ff9a9e', // Warm tropical pink
      h1Color: 'white', // White text for contrast
      buttonStyles: {
        backgroundColor: '#ff9a9e', // Warm tropical pink for buttons
        color: 'white', // White text for buttons
        border: '2px solid black', // White border
        boxShadow: '#000 4px 4px 0 0', // Black shadow for contrast
      },
    },
  };

  function applyStyles(styles) {
    body.style.background = styles.bodyBackground;
    app.style.backgroundColor = styles.appBackground;
    h1.style.color = styles.h1Color;

    buttons.forEach(btn => {
      Object.assign(btn.style, styles.buttonStyles);
    });
  }
  let currentColorElement = null;

  stylesContainer.addEventListener('click', e => {
    const targetId = e.target.id;
    const styles = colorStyles[targetId];

    if (styles) {
      if (currentColorElement) {
        currentColorElement.classList.add('op');
      }

      e.target.classList.remove('op');
      currentColorElement = e.target;
      applyStyles(styles);
      input.focus();
      localStorage.setItem('colors', JSON.stringify(styles));
    }
  });

  // Load saved styles from localStorage
  if (localStorage.getItem('colors')) {
    const styles = JSON.parse(localStorage.getItem('colors'));
    applyStyles(styles);
  }
});
