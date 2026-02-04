import axios from "axios";
import type { Student } from "../types/student";


const API_BASE_URL = "http://localhost:5000/api/students";

/**
 * Fetch all students
 */
export const getAllStudents = async (
  page: number = 1,
  limit: number = 5
): Promise<{
  data: Student[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  try {
    const response = await axios.get<{
      data: Student[];
      total: number;
      page: number;
      totalPages: number;
    }>(API_BASE_URL, {
      params: { page, limit },
    });
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

/**
 * Update a student
 */
export const updateStudent = async (
  id: string,
  data: Partial<Student>
): Promise<Student> => {
  try {
    const response = await axios.put<Student>(`${API_BASE_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Failed to update student", error);
    throw error;
  }
};
