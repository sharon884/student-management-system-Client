import axios from "axios";
import type { Student } from "../types/student";


const API_BASE_URL = "http://localhost:5000/api/students";

/**
 * Fetch all students
 */
export const getAllStudents = async (): Promise<Student[]> => {
  try {
    const response = await axios.get<Student[]>(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch students", error);
    throw error;
  }
};

/**
 * Create a new student
 */
export const createStudent = async (
  data: Omit<Student, "_id" | "createdAt" | "updatedAt">
): Promise<Student> => {
  try {
    const response = await axios.post<Student>(API_BASE_URL, data);
    return response.data;
  } catch (error) {
    console.error("Failed to create student", error);
    throw error;
  }
};

/**
 * Delete a student
 */
export const deleteStudent = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
  } catch (error) {
    console.error("Failed to delete student", error);
    throw error;
  }
};
