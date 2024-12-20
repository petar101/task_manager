import React, { useEffect, useState } from 'react';
import TaskForm from './components/taskform';
import TaskList from './components/tasklist';

const App = () => {
    const [tasks, setTasks] = useState([]);

    const addTaskToList = (newTask) => {
        setTasks([...tasks, newTask]);
    };

    const updateTaskInList = (updatedTask) => {
        setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
    };

    const deleteTaskFromList = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    return (
        <div>
            <h1>Task Manager</h1>
            <TaskForm onTaskAdded={addTaskToList} />
            <TaskList
                tasks={tasks}
                onTaskUpdated={updateTaskInList}
                onTaskDeleted={deleteTaskFromList}
            />
        </div>
    );
};

export default App;

