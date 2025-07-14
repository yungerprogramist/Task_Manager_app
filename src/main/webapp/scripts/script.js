
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
      taskElement.idTask = id;
      taskElement.innerHTML = `
          <div class="sqare-task"></div>

          <div class="text-task-block">
              <p class="text-task">${count++}. ${taskName}</p>
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
      text: userText
    }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Успешно:', data);
      const id = data.idTask
      document.getElementById('task').value = '';
      const container = document.getElementById('task-container');
      const taskElement = document.createElement('div');

      taskElement.className = 'task-block';
      // taskElement.id = 'task-block-id-' + id;
      taskElement.idTask = id;
      taskElement.innerHTML = `
            <div class="sqare-task"></div>

            <div class="text-task-block"> 
                <p class="text-task">${id}. ${userText}</p>
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
  // const idTask = taskToDelete.idTask || taskToDelete.id.replace('task-block-id-', '');
  const idTask = parseInt(taskToDelete.idTask);

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

  // Перебираем все задачи и обновляем их номера
  for (let i = 0; i < taskBlocks.length; i++) {
    const taskBlock = taskBlocks[i];
    const textElement = taskBlock.querySelector('.text-task');

    // Обновляем текст, сохраняя оригинальное название задачи
    const originalText = textElement.textContent.split('. ').slice(1).join('. ');
    textElement.textContent = `${i + 1}. ${originalText}`;
  }
}