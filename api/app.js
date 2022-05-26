// Differences between SQL and MongoDB described well in this link: https://www.freecodecamp.org/news/introduction-to-mongoose-for-mongodb-d2a7aa593c57/
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { mongoose } = require('./db/mongoose')

// Load in the mongoose models.
//const { List, Task } = require('./db/models')
const { List } = require('./db/models/list.model')
const { Task } = require('./db/models/task.model')


/** =============== MIDDLEWARE =============== **/

// Load Middlewear.
app.use(bodyParser.json())

// CORS Headers Middlewear.
app.use(function(request, response, next) {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})

/** ============= END MIDDLEWARE ============= **/



/** ============= ROUTE HANDLERS ============= **/
/** ========== STARTING LIST ROUTES ========== **/

// GET: /lists  ||  Purpose: Get all lists.
app.get('/lists', (request, response) => {
    // Returns an array of all the lists that belong to the authenticated user.
    List
        .find({})
        .then((lists) => {
            response.send(lists)
        })
        .catch((error) => {
            console.log('An error has occurred for app.GET(/lists).')
            response.send(error)
        })
})

// POST: /lists  ||  Purpose: Create a list.
app.post('/lists', (request, response) => {
    // Creates a new list and return the new list back to the user.
    // The list information (fields) will be passed in via the JSON request body.
    let title = request.body.title

    let newList = new List({
        title
    })
    newList
        .save()
        .then((listDocument) => {
        // The full list document is returned.
        response.send(listDocument)
        })
        .catch((error) => {
            console.log('An error has occurred for app.POST(/lists).')
            response.send(error)
        })
})

// PATCH: /lists/:id  ||  Purpose: Update a list.
app.patch('/lists/:id', (request, response) => {
    // Updates (a.k.a. patches) the specified list.
    List
        .findOneAndUpdate({
            _id: request.params.id
        }, {
            $set: request.body
        })
        .then(() => {
            response.sendStatus(200)
        })
        .catch((error) => {
            console.log('An error has occurred for app.PATCH(/lists/:id).')
            response.send(error)
        })
})

// DELETE: /lists/:id  ||  Purpose: Delete a list.
app.delete('/lists/:id', (request, response) => {
    // Deletes the specified list.
    List
        .findOneAndRemove({
            _id: request.params.id
        })
        .then((removedListDocument) => {
            response.send(removedListDocument)
        })
        .catch((error) => {
            console.log('An error has occurred for app.DELETE(/lists/:id).')
            response.send(error)
        })
})

/** =========== ENDING LIST ROUTES =========== **/



/** ========== STARTING TASK ROUTES ========== **/

// GET /lists/:listId/task  ||  Purpose: Get all tasks in a specific list.
app.get('/lists/:listId/tasks', (request, response) => {
    // Returns all tasks that belong to a specific list.
    Task
        .find({
            _listId: request.params.listId
        })
        .then((tasks) => {
            response.send(tasks)
        })
        .catch((error) => {
            console.log('An error has occurred for app.GET(/lists/:listId/tasks).')
            response.send(error)
        })
})

// POST: /lists/:listId/tasks  ||  Purpose: Create a new task in a specific list.
app.post('/lists/:listId/tasks', (request, response) => {
    // Creates a new task within a list specified by listId.
    let newTask = new Task({
        title: request.body.title,
        _listId: request.params.listId
    })
    newTask
        .save()
        .then((newTaskDocument) => {
            response.send(newTaskDocument)
        })
        .catch((error) => {
            console.log('An error has occurred for app.POST(/lists/:listId/tasks).')
            response.send(error)
        })

})

// PATCH: /lists/:listId/tasks/:taskId  ||  Purpose: Update an existing task.
app.patch('/lists/:listId/tasks/:taskId', (request, response) => {
    // Updates an existing task.
    Task
        .findOneAndUpdate({
            _id: request.params.taskId,
            _listId: request.params.listId
        }, {
            $set: request.body
        })
        .then(() => {
            response.sendStatus(200)
        })
        .catch((error) => {
            console.log('An error has occurred for app.PATCH(/lists/:listId/tasks/:taskId).')
            response.send(error)
        })
})

// DELETE: /lists/:listId/tasks/:taskId  ||  Purpose: Delete a task.
app.delete('/lists/:listId/tasks/:taskId', (request, response) => {
    Task
        .findOneAndRemove({
            _id: request.params.taskId,
            _listId: request.params.listId
        })
        .then((removedTaskDocument) => {
            response.send(removedTaskDocument)
        })
        .catch((error) => {
            console.log('An error has occurred for app.DELETE(/lists/:listId/tasks/:taskId).')
            response.send(error)
        })
})

/** =========== ENDING TASK ROUTES =========== **/



/** ========== STARTING USER ROUTES ========== **/



/** =========== ENDING USER ROUTES =========== **/


app.listen(3000, () => {
    console.log('Server is listening on localhost:3000')
})

