import React, { createContext, useState } from 'react';

export const TaskContext = createContext();

const TaskProvider = ({children}) => {

    const [task, setTask] = useState('');
    const [editTask,setEditTask]=useState(false);

  return (
    <TaskContext.Provider value={{ task, setTask,editTask,setEditTask }}>
        {children}
      </TaskContext.Provider>
  )
}

export default TaskProvider