import { useState } from "react";

const DailyProgress = () => {
  const [tasks, setTasks] = useState(0);
  const [completed, setCompleted] = useState(0);

  const handleSave = () => {
    const progress = {
      date: new Date().toLocaleDateString(),
      total_tasks: tasks,
      tasks_completed: completed,
      attendance_status: completed > 0,
    };
    localStorage.setItem("dailyProgress", JSON.stringify(progress));
    alert("Daily progress saved!");
  };

  return (
    <div className="card p-4 shadow-sm mb-4">
      <h5 className="fw-bold text-info mb-3">Daily Progress</h5>
      <input
        type="number"
        placeholder="Total Tasks"
        className="form-control mb-2"
        value={tasks}
        onChange={(e) => setTasks(e.target.value)}
      />
      <input
        type="number"
        placeholder="Completed Tasks"
        className="form-control mb-2"
        value={completed}
        onChange={(e) => setCompleted(e.target.value)}
      />
      <button className="btn btn-info w-100" onClick={handleSave}>
        Save Progress
      </button>
    </div>
  );
};

export default DailyProgress;
