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

  useEffect(() => {
    loadStudents();
  }, []);

  const handleStudentCreated = async () => {
    await loadStudents();
    setSuccessConfig({
      isOpen: true,
      message: "Estudiante registrado con éxito"
    });
  };

  const handleToggleStatus = (student) => {
    const isActive = student.status;

    const actionText = isActive ? "deshabilitar" : "habilitar";

    setConfirmMessage(`¿Seguro que deseas ${actionText} este estudiante?`);

    setConfirmAction(() => async () => {
      try {
        if (isActive) {
          await disableUserRequest(student.email);
        } else {
          await enableUserRequest(student.email);
        }

        setStudents(prev =>
          prev.map(s =>
            s.email === student.email
              ? { ...s, status: !isActive }
              : s
          )
        );

        setSuccessConfig({
          isOpen: true,
          message: isActive
            ? "Estudiante deshabilitado"
            : "Estudiante habilitado"
        });

      } catch (error) {
        console.error("Error al cambiar estado", error);
      } finally {
        setConfirmOpen(false);
      }
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
            onToggle={handleToggleStatus}
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