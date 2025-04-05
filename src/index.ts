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
const taskes : Task[] = loadTasks();
taskes.forEach(addListItem);


//console.log(uuidv4());
const list = document.querySelector<HTMLUListElement>('#list');
const form = document.querySelector('#new-task-form') as HTMLFormElement | null;
const title = document.querySelector<HTMLInputElement> ("#new-task-title");
const body = document.querySelector<HTMLInputElement> ("#new-task-body");



 form?.addEventListener('submit', (e: SubmitEvent) => {
  e.preventDefault();
  console.log("it has invoked the event ");
  console.log(title?.value);
  if (title?.value == "" || title?.value == null ) return  
  if (body?.value == "" || body?.value == null ) return  
  
  const newTask ={
    id :uuidV4(),
    title: title.value,
    body : body?.value || "", 
    completed: false, 
    createdAt : new Date()
  }
  tasks.push(newTask)
  savetasks()

  addListItem(newTask);
  title.value = "";
  body.value = "";


 });

function addListItem(task:Task) {
  console.log("it has invoked the addListItem function");
  const item = document.createElement('li');
  const label = document.createElement('label');
  const checkbox = document.createElement('input');
  checkbox.addEventListener('change', () =>{
    task.completed= checkbox.checked;
    saveTasks()

  })

  checkbox.type = 'checkbox';
  label.append(checkbox, task.title,task.body);
  item.append(label);
  list?.append(item);

}
function saveTasks(){ 
  localStorage.setItem('Tasks', JSON.stringify(tasks));
  

}
function loadTasks(): Task[]{ 
  const taskJSON = localStorage.getItem('Tasks') 
  if(taskJSON == null) return []
  return JSON.parse(taskJSON) 
}