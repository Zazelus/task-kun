const express = require('express');
const app = express();

const { mongoose } = require('./db/mongoose');

const bodyParser = require('body-parser');

// Loading mongoose models
const { List, Task } = require('./db/models');

// Load middleware
app.use(bodyParser.json());

// CORS headers middleware
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/* ROUTE HANDLERS */

/* LIST ROUTES */

/**
 * GET /lists
 * Purpose: Get all lists.
 */
app.get('/lists', (req, res) => {
    // Want to return an array of all the lists in the database.
    List.find({}).then((lists) => {
        res.send(lists);
    });
});

/**
 * POST /lists
 * Purpose: Create a list.
 */
app.post('/lists', (req, res) => {
    //We want to create a new list and return the new list document back to the user, including the id).
    // The list information (fields) will be passed in via JSON request body.
    let title = req.body.title;
    let newList = new List({
        title
    });
    newList.save().then((listDoc) => {
        // The full list document is returned, including id.
        res.send(listDoc);
    })
});

/**
 * PATH /lists/:id
 * Purpose: Update a specified list.
 */
app.patch('/lists/:id', (req, res) => {
    // We want to update the specified list (list document with id in the URL) with the new values specified in the JSON body of the request.
    List.findOneAndUpdate({ _id: req.params.id }, {
        $set: req.body
    }).then(() => {
        res.sendStatus(200);
    });
});

/**
 * DELETE /lists/:id
 * Purpose: Delete a list.
 */
app.delete('/lists/:id', (req, res) => {
    // We want to delete the specified list (document with id in the URL).
    List.findOneAndRemove({ _id: req.params.id }).then((removedListDoc) => {
        res.send(removedListDoc);
    });
});

/**
 * GET /lists/:listId/tasks
 * Purpose: Get all tasks in a specific list.
 */
app.get('/lists/:listId/tasks', (req, res) => {
    // We want to return all tasks that belong to a specific list, specified by listId.
    Task.find({
        _listId: req.params.listId
    }).then((tasks) => {
        res.send(tasks);
    })
});

/** app.get('/lists/:listId/tasks/:taskId', (req, res) => {
    Task.findOne({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((task) => {
        res.send(task);
    })
})*/


/**
 * POST /lists/:listId/tasks
 * Purpose: Create a new task in a specific list.
 */
app.post('/lists/:listId/tasks', (req, res) => {
    // We want to create a new task in a list specified by its listId
    let newTask = new Task({
        title: req.body.title,
        _listId: req.params.listId
    });
    newTask.save().then((newTaskDoc) => {
        res.send(newTaskDoc);
    })
});

/**
 * PATCH /lists/:listId/tasks/:taskId
 * Purpose: Update an existing task.
 */
app.patch('/lists/:listId/tasks/:taskId', (req, res) => {
    // We want to update an existing task specified by its taskId.
    Task.findOneAndUpdate({
        _id: req.params.taskId,
        _listId: req.params.listId
    }, {
        $set: req.body
        }
    ).then(() => {
        res.sendStatus(200);
    })
});

/**
 * DELETE /lists/:listId/tasks/:taskId
 * Purpose: Delete a task.
 */
app.delete('/lists/:listId/tasks/:taskId', (req, res) => {
    // We want to create a new task in a list specified by its listId
    Task.findOneAndRemove({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((removedTaskDoc) => {
        res.send(removedTaskDoc);
    })
});

app.listen(3000, () => {
    console.log("Server is listening on port 3000.");
});