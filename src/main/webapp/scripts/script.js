
fetch('http://localhost:8080/TasksManager/tasks')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json(); // или response.json() если ожидается JSON
  })
  .then(data => {
    // Обработка ответа
    console.log(data);
    const container = document.getElementById('task-container');
    const tasks = Object.entries(data.tasks);

    tasks.forEach(([id, taskName]) => {
      const taskElement = document.createElement('div');
      taskElement.className = 'task-block';
      taskElement.id = 'task-block-id-' + id;
      taskElement.innerHTML = `
          <div class="sqare-task"></div>

          <div class="text-task-block">
              <p class="text-task">${id}. ${taskName}</p>
          </div>

          <img src="./img/Basket.png" alt="" class="basket-task">
      `;
      container.appendChild(taskElement);
    });
  })
  .catch(error => {
    // Обработка ошибок
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
      action: 'addTask',
      text: userText
    }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Успешно:', data);
      alert('Данные отправлены!');
      const id = data.idTask
      document.getElementById('task').value = ''; // Очищаем поле ввода
      const container = document.getElementById('task-container');
      const taskElement = document.createElement('div');
      taskElement.className = 'task-block';
      taskElement.id = 'task-block-id-' + id;
      taskElement.innerHTML = `
            <div class="sqare-task"></div>

            <div class="text-task-block"> 
                <p class="text-task">${id}. ${userText}</p>
            </div>

            <img src="./img/Basket.png" alt="" class="basket-task">
        `;
      container.appendChild(taskElement);

    })
    .catch(error => {
      console.error('Ошибка:', error);
      alert('Ошибка отправки!');
    });
}

function deleteTask() {
  const userText = document.getElementById('task').value;

  fetch('/TasksManager/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'deleteTask',
      text: userText
    }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Успешно:', data);
      alert('Данные отправлены!');
      document.getElementById('task').value = '';
      const id = data.idTask
      const element = document.getElementById('task-block-id-' + id);
      element.remove(); // Удаляет элемент из DOM
    })
    .catch(error => {
      console.error('Ошибка:', error);
      alert('Ошибка отправки!');
    });
}