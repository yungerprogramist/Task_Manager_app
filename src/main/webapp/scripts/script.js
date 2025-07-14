
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
      taskElement.id = 'task-block-id-' + id;
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
      alert('Данные отправлены!');
      const id = data.idTask
      document.getElementById('task').value = ''; 
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
  const idTask = document.getElementById('task').value;

  fetch('/TasksManager/tasks', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: idTask
    }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Успешно:', data);
      alert('Данные отправлены!');
      if (data.status == 'error'){
        console.log(data.info);
        return;
      }
      document.getElementById('task').value = '';
      const id = data.idTask;
      const element = document.getElementById('task-block-id-' + id);
      element.remove(); 

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