import { useEffect, useState } from "react";
import type { Student } from "../types/student";
import { getAllStudents, deleteStudent } from "../services/student.api";
import StudentForm from "./StudentForm";

interface StudentListProps {
  refreshKey: number;
}

export default function StudentList({ refreshKey }: StudentListProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllStudents(page, limit);
      setStudents(data.data);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      setError("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [refreshKey, page]); // Re-fetch when page or refreshKey changes

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await deleteStudent(id);
      fetchStudents();
    } catch (err: any) {
      alert("Failed to delete student");
    }
  };

  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
  };

  const handleEditComplete = () => {
    setEditingStudent(null);
    fetchStudents();
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  if (loading && students.length === 0) return <p style={{ textAlign: "center" }}>Loading students...</p>;
  if (error) return <p style={{ color: "var(--danger)", textAlign: "center" }}>{error}</p>;

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2>Student List</h2>
        <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Page {page} of {totalPages}
        </span>
      </div>

      {students.length === 0 ? (
        <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>
          No students found. Add one above!
        </p>
      ) : (
        <>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td><strong>{student.name}</strong></td>
                    <td>{student.age}</td>
                    <td>{student.email}</td>
                    <td>
                      <span style={{
                        background: "rgba(79, 70, 229, 0.1)",
                        color: "var(--primary)",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.25rem",
                        fontSize: "0.875rem",
                        fontWeight: 500
                      }}>
                        {student.course}
                      </span>
                    </td>
                    <td>
                      <div className="flex">
                        <button
                          className="btn btn-secondary"
                          style={{ padding: "0.5rem 0.75rem", fontSize: "0.875rem" }}
                          onClick={() => handleEditClick(student)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ padding: "0.5rem 0.75rem", fontSize: "0.875rem" }}
                          onClick={() => handleDelete(student._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center" style={{ marginTop: "1.5rem" }}>
            <button
              className="btn btn-secondary"
              onClick={handlePrevPage}
              disabled={page === 1 || loading}
            >
              Previous
            </button>
            <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Showing {students.length} results
            </span>
            <button
              className="btn btn-secondary"
              onClick={handleNextPage}
              disabled={page === totalPages || loading}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Edit Modal */}
      {editingStudent && (
        <div className="modal-overlay" onClick={() => setEditingStudent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2>Edit Student</h2>
              <button
                onClick={() => setEditingStudent(null)}
                style={{ fontSize: "1.5rem", color: "var(--text-muted)", lineHeight: 1 }}
              >
                &times;
              </button>
            </div>

            <StudentForm
              onStudentAdded={handleEditComplete}
              initialData={editingStudent}
              onCancel={() => setEditingStudent(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
