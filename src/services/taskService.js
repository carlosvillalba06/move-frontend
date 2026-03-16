const API_URL = "http://localhost:8080/api/tasks";

export const getTasksRequest = async () => {

  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Error obteniendo tareas");
  }

  return await response.json();
};

export const createTaskRequest = async (task) => {

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(task)
  });

  return await response.json();
};

export const updateTaskStatusRequest = async (id, status) => {

  const response = await fetch(`${API_URL}/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status })
  });

  return await response.json();
};