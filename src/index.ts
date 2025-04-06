  import { create } from 'canvas-confetti';
  import {v4 as uuidV4} from 'uuid'

  // Removed unused import for "canvas-confetti"

  type Task = {
    id : string, 
      title: string, 
      body: string,
      completed: boolean, 
      createdAt: Date

  }

  let tasks: Task[] = [];
  localStorage.setItem('Tasks', JSON.stringify(tasks)); // Save updated tasks to localStorage


 
  const form = document.querySelector('#new-task-form') as HTMLFormElement | null;
  const list = document.querySelector<HTMLUListElement>('#list');
  const title = document.querySelector<HTMLInputElement> ("#new-task-title");
  const body = document.querySelector<HTMLInputElement> ("#new-task-body");
  const emptyState = document.querySelector<HTMLDivElement>(".empty-state");


  form?.addEventListener('submit', (e: SubmitEvent) => {
    e.preventDefault();


    if (title?.value == "" || title?.value == null ) return  
    if (body?.value == "" || body?.value == null ) return  
    
    const newTask ={
      id :uuidV4(),
      title: title.value,
      body : body.value , 
      completed: false, 
      createdAt : new Date()
    }

    tasks.push(newTask);
    localStorage.setItem('Tasks', JSON.stringify(tasks)); // Save updated tasks to localStorage

    loadTasks();

    title.value = "";
    body.value = "";


  });

  list?.addEventListener('click', function(e) {
    const taskItem = (e.target as Element)?.closest('.task-item');
    //take the closest task to the place where the user clicked
    
    if (!taskItem) return;
    
    const taskId = taskItem.getAttribute('id');

    
    
    // Handle edit button click
    if ((e.target as Element)?.closest('.btn-edit')) {
        enableEditMode(taskItem, taskId);
    }
    // handle checkbox click
    if ((e.target as Element)?.closest('input[type="checkbox"]')) {
      const checkbox = e.target as HTMLInputElement;
      const task = tasks.find(t => t.id === taskId);

      if (task) {
        task.completed = !task.completed;
        localStorage.setItem('Tasks', JSON.stringify(tasks)); // Save updated tasks to localStorage
        loadTasks();
      }
    }

    
  });
  
  function loadTasks(){ 
    
    list?.replaceChildren(); 

    const taskJSON = localStorage.getItem('Tasks') ;
    

    if(taskJSON == null) return []
    //making the empty state invisible

    
    if (emptyState) {
      emptyState.style.display = 'none';
    }

    const taskes: Task[] = JSON.parse(taskJSON);

    for (let i = 0; i < taskes.length; i++) {
      
        showItem(taskes[i]); 
      
      
    }

  }

  function showItem(task:Task) {
  
    const item = document.createElement('li');
    item.id=task.id;
    item.className= "task-item "
    const textContainer = document.createElement('div');
    textContainer.className = "task-container";
    const buttonContainer = document.createElement('div');
    buttonContainer.className = "task-button-container";



    const title = document.createElement('input');
    title.className = "task-title";
    title.type = 'text';
    title.value = task.title;
    title.readOnly = true;
    title.style.textDecoration = task.completed ? 'line-through' : 'none';
    const body = document.createElement('input');
    body.className = "task-body";
    body.type = 'text';
    body.value = task.body;
    body.readOnly = true;
    body.style.textDecoration = task.completed ? 'line-through' : 'none';
    const editButton = document.createElement('button');
    editButton.className = "task-button btn-edit";
    editButton.innerText = "Edit";
    const deleteButton = document.createElement('button');
    deleteButton.className = "task-button btn-delete";
    deleteButton.innerText = "Delete";


    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed; // Set the checkbox state based on task completion
    

    textContainer.append(title, body);
    buttonContainer.append(editButton, deleteButton);
    item.append(checkbox, textContainer, buttonContainer);
    list?.append(item);


    deleteButton.addEventListener('click', () => {
      Delete(task);
    }

  );


  }

  function Delete(task: Task) {
    
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id == task.id) {
        tasks.splice(i, 1);
        localStorage.setItem('Tasks', JSON.stringify(tasks)); // Save updated tasks to localStorage
        loadTasks();
        break;
      }
    }
  }

 
  function enableEditMode(taskItem :Element, taskId: string | null) {

    const task = tasks.find(t => t.id === taskId);

    const currentTitle= task?.title;
    const currentBody= task?.body;

    const taskContent = taskItem.querySelector('.task-container');

      // Create edit form
      const editForm = document.createElement('div');
      editForm.className = 'task-container';

      const title = document.createElement('input');
      title.className = "task-title";
      title.type = 'text';
      title.value = currentTitle || '';
      title.readOnly = false;
      const body = document.createElement('input');
      body.className = "task-body";
      body.type = 'text';
      body.value = currentBody || '';
      body.readOnly = false;

      editForm.append(title, body);
      
      if (taskContent){
      taskItem.replaceChild(editForm, taskContent);
      }
      editForm.focus();

      // Create save 
      const saveButton = document.createElement('button');
      saveButton.className = "task-button ";
      saveButton.innerText = "Save";
      saveButton.addEventListener('click', () => {
        
        for (let i = 0; i < tasks.length;i++){
          if(tasks[i].id == taskId){
            tasks[i].title = title.value;
            tasks[i].body = body.value;
          }

        } 
        localStorage.setItem('Tasks', JSON.stringify(tasks)); // Save updated tasks to localStorage
        loadTasks();
      }
      );
     

      // Create cancel button
       
       const cancel = document.createElement('button');
       cancel.className = "task-button cancel-button";
       cancel.innerText = "cancel";
       cancel.addEventListener('click', () => {
         
         loadTasks();
       }
       );

       const buttonContainer = document.createElement('div');
       buttonContainer.className = "task-button-container";
       buttonContainer.append(saveButton,cancel);


       //replaceing the buttons with the new buttons
        const buttonContent = taskItem.querySelector('.task-button-container');
       if (buttonContent) {
           taskItem.replaceChild(buttonContainer , buttonContent);
       }



  }
