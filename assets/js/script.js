// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    var timestamp = new Date().getTime();
    var random = Math.floor(Math.random() * 500);
    var taskId = 'task_' + timestamp + '_' + random;
    return taskId;


}

// Todo: create a function to create a task card
function createTaskCard(task) {
    console.log(task)
    
        console.log(task)
        const today = dayjs()
        const taskDate = dayjs(task.date)
        let dateClass = ""
        if (taskDate.isSame(today, "day")) {
            dateClass = "warn"
        }
        else if (taskDate.isBefore(today)) {
            dateClass = "late"
        }

        const taskCard = $('<div>').addClass(`card task-card draggable my-3 ${dateClass}`).attr('data-task-id', task.id);
        //const taskCard = document.createElement('div'); taskCard.classList.add('task-card' ,`${dateClass}` );
       //taskCard.id = task[i].id
        const titleElement = $('<h3>').addClass('card-header').text(task.title);
        const descriptionElement = $('<p>').text(task.description);
        const dateElement = $('<p>').text(task.date);

        const deleteButton = $('<button>').text('Delete').addClass('delete-button').attr('data-task-id',task.id);
        deleteButton.on('click', handleDeleteTask)
        taskCard.append(titleElement, descriptionElement,dateElement, deleteButton)

        return taskCard

    }
    




// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
    taskList.forEach(task => {
        
        switch (task.lane) {
            case "to-do":
                $("#todo-cards").append(createTaskCard(task))
                break;
            case "in-progress":
                $("#in-progress-cards").append(createTaskCard(task))
                break;
            case "done":
                $("#done-cards").append(createTaskCard(task))
                break
        }
         
  $('.draggable').draggable({
    opacity: 0.7,
    zIndex: 100,

    helper: function (e) {
      
      const original = $(e.target).hasClass('ui-draggable')
        ? $(e.target)
        : $(e.target).closest('.ui-draggable');
      
      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });
    })
}


// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault()
    const taskTitle = $("#task-title").val()
    const datePicker = $("#datepicker").val()
    const taskDescription = $("#task-description").val()
    const taskLane = "to-do"
    const newTask = {
        id: generateTaskId(),
        title: taskTitle,
        date: datePicker,
        description: taskDescription,
        lane: taskLane

    }
    taskList.push(newTask)
    localStorage.setItem("tasks", JSON.stringify(taskList))
    createTaskCard(taskList)
    renderTaskList()
    $('#formModal').modal('hide');
    $('#task-title').val('');
    $('#datepicker').val('');
    $('#task-description').val('');
    document.location.reload()
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    const taskID = $(this).attr('data-task-id');
    const taskArray = JSON.parse(localStorage.getItem("tasks")) || [];
    taskArray.forEach(task =>{
        if(task.id === taskID){
            taskArray.splice(taskArray.indexOf(task),1)
        }
    })
    localStorage.setItem('tasks', JSON.stringify(taskArray))
    renderTaskList()
    document.location.reload

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskArray = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskID = ui.draggable[0].dataset.taskId;
    const newStatus = event.target.id;
    for (let task of taskArray){
        if(task.id === taskID){
            task.lane = newStatus
        }
    }
    localStorage.setItem('tasks', JSON.stringify(taskArray))
    renderTaskList()
    document.location.reload()

}


// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    $("#saveTask").on("click", handleAddTask)
    renderTaskList();
});

// $('.task-card').draggable({
//     revert:'invalid',
//     contaiment: 'document',
// });

//  Make lanes droppable
$('.lane').droppable({
    accept: '.draggable',
    drop: handleDrop,
});

