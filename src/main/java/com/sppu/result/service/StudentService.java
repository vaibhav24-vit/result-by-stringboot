package com.sppu.result.service;

import com.sppu.result.entity.Student;
import com.sppu.result.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student createStudent(Student student) {

        if (studentRepository.existsByRollNo(student.getRollNo())) {
            throw new RuntimeException("Student with this roll number already exists");
        }

        return studentRepository.save(student);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudent(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public Student updateStudent(Long id, Student updatedStudent) {

        Student student = getStudent(id);

        student.setRollNo(updatedStudent.getRollNo());
        student.setName(updatedStudent.getName());
        student.setCourse(updatedStudent.getCourse());
        student.setBranch(updatedStudent.getBranch());
        student.setSemester(updatedStudent.getSemester());

        return studentRepository.save(student);
    }

    public void deleteStudent(Long id) {

        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Student not found");
        }

        studentRepository.deleteById(id);
    }
}