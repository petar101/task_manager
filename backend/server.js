const express = require('express');
const { Pool } = require('pg'); // PostgreSQL library
const app = express();
const PORT = 5000;

// This adds Express.js (toolbox) to the server.
// It makes it active in the "app".
app.use(express.json()); // Middleware to parse JSON

// Create a pool to connect to the PostgreSQL database
const pool = new Pool({
    user: 'petar', // Your PostgreSQL username
    host: 'localhost', // The database is hosted locally
    database: 'task_manager', // Name of the database
    password: 'password', // Your database password
    port: 5432, // Default PostgreSQL port
});

// To communicate with the database, you need an "access pass" 
// that the pool uses to connect to the database.

// Test route to check if the server is running
app.get('/', (req, res) => {
    res.send('Task Manager Backend is Running');
});

// 1. Get all tasks
// This is a GET request that returns all the tasks from the database to the frontend.
// It uses the pool to connect to the database and the query to get the tasks.
app.get('/api/tasks', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tasks'); // Fetch all tasks
        res.json(result.rows); // Send tasks as JSON to the frontend
    } catch (err) {
        console.error(err.message); // Log any errors
        res.status(500).send('Server Error'); // Send a 500 status for server errors
    }
});

// 2. Add a new task
// This is a POST request that allows the frontend to add new tasks to the database.
app.post('/api/tasks', async (req, res) => {
    const { title } = req.body; // Get the title of the task from the request body

    if (!title) {
        // If no title is provided, send a 400 error
        return res.status(400).json({ message: 'Task title is required' });
    }

    try {
        // Add the task to the database and return the new task
        const result = await pool.query(
            'INSERT INTO tasks (title, completed) VALUES ($1, $2) RETURNING *',
            [title, false]
        );
        res.status(201).json(result.rows[0]); // Return the created task
    } catch (err) {
        console.error(err.message); // Log any errors
        res.status(500).send('Server Error'); // Send a 500 status for server errors
    }
});

// 3. Update a task (mark as completed)
// This is a PUT request that updates a specific task in the database.
app.put('/api/tasks/:id', async (req, res) => {
    const { id } = req.params; // Get the task ID from the request parameters
    const { completed } = req.body; // Get the "completed" status from the request body

    if (completed === undefined) {
        // If "completed" is not provided, send a 400 error
        return res.status(400).json({ message: 'Completed status is required' });
    }

    try {
        // Update the task in the database and return the updated task
        const result = await pool.query(
            'UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *',
            [completed, id]
        );

        if (result.rows.length === 0) {
            // If no task is found with the given ID, send a 404 error
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(result.rows[0]); // Return the updated task
    } catch (err) {
        console.error(err.message); // Log any errors
        res.status(500).send('Server Error'); // Send a 500 status for server errors
    }
});

// 4. Delete a task
// This is a DELETE request that removes a specific task from the database.
app.delete('/api/tasks/:id', async (req, res) => {
    const { id } = req.params; // Get the task ID from the request parameters

    try {
        // Delete the task from the database
        const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            // If no task is found with the given ID, send a 404 error
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(204).send(); // Send a 204 status (No Content) for successful deletion
    } catch (err) {
        console.error(err.message); // Log any errors
        res.status(500).send('Server Error'); // Send a 500 status for server errors
    }
});

// Start the server on the defined port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
