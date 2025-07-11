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
      taskElement.innerHTML = `
        <div class="task-block">
            <div class="sqare-task"></div>

            <div class="text-task-block">
                <p class="text-task">${id}. ${taskName}</p>
            </div>

            <img src="./img/Basket.png" alt="" class="basket-task">
        </div>
        `;
      container.appendChild(taskElement);
    });

    

  })
  .catch(error => {
    // Обработка ошибок
    console.error('Fetch error:', error);
  });