// В функциях, где создаются задачи, замените idTask на data-id
fetch('http://localhost:8080/TasksManager/tasks')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
    const container = document.getElementById('task-container');
    const tasks = Object.entries(data.tasks);
    var count = 1;
    tasks.forEach(([id, taskName]) => {
      const taskElement = document.createElement('div');
      taskElement.className = 'task-block';
      taskElement.setAttribute('data-id', id);
      taskElement.innerHTML = `
          <div class="sqare-task"></div>
          <div class="text-task-block">
              <input class="text-task" type="text" value="${count++}. ${taskName}">
              <button class="update-task-btn" onclick="updateTask(${id})">Update</button>
          </div>
          <img src="./img/Basket.png" alt="" class="basket-task">
      `;
      container.appendChild(taskElement);
    });
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });


function addTask() {
  const userText = document.getElementById('task').value;

  fetch('/TasksManager/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: userText
    }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Успешно:', data);
      const id = data.idTask;
      document.getElementById('task').value = '';
      const container = document.getElementById('task-container');
      const taskElement = document.createElement('div');

      taskElement.className = 'task-block';
      taskElement.setAttribute('data-id', id);
      taskElement.innerHTML = `
            <div class="sqare-task"></div>
            <div class="text-task-block"> 
                <input class="text-task" type="text" value="1. ${userText}">
                <button class="update-task-btn" onclick="updateTask(${id})">Update</button>
            </div>
            <img src="./img/Basket.png" alt="" class="basket-task">
        `;
      container.appendChild(taskElement);
      updateTaskNumbers();
    })
    .catch(error => {
      console.error('Ошибка:', error);
      alert('Ошибка отправки!');
    });
}

// Обновите функцию updateTask
function updateTask(id) {
  const taskElement = document.querySelector(`.task-block[data-id="${id}"]`);
  // if (!taskElement) {
  //   console.error('Элемент задачи не найден');
  //   return;
  // }

  const inputElement = taskElement.querySelector('.text-task');
  // if (!inputElement) {
  //   console.error('Поле ввода не найдено');
  //   return;
  // }

  const newText = inputElement.value.split('. ').slice(1).join('. ');

  fetch('/TasksManager/tasks', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: id,
      text: newText
    }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Успешно обновлено:', data);
    })
    .catch(error => {
      console.error('Ошибка при обновлении:', error);
      alert('Ошибка при обновлении задачи!');
    });
}


function deleteTask() {
  const listNumber = parseInt(document.getElementById('task').value);

  if (isNaN(listNumber)) {
    alert('Пожалуйста, введите корректный номер задачи');
    return;
  }

  const container = document.getElementById('task-container');
  const taskBlocks = container.getElementsByClassName('task-block');

  if (listNumber < 1 || listNumber > taskBlocks.length) {
    alert('Номер задачи за пределами диапазона');
    return;
  }

  const taskToDelete = taskBlocks[listNumber - 1];
  const idTask = parseInt(taskToDelete.getAttribute('data-id'));

  // Остальной код остается таким же
  fetch('/TasksManager/tasks', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: idTask
    }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Успешно:', data);
      if (data.status == 'error') {
        console.log(data.info);
        return;
      }

      document.getElementById('task').value = '';
      taskToDelete.remove();
      updateTaskNumbers();
    })
    .catch(error => {
      console.error('Ошибка:', error);
      alert('Ошибка отправки!');
    });
}

function updateTaskNumbers() {
  const container = document.getElementById('task-container');
  const taskBlocks = container.getElementsByClassName('task-block');

  for (let i = 0; i < taskBlocks.length; i++) {
    const taskBlock = taskBlocks[i];
    const inputElement = taskBlock.querySelector('.text-task');

    // Обновляем значение input, сохраняя оригинальное название задачи
    const originalText = inputElement.value.split('. ').slice(1).join('. ');
    inputElement.value = `${i + 1}. ${originalText}`;
  }
}