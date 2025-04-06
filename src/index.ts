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




const list = document.querySelector<HTMLUListElement>('#list');
const form = document.querySelector('#new-task-form') as HTMLFormElement | null;
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

 
function loadTasks(){ 
  console.log(tasks.length);
  list?.replaceChildren(); 

  const taskJSON = localStorage.getItem('Tasks') ;
  console.log(taskJSON);

  if(taskJSON == null) return []
  //making the empty state invisible

  
  if (emptyState) {
    emptyState.style.display = 'none';
  }

  const taskes: Task[] = JSON.parse(taskJSON);

  for (let i = 0; i < taskes.length; i++) {
    console.log(taskes[i].title);
      showItem(taskes[i]); 
    
    
  }

}


function showItem(task:Task) {
  console.log("it has invoked the addListItem function");
  const item = document.createElement('li');
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
  const body = document.createElement('input');
  body.className = "task-body";
  body.type = 'text';
  body.value = task.body;
  body.readOnly = true;
  const editButton = document.createElement('button');
  editButton.className = "task-button";
  editButton.innerText = "Edit";
  const deleteButton = document.createElement('button');
  deleteButton.className = "task-button";
  deleteButton.innerText = "Delete";


  const checkbox = document.createElement('input');
  
  checkbox.type = 'checkbox';


  textContainer.append(title, body);
  buttonContainer.append(editButton, deleteButton);
  item.append(checkbox, textContainer, buttonContainer);
  list?.append(item);

  checkbox.addEventListener('change', () =>{
    task.completed= checkbox.checked;//checkbox.checked returns true or false
    loadTasks();

  });
  deleteButton.addEventListener('click', () => {
    Delete(task);
  }
  
);

}

function Delete(task: Task) {
  console.log("it has invoked the delete function");

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == task.id) {
      tasks.splice(i, 1);
      localStorage.setItem('Tasks', JSON.stringify(tasks)); // Save updated tasks to localStorage
      loadTasks();
      break;
    }
  }
}


