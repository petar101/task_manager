import React, { useEffect, useState } from 'react';
import { getTasks } from '/api/tasksapi';
import TaskItem from './TaskItem';

const TaskList = ({ onTaskUpdated, onTaskDeleted }) => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await getTasks();
                setTasks(data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks();
    }, []);

    return (
        <ul>
            {tasks.map(task => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onTaskUpdated={onTaskUpdated}
                    onTaskDeleted={onTaskDeleted}
                />
            ))}
        </ul>
    );
};

export default TaskList;
