import api from "./api";

export const nurseTaskService = {
  getNurseTasks: () => api.get("/nurse-tasks/tasks/my-tasks/"), // Only nurse's tasks
  completeTask: (taskId) =>
    api.patch(`/nurse-tasks/tasks/${taskId}/`, { completed: true }),
  createTask: (data) => api.post("/nurse-tasks/tasks/", data),
};
