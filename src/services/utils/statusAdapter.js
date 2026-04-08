export const statusAdapter = {
  toFrontend: (status) => {
    switch (status) {
      case "ToDo": return "TODO";
      case "Doing": return "IN_PROGRESS";
      case "Done": return "DONE";
      default: return status;
    }
  },

  toBackend: (status) => {
    switch (status) {
      case "TODO": return "ToDo";
      case "IN_PROGRESS": return "Doing";
      case "DONE": return "Done";
      default: return status;
    }
  }
};