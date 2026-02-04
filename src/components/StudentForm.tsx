import { useState } from "react";
import { createStudent } from "../services/student.api";

interface StudentFormProps {
  onStudentAdded: () => void;
}

export default function StudentForm({ onStudentAdded }: StudentFormProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      await createStudent({
        name,
        age: Number(age),      
        email,
        course,
      });

      // reset form
      setName("");
      setAge("");
      setEmail("");
      setCourse("");

      // notify parent to refresh list
      onStudentAdded();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h2>Add Student</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <input
          type="text"
          placeholder="Name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <input
          type="number"
          placeholder="Age"
          value={age}
          required
          onChange={(e) => setAge(Number(e.target.value))}
        />
      </div>

      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <input
          type="text"
          placeholder="Course"
          value={course}
          required
          onChange={(e) => setCourse(e.target.value)}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Student"}
      </button>
    </form>
  );
}
