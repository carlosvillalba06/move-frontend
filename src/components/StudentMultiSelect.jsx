import { useState, useMemo, useRef, useEffect } from "react";

const StudentMultiSelect = ({ students = [], selected = [], onChange }) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const formatName = (firstName, lastName) => {
  const first = firstName?.split(" ")[0] || "";
  const last = lastName?.split(" ")[0] || "";
  return `${first} ${last}`;
};

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    return students.filter(s =>
      `${s.firstName} ${s.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [students, search]);

  const normalize = (arr) => arr.map(Number);

  const toggleStudent = (id) => {
    const numericId = Number(id);
    const normalizedSelected = normalize(selected);

    if (normalizedSelected.includes(numericId)) {
      onChange(normalizedSelected.filter(s => s !== numericId));
    } else {
      onChange([...normalizedSelected, numericId]);
    }
  };

  return (
    <div className="ms-container" ref={ref}>
      <input
        type="text"
        className="ms-search"
        placeholder="Buscar estudiantes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setOpen(true)}
      />

      {selected.length > 0 && (
        <div className="ms-selected">
          {selected.map(id => {
            const student = students.find(
              s => Number(s.studentID) === Number(id)
            );
            if (!student) return null;

            return (
              <div key={id} className="ms-chip">
                {formatName(student.firstName, student.lastName)}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStudent(id);
                  }}
                >
                  ×
                </span>
              </div>
            );
          })}
        </div>
      )}

      {open && (
        <div className="ms-dropdown">
          {filtered.length === 0 ? (
            <div className="ms-empty">Sin resultados</div>
          ) : (
            filtered.map(student => {
              const numericId = Number(student.studentID);
              const normalizedSelected = normalize(selected);

              return (
                <div
                  key={student.studentID}
                  className={`ms-option ${
                    normalizedSelected.includes(numericId) ? "selected" : ""
                  }`}
                  onClick={() => toggleStudent(numericId)}
                >
                  {student.firstName} {student.lastName}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default StudentMultiSelect;