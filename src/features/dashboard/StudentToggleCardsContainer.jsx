import React, { useEffect, useState } from "react";
import SearchBarAddStudent from "../../components/SearchBarAddStudent.jsx";
import StudentToggleCard from "./cards/StudentToggleCard.jsx";
import {
  getAllStudentsRequest,
  disableBoardStudentRequest,
  enableBoardStudentRequest,
  addStudentToBoardRequest
} from "../../services/adviserService";

import AddStudent from "../users/AddStudent.jsx";
import SearchStudentModal from "../modals/SearchStudentModal.jsx";
import SuccessAlert from "../modals/SuccessAlert.jsx";
import ConfirmAlert from "../modals/ConfirmAlert.jsx";

const StudentCardsToggleContainer = () => {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const [successConfig, setSuccessConfig] = useState({
    isOpen: false,
    message: ""
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  const filteredStudents = Array.isArray(students)
    ? students.filter(s =>
      (s.firstName + " " + s.lastName + " " + s.email)
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    : [];

  const loadStudents = async () => {
    try {
      const res = await getAllStudentsRequest();

      const data =
        res?.data?.data ||
        res?.data?.content ||
        res?.data ||
        res;

      const normalized = Array.isArray(data)
        ? data.map(s => ({
          id: s.studentID,
          firstName: s.firstName,
          lastName: s.lastName,
          email: s.email,
          status: s.statusAdviserStudent
        }))
        : [];

      setStudents(normalized);

    } catch (error) {
      console.error("Error cargando estudiantes", error);
      setStudents([]);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleStudentCreated = async (student) => {
    try {
      await addStudentToBoardRequest(student.email);

      await loadStudents();

      setSuccessConfig({
        isOpen: true,
        message: "Estudiante registrado y agregado"
      });

    } catch (error) {
      console.error(error);
    }
  };


  const handleStudentAdded = async () => {
    await loadStudents();

    setSuccessConfig({
      isOpen: true,
      message: "Estudiante agregado al tablero"
    });
  };

  const handleOpenRegister = () => {
    setIsModalOpen(true);
  };

  const handleToggleStatus = (student) => {
    const isActive = student.status;

    const actionText = isActive ? "deshabilitar" : "habilitar";

    setConfirmMessage(`¿Seguro que deseas ${actionText} este estudiante?`);

    setConfirmAction(() => async () => {
      try {
        if (isActive) {
          await disableBoardStudentRequest(student.id);
        } else {
          await enableBoardStudentRequest(student.id);
        }

        setStudents(prev =>
          prev.map(s =>
            s.id === student.id
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
    setIsSearchModalOpen(true);
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
            key={student.id}
            student={student}
            onToggle={handleToggleStatus}
          />
        ))}
      </div>

      <SearchStudentModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onStudentAdded={handleStudentAdded}
        onStudentNotFound={handleOpenRegister}
        students={students}
      />

      <AddStudent
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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