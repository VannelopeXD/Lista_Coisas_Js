document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const todosContainer = document.querySelector('.todos-container');
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('.empty-image');
    const progressBar = document.getElementById('progress');
    const progressNumbers = document.getElementById('numbers');
  
    const updateProgress = (checkCompletion = true) => {
      const totalTasks = taskList.children.length;
      const completedTasks = taskList.querySelectorAll('.checkbox:checked').length;
  
      progressBar.style.width = totalTasks ? `${(completedTasks / totalTasks) * 100}%` : '0%';
      progressNumbers.textContent = `${completedTasks} / ${totalTasks}`;
  
      if (checkCompletion && totalTasks > 0 && completedTasks === totalTasks) {
        Confetti();
      }
    };
  
    const toggleEmptyState = () => {
      emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
      todosContainer.style.width = taskList.children.length > 0 ? '100%' : '50%';
    };
  
    const saveTasksToLocalStorage = () => {
      const tasks = Array.from(taskList.querySelectorAll('li')).map(li => ({
        text: li.querySelector('span').textContent,
        completed: li.querySelector('.checkbox').checked
      }));
      localStorage.setItem('tasks', JSON.stringify(tasks));
    };
  
    const loadTasksFromLocalStorage = () => {
      const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
      savedTasks.forEach(({ text, completed }) => addTask(text, completed, false));
      toggleEmptyState();
      updateProgress(); // Check for completion during initial load
    };
  
    const addTask = (text, completed = false, checkCompletion = true) => {
      const taskText = text || taskInput.value.trim();
      if (!taskText) {
        return;
      }
  
      const li = document.createElement('li');
      li.innerHTML = `
        <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''} />
        <span>${taskText}</span>
        <div class="task-buttons">
          <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
          <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
        </div>
      `;
  
      const checkbox = li.querySelector('.checkbox');
      const editBtn = li.querySelector('.edit-btn');
  
      if (completed) {
        li.classList.add('completed');
        editBtn.disabled = true;
        editBtn.style.opacity = '0.5';
        editBtn.style.pointerEvents = 'none';
      }
  
      checkbox.addEventListener('change', () => {
        const isChecked = checkbox.checked;
        li.classList.toggle('completed', isChecked);
        editBtn.disabled = isChecked;
        editBtn.style.opacity = isChecked ? '0.5' : '1';
        editBtn.style.pointerEvents = isChecked ? 'none' : 'auto';
        saveTasksToLocalStorage();
        updateProgress();
      });
  
      editBtn.addEventListener('click', () => {
        if (!checkbox.checked) {
          taskInput.value = li.querySelector('span').textContent;
          li.remove();
          toggleEmptyState();
          updateProgress(false); // Do not check for completion during edit
          saveTasksToLocalStorage();
        }
      });
  
      li.querySelector('.delete-btn').addEventListener('click', () => {
        li.remove();
        toggleEmptyState();
        updateProgress();
        saveTasksToLocalStorage();
      });
  
      taskList.appendChild(li);
      if (!text) taskInput.value = '';
      toggleEmptyState();
      updateProgress(checkCompletion);
      saveTasksToLocalStorage();
    };
  
    addTaskBtn.addEventListener('click', () => addTask());
    taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addTask();
    });
  
    loadTasksFromLocalStorage();
  });
  
  const Confetti = () => {
    const count = 100;
    const defaults = { origin: { y: 1 } };
  
    function fire(particleRatio, opts) {
      confetti(Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      }));
    }
  
    let y = 1;
    const interval = setInterval(() => {
      fire(0.2, { spread: 60, startVelocity: 30, scalar: 0.8, origin: { y } });
      fire(0.1, { spread: 120, startVelocity: 55, scalar: 1.2 });
      y -= 0.05;
      if (y <= 0.3) clearInterval(interval);
    }, 8);
  };