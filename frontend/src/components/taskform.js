import React, { useState } from 'react';
import { addTask } from '/api/tasksapi';

const TaskForm = ({ onTaskAdded }) => {
    const [title, setTitle] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newTask = await addTask(title);
            onTaskAdded(newTask);
            setTitle(''); // Clear input field
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task"
                required
            />
            <button type="submit">Add Task</button>
        </form>
    );
};

export default TaskForm;
