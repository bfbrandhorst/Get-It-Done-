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
    const taskCardList = []
    for (var i = 0; i < task.length; i++) {
        console.log(task[i])
        const today = dayjs()
        const taskDate = dayjs(task[i].date)
        let dateClass = ""
        if (taskDate.isSame(today, "day")) {
            dateClass = "warn"
        }
        else if (taskDate.isBefore(today)) {
            dateClass = "late"
        }

        
        const taskCard = document.createElement('div'); taskCard.classList.add('task-card' ,`${dateClass}` );
       //taskCard.id = task[i].id
        const titleElement = document.createElement('h3'); titleElement.textContent = task[i].title;
        const descriptionElement = document.createElement('p'); descriptionElement.textContent = task[i].description;
        const dateElement = document.createElement('p'); dateElement.textContent = task[i].date;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Delete";
        deleteButton.classList.add('delete-button');

        taskCard.appendChild(titleElement);
        taskCard.appendChild(descriptionElement);
        taskCard.appendChild(dateElement);
        taskCard.appendChild(deleteButton);
        const cardEl = $(taskCard);
        taskCardList.push(cardEl)

    }
    return taskCardList
}



// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    taskList.forEach(task => {
        const taskCardEl = createTaskCard([task])[0]
        switch (task.lane) {
            case "to-do":
                $("#todo-cards").append(taskCardEl)
                break;
            case "in-progress":
                $("#in-progress-cards").append(taskCardEl)
                break;
            case "done":
                $("#done-cards").append(taskCardEl)
                break
        }
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
    taskCardEl.parentNode.remove();

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    event.preventDefault();
    const cardID=ui.draggable.attr('id')
    const newLane = $(this).attr('id')
    const startingCardPoint = $(`#${cardID}`)
    $(this).append(startingCardPoint)


    const tasks = taskList.find(task => task.id === cardID)
    if(tasks){
        tasks.lane = newLane
        localStorage.setItem('tasks', JSON.stringify(tasks))
        document.location.reload()
    }

}


// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    $("#saveTask").on("click", handleAddTask)
    renderTaskList()
});

$('.task-card').draggable({
    revert:'invalid',
    contaiment: 'document',
})

//  Make lanes droppable
$('.lane').droppable({
    accept: '.draggable',
    drop: handleDrop,
});

