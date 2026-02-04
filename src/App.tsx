import { useState } from "react";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";
import "./App.css";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleStudentAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Student Management System</h1>
        <p>Manage your students efficiently and effectively</p>
      </header>

      <div style={{ display: 'grid', gap: '2rem' }}>
        <section>
          <StudentForm onStudentAdded={handleStudentAdded} />
        </section>

        <section>
          <StudentList refreshKey={refreshKey} />
        </section>
      </div>
    </div>
  );
}

export default App;




