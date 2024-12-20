import React from 'react';
import { updateTask, deleteTask } from '/api/tasksapi';

const TaskItem = ({ task, onTaskUpdated, onTaskDeleted }) => {
    const handleComplete = async () => {
        try {
            const updatedTask = await updateTask(task.id, true);
            onTaskUpdated(updatedTask);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteTask(task.id);
            onTaskDeleted(task.id);
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <li>
            {task.title} {task.completed ? '(Completed)' : ''}
            {!task.completed && (
                <button onClick={handleComplete}>Complete</button>
            )}
            <button onClick={handleDelete}>Delete</button>
        </li>
    );
};

export default TaskItem;
