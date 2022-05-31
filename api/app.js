// Differences between SQL and MongoDB described well in this link: https://www.freecodecamp.org/news/introduction-to-mongoose-for-mongodb-d2a7aa593c57/
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { mongoose } = require('./db/mongoose')

// Load in the mongoose models.
const { List, Task, User } = require('./db/models')



/** =============== MIDDLEWARE =============== */

// Load Middlewear.
app.use(bodyParser.json())

// CORS Headers Middlewear.
app.use(function(request, response, next) {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE')
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})

// Verify Refresh Token Middleware (which will be verifying the session).
let verifySession = (request, response, next) => {
    // Grab the refresh token from the request header.
    let refreshToken = request.header('x-refresh-token')

    // Grab the _id from the request header.
    let _id = request.header('_id')

    User
        .findByIdAndToken(_id, refreshToken)
        .then((user) => {
            if (!user) {
                // User couldn't be found.
                return Promise.reject({ error: 'User not found. Make sure the Refresh Token and User ID are correct.' })
            }

            // If the code reaches past the if statement above, the user was found.
            // Therefore, the Refresh Token exists in the database, but we still have to check if it has expired or not.

            request.user_id = user._id
            request.userObject = user
            request.refreshToken = refreshToken

            let isSessionValid = false

            user.sessions.forEach((session) => {
                if (session.token === refreshToken) {
                    // Check if the session has expired.
                    if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
                        // Refresh Token has not expired.
                        isSessionValid = true
                    }
                }
            })

            if (isSessionValid) {
                // The session IS valid. Call next() to continue with processing this web request.
                next()
            } else {
                // The session IS NOT valid.
                return Promise.reject({ error: 'Refresh Token has expired or the session is invalid.' })
            }
        })
        .catch((error) => {
            response.status(401).send(error)
        })
}

/** ============= END MIDDLEWARE ============= */



/** ============= ROUTE HANDLERS ============= */
/** ========== STARTING LIST ROUTES ========== */

// GET: /lists  ||  Purpose: Get all lists.
app.get('/lists', (request, response) => {
    // Returns an array of all the lists that belong to the authenticated user.
    List
        .find({})
        .then((lists) => {
            response.send(lists)
        })
        .catch((error) => {
            console.log('An error has occurred for app.GET(/lists). ' + error)
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
            console.log('An error has occurred for app.POST(/lists). ' + error)
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
            console.log('An error has occurred for app.PATCH(/lists/:id). ' + error)
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
            console.log('An error has occurred for app.DELETE(/lists/:id). ' + error)
            response.send(error)
        })
})

/** =========== ENDING LIST ROUTES =========== */



/** ========== STARTING TASK ROUTES ========== */

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
            console.log('An error has occurred for app.GET(/lists/:listId/tasks). ' + error)
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
            console.log('An error has occurred for app.POST(/lists/:listId/tasks). ' + error)
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
            //response.sendStatus(200) // This was and will prevent changing a tasks state from not completed to completed when clicking on it.
            response.send({ message: 'Updated successfully.' })
        })
        .catch((error) => {
            console.log('An error has occurred for app.PATCH(/lists/:listId/tasks/:taskId). ' + error)
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
            console.log('An error has occurred for app.DELETE(/lists/:listId/tasks/:taskId). ' + error)
            response.send(error)
        })
})

/** =========== ENDING TASK ROUTES =========== */



/** ========== STARTING USER ROUTES ========== */

// POST: /users  ||  Purpose: Signing up.
app.post('/users', (request, response) => {
    let body = request.body
    let newUser = new User(body)

    newUser
        .save()
        .then(() => {
            return newUser.createSession()
        })
        .then((refreshToken) => {
            // Session created successfully, refreshToken returned.
            // Now, we generate an access auth token for the user.
            return newUser
                .generateAccessAuthToken()
                .then((accessToken) => {
                    // Access auth token generated successfully.
                    // Now, we return an object containing the auth tokens.
                    return { accessToken, refreshToken }
                })
        })
        .then((authTokens) => {
            // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body.
            response
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(newUser)
        })
        .catch((error) => {
            console.log('An error has occurred for app.POST(/users). ' + error)
            response.status(400).send(error)
        })
})

// POST: /users/signin  ||  Purpose: Signing in.
app.post('/users/signin', (request, response) => {
    let email = request.body.email
    let password = request.body.password

    User
        .findByCredentials(email, password)
        .then((user) => {
            return user
                .createSession()
                .then((refreshToken) => {
                    // Session created successfully, refreshToken returned.
                    // Now we generate an access auth token for the user.
                    return user
                        .generateAccessAuthToken()
                        .then((accessToken) => {
                            // Access auth token generated successfully.
                            // Now we return an object containing the auth tokens.
                            return { accessToken, refreshToken }
                        })
                })
                .then((authTokens) => {
                    // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body.
                    response
                        .header('x-refresh-token', authTokens.refreshToken)
                        .header('x-access-token', authTokens.accessToken)
                        .send(user)
                })
        })
        .catch((error) => {
            console.log('An error has occurred for app.POST(/users/signin). ' + error)
            response.status(400).send(error)
        })
})

// GET: /users/me/access-token  ||  Purpose: Generates and returns an access token.
app.get('/users/me/access-token', verifySession, (request, response) => {
    // We know that the User/Caller is authenticated and we have the user_id and user object available to us.
    request.userObject
        .generateAccessAuthToken()
        .then((accessToken) => {
            response.header('x-access-token', accessToken).send({ accessToken })
        })
        .catch((error) => {
            console.log('An error has occurred for app.GET(/users/me/access-token). ' + error)
            response.status(400).send(error)
        })
})

/** =========== ENDING USER ROUTES =========== */


app.listen(3000, () => {
    console.log('Server is listening on localhost:3000')
})

