import { useState, useEffect } from "react";
import { createStudent, updateStudent } from "../services/student.api";
import type { Student } from "../types/student";

interface StudentFormProps {
  onStudentAdded: () => void;
  initialData?: Student | null;
  onCancel?: () => void;
}

export default function StudentForm({ onStudentAdded, initialData, onCancel }: StudentFormProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setAge(initialData.age);
      setEmail(initialData.email);
      setCourse(initialData.course);
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setName("");
    setAge("");
    setEmail("");
    setCourse("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const studentData = {
        name,
        age: Number(age),
        email,
        course,
      };

      if (initialData) {
        await updateStudent(initialData._id, studentData);
      } else {
        await createStudent(studentData);
      }

      if (!initialData) {
        resetForm();
      }

      onStudentAdded();
    } catch (err: any) {
      setError(err?.response?.data?.message || `Failed to ${initialData ? 'update' : 'add'} student`);
    } finally {
      setLoading(false);
    }
  };

  const isEditMode = !!initialData;

  return (
    <div className={!isEditMode ? "card" : ""}>
      {!isEditMode && <h2 className="mb-6">Add New Student</h2>}

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4" style={{ color: "var(--danger)", padding: "0.5rem", backgroundColor: "rgba(239, 68, 68, 0.1)", borderRadius: "var(--radius)" }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Name</label>
          <input
            className="input"
            type="text"
            placeholder="John Doe"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Age</label>
          <input
            className="input"
            type="number"
            placeholder="21"
            value={age}
            required
            onChange={(e) => setAge(Number(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Email</label>
          <input
            className="input"
            type="email"
            placeholder="john@example.com"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Course</label>
          <input
            className="input"
            type="text"
            placeholder="Computer Science"
            value={course}
            required
            onChange={(e) => setCourse(e.target.value)}
          />
        </div>

        <div className="flex justify-end items-center" style={{ gap: "1rem", marginTop: "2rem" }}>
          {onCancel && (
            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update Student" : "Add Student")}
          </button>
        </div>
      </form>
    </div>
  );
}
