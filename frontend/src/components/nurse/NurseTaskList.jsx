import { useEffect, useState } from "react";
import { nurseTaskService } from "../../services/nurseTaskService";
import { useNavigate } from "react-router-dom";

const NurseTasksList = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    nurseTaskService.getNurseTasks().then((res) => {
      setTasks(res.data);
      setLoading(false);
    });
  }, []);

  const markDone = async (id) => {
    await nurseTaskService.completeTask(id);
    setTasks((tasks) =>
      tasks.map((t) => (t.id === id ? { ...t, completed: true } : t))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">My Tasks</h2>
        <button
          onClick={() => navigate("/dashboard/nurse/tasks/new")}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-white font-medium"
        >
          + Add Task
        </button>
      </div>

      {loading ? (
        <div className="py-8 text-gray-400">Loading...</div>
      ) : tasks.length === 0 ? (
        <div className="py-8 text-gray-400">No tasks for today.</div>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`bg-gray-800 p-4 rounded-xl flex justify-between items-center ${
                task.completed ? "opacity-50" : ""
              }`}
            >
              <span>
                <strong>{task.scheduled_time}</strong> — {task.title} (
                {task.patient_name})
              </span>
              {!task.completed && (
                <button
                  className="bg-blue-600 px-3 py-1 rounded text-white"
                  onClick={() => markDone(task.id)}
                >
                  Mark as Done
                </button>
              )}
              {task.completed && <span className="text-green-400">Done</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default NurseTasksList;
