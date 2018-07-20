window.onload = function() {
  const todosContainer = document.getElementById('todos-container');
  const newTodoInput = document.getElementById('new-todo-input');
  const addTodoBtn = document.getElementById('add-todo-btn');

  newTodoInput.onkeydown = function(e) {
    if (e.keyCode === 13) {
      createTodo();
    }
  }

  addTodoBtn.onclick = function(e) {
    createTodo();
  }

  fetch('/get-todos')
  .then(response => response.json())
  .then(response => {
    console.log(response);

    response.forEach(todo => {
      insertTodo(todo);
    });
  });

  function insertTodo(todo) {
    let container = document.createElement('div');
    container.id = todo.id;
    container.classList.add('todo');

    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'checkbox-' + todo.id;
    checkbox.checked = todo.done;
    checkbox.onchange = function (e) {
      console.log('check box ' + todo.id + ' click');
      console.log(checkbox.checked);

      fetch('/update-todo', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
          id: todo.id,
          done: checkbox.checked
        })
      })
        .then(response => response.json())
        .then(response => {
          console.log(response);
        })
        .catch(error => console.error(error));
    }

    let text = document.createElement('div');
    text.innerHTML = todo.text;

    let btn = document.createElement('button');
    btn.id = 'btn-' + todo.id;
    btn.innerHTML = 'X';
    btn.onclick = function (e) {
      console.log('deleting ' + todo.id);

      fetch('/delete-todo', {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
          id: todo.id,
        })
      })
        .then(response => response.json())
        .then(response => {
          console.log(response);
          if (response.affectedRows) {
            container.remove();
          }
        })
        .catch(error => console.error(error));
    }

    container.appendChild(checkbox);
    container.appendChild(text);
    container.appendChild(btn);

    todosContainer.appendChild(container);
  }

  function createTodo() {
    console.log('add todo');
    if (newTodoInput.value) {
      fetch('/create-todo', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
          text: newTodoInput.value,
        })
      })
        .then(response => response.json())
        .then(response => {
          console.log(response);
          if (response.affectedRows) {
            insertTodo({
              id: response.insertId,
              text: newTodoInput.value,
              done: false,
              created: response.created
            });
            newTodoInput.value = '';
          }
          else {
            alert('Could not create');
          }
        })
        .catch(error => console.error(error));
    }
    else {
      alert('You can not create a todo without text');
    }
  }
}

