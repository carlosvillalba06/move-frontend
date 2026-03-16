import React from "react";

const TaskCard = ({ task }) => {

  return (
    <div className="task-card">
      {task.title}
    </div>
  );

};

export default TaskCard;