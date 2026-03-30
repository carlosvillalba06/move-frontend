import React, { useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { addStudentToBoardRequest } from "../../services/adviserService";

const SearchStudentModal = ({
    isOpen,
    onClose,
    onStudentAdded,
    onStudentNotFound,
    students = []
}) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);

    if (!isOpen) return null;

    const handleAdd = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.trim()) {
            setError("El correo es obligatorio");
            return;
        }

        const exists = students.some(
            s => s.email.toLowerCase() === email.trim().toLowerCase()
        );

        if (exists) {
            setError("El estudiante ya está en el tablero");
            return;
        }

        if (!emailRegex.test(email.trim())) {
            setError("El formato de correo no es válido");
            return;
        }

        setLoading(true);
        setError("");
        setNotFound(false);

        try {
            await addStudentToBoardRequest(email.trim());
            onStudentAdded();
            resetState();
            onClose();
        } catch (err) {
            console.log("No existe:", err);
            setNotFound(true);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = () => {
        onStudentNotFound(email);
        resetState();
        onClose();
    };

    const resetState = () => {
        setEmail("");
        setError("");
        setNotFound(false);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                <button className="close-x" onClick={onClose}>X</button>

                <h2>Agregar estudiante</h2>

                <div style={{ marginBottom: "1rem" }}>
                    <label>Correo:</label>
                    <br />
                    <Input
                        name="email"
                        placeholder="ejemplo@gmail.com"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                        }}
                        error={error}
                        variant="modal"
                        size="md"
                    />
                </div>

                <footer style={{ marginBottom: "1rem" }}>
                    <Button variant="primary" size="sm" onClick={handleAdd}>
                        {loading ? "Procesando..." : "Agregar"}
                    </Button>
                </footer>

                {notFound && (
                    <div>
                        <p style={{
                            color: 'red',
                            fontSize: '12px',
                            marginTop: '4px'
                        }}>El estudiante no está registrado</p>
                        <br />

                        <Button variant="secondary" size="sm" onClick={handleRegister}>
                            Registrar estudiante
                        </Button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default SearchStudentModal;