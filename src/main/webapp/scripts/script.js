fetch('http://localhost:8080/TasksManager/tasks')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        const tasks = Object.entries(data.tasks);
        tasks.forEach(([id, taskText]) => {
            createTaskBlock(id, taskText);
        });
        updateTaskNumbers();
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });



function createTaskBlock(id, taskText){
  const container = document.getElementById('task-container');
  const taskElement = document.createElement('div');
  taskElement.className = 'task-block';
  taskElement.setAttribute('data-id', id);
  taskElement.innerHTML = `
      <button class="delete-task" onclick="deleteTaskTapBasket(${id})">
          <img src="./img/basket.png" alt="">
      </button>

      <div class="text-task-block">
          <p class="number-task">number</p>
          <input class="input-task" type="text" value="${taskText}">
      </div>

      <button class="edit-block" onclick="updateTask(${id})">
          <img src="./img/pen-editor.png" alt="err">
      </button>
  `;
  container.appendChild(taskElement);
}

function searchTasks(){

    const userText = document.getElementById('input-new-task').value;

    fetch(`http://localhost:8080/TasksManager/tasks?search-text=${userText}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        const container = document.getElementById('task-container');
        // const taskBlocks = container.getElementsByClassName('task-block');
        // for (let i = 0; i < taskBlocks.length; i++) {
        //     const taskBlock = taskBlocks[i];
        //     taskBlock.remove()
        // }
        container.innerHTML = '';

        const tasks = Object.entries(data.tasks);
        tasks.forEach(([id, taskText]) => {
            createTaskBlock(id, taskText);
        });
        updateTaskNumbers();
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });

}


function addTask() {
    const userText = document.getElementById('input-new-task').value;

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
            document.getElementById('input-new-task').value = '';
            createTaskBlock(id, userText);
            updateTaskNumbers();
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Ошибка отправки!');
        });
}

function updateTask(id) {
    const taskElement = document.querySelector(`.task-block[data-id="${id}"]`);
    if (!taskElement) {
      console.error('Элемент задачи не найден');
      return;
    }
    const newText = taskElement.querySelector('.input-task').value;

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
    const listNumber = parseInt(document.getElementById('input-new-task').value);

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

            document.getElementById('input-new-task').value = '';
            taskToDelete.remove();
            updateTaskNumbers();
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Ошибка отправки!');
        });
}

function deleteTaskTapBasket(id) {
    fetch('/TasksManager/tasks', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: id
        }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Успешно:', data);
            if (data.status == 'error') {
                console.log(data.info);
                return;
            }
            const taskToDelete = document.querySelector(`.task-block[data-id="${id}"]`);
            document.getElementById('input-new-task').value = '';
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
        const inputElement = taskBlock.querySelector('.number-task');

        inputElement.textContent = `${i + 1}`;
    }
}


