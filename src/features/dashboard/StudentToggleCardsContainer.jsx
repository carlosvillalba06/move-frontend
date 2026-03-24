import React, { useEffect, useState } from "react";
import SearchBarAddStudent from "../../components/SearchBarAddStudent.jsx";
import StudentToggleCard from "./cards/StudentToggleCard.jsx";
import { getAllStudentsRequest } from "../../services/adviserService";
import { disableUserRequest, enableUserRequest } from "../../services/authService.js";

import AddStudent from "../users/AddStudent.jsx";
import SuccessAlert from "../modals/SuccessAlert.jsx";
import ConfirmAlert from "../modals/ConfirmAlert.jsx";

const StudentCardsToggleContainer = () => {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successConfig, setSuccessConfig] = useState({
    isOpen: false,
    message: ""
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  const filteredStudents = students.filter(s =>
    (s.firstName + " " + s.lastName + " " + s.email)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const loadStudents = async () => {
    try {
      const res = await getAllStudentsRequest();
      setStudents(res);
    } catch (error) {
      console.error("Error cargando estudiantes", error);
    }
  };

  const handleStudentCreated = async () => {
    await loadStudents();
    setSuccessConfig({
      isOpen: true,
      message: "Estudiante registrado con éxito"
    });
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleDisable = (email) => {
    setConfirmMessage("¿Seguro que deseas deshabilitar este estudiante?");
    setConfirmAction(() => async () => {
      await disableUserRequest(email);
      setStudents(prev =>
        prev.map(s =>
          s.email === email ? { ...s, status: false } : s
        )
      );
      setConfirmOpen(false);
    });
    setConfirmOpen(true);
  };

  const handleEnable = (email) => {
    setConfirmMessage("¿Seguro que deseas habilitar este estudiante?");
    setConfirmAction(() => async () => {
      await enableUserRequest(email);
      setStudents(prev =>
        prev.map(s =>
          s.email === email ? { ...s, status: true } : s
        )
      );
      setConfirmOpen(false);
    });
    setConfirmOpen(true);
  };

  const handleAddStudent = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <SearchBarAddStudent
        setSearch={setSearch}
        onAddStudent={handleAddStudent}
      />

      <br />

      <div className="grid">
        {filteredStudents.map((student) => (
          <StudentToggleCard
            key={student.email}
            student={student}
            onEnable={handleEnable}
            onDisable={handleDisable}
          />
        ))}
      </div>

      <AddStudent
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onStudentCreated={handleStudentCreated}
      />

      <SuccessAlert
        isOpen={successConfig.isOpen}
        message={successConfig.message}
        onClose={() =>
          setSuccessConfig({ isOpen: false, message: "" })
        }
      />

      <ConfirmAlert
        isOpen={confirmOpen}
        message={confirmMessage}
        onConfirm={confirmAction}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default StudentCardsToggleContainer;