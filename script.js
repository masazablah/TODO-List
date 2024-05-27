const todoInput = document.getElementById('todo-input');
const fetchTodosButton = document.getElementById('fetch-todos');
const todoList = document.getElementById('todo-list');
const todoCount = document.getElementById('todo-count');
const addTodoForm = document.getElementById('add-todo-form');
const newTodoInput = document.getElementById('new-todo-input');
const searchInput = document.getElementById('search-input');

let todos = [];

function renderTodos(todosToRender) {
todoList.innerHTML = '';

// header row
const headerRow = document.createElement('li');
headerRow.className = 'todo-item header';
const header_id = document.createElement('span');
header_id.textContent = 'ID';
const header_description = document.createElement('span');
header_description.textContent = 'TODO Description';
const header_userId = document.createElement('span');
header_userId.textContent = 'User ID';
const header_status = document.createElement('span');
header_status.textContent = 'Status';
const header_actions = document.createElement('span');
header_actions.textContent = 'Actions';
headerRow.appendChild(header_id);
headerRow.appendChild(header_description);
headerRow.appendChild(header_userId);
headerRow.appendChild(header_status);
headerRow.appendChild(header_actions);
todoList.appendChild(headerRow);


(todosToRender || todos).forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = 'todo-item';

    // ID column
    const id = document.createElement('span');
    id.textContent = index + 1;

    // Description column
    const description = document.createElement('span');
    description.textContent = todo.text;

    // User ID column
    const userId = document.createElement('span');
    userId.textContent = todo.userId;

    // Status column
    const status = document.createElement('span');
    status.className = 'todo-status';
    status.textContent = todo.completed ? 'Completed' : 'Pending';

    // Actions column
    const actions = document.createElement('span');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-button';
    deleteButton.addEventListener('click', () => {
        deleteTodo(index);
    });
    actions.appendChild(deleteButton);

    // Checkbox 
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.className = 'checkbox';
    checkbox.addEventListener('change', () => {
        changeTodoStatus(index);
    });

    li.appendChild(id);
    li.appendChild(description);
    li.appendChild(userId);
    li.appendChild(status);
    li.appendChild(actions);
    li.appendChild(checkbox);
    todoList.appendChild(li);
});
}

function updateTodoCount() {
todoCount.textContent = todos.length;
}


function fetchTodos() {
fetch('https://dummyjson.com/todos')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch todos');
        }
        return response.json();
    })
    .then(data => {
        if (data && Array.isArray(data.todos)) {
            todos = data.todos.map(todo => ({
                id: todo.id,
                text: todo.todo,
                completed: todo.completed,
                userId: todo.userId
            }));
            renderTodos();
            updateTodoCount();
            
        } else {
            console.error('Invalid response format:', data);
        }
    })
    .catch(error => {
        console.error('Error fetching todos:', error);
    });
}




// Save todos to localStorage
function storeToLocalStorage() {
localStorage.setItem('todos', JSON.stringify(todos));
}

if (localStorage.getItem('todos')) {
todos = JSON.parse(localStorage.getItem('todos'));
renderTodos();
updateTodoCount();
}
//Add new TODO

addTodoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = newTodoInput.value.trim();
    if (text) {
        todos.push({ text, userId:1 });
        newTodoInput.value = '';

        renderTodos();
        updateTodoCount();
        storeToLocalStorage();

        //send a POST request to the dummy API
        fetch('https://dummyjson.com/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ todo: text, completed: false, userId: 1 })
        })
        .then(response => response.json())
        .then(data => console.log('New TODO added:', data))
        .catch(error => console.error('Error adding new TODO:', error));
    } else {
        alert('Please enter a valid todo.');
    }
});

// delete a todo

function deleteTodo(index) {
const delete_confirm = confirm('Are you sure you want to delete this TODO?');
if (delete_confirm) {
    todos.splice(index, 1);
    renderTodos();
    updateTodoCount();
    storeToLocalStorage();
}
}


// search todo

searchInput.addEventListener('keydown', () => {
    const search = searchInput.value.toLowerCase();
    const filtered = todos.filter(todo => todo.text.toLowerCase().includes(search));
    renderTodos(filtered);
});

// status

function changeTodoStatus(index) {
    todos[index].completed = !todos[index].completed;
    renderTodos();
    storeToLocalStorage();
}