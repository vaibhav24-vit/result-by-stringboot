package com.sppu.result.service;

import com.sppu.result.entity.Result;
import com.sppu.result.entity.Student;
import com.sppu.result.entity.Subject;
import com.sppu.result.repository.ResultRepository;
import com.sppu.result.repository.StudentRepository;
import com.sppu.result.repository.SubjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResultService {

    private final ResultRepository resultRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;

    public ResultService(
            ResultRepository resultRepository,
            StudentRepository studentRepository,
            SubjectRepository subjectRepository) {

        this.resultRepository = resultRepository;
        this.studentRepository = studentRepository;
        this.subjectRepository = subjectRepository;
    }

    public Result createResult(
            Long studentId,
            Long subjectId,
            Integer internalMarks,
            Integer externalMarks) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        if (internalMarks < 0 || internalMarks > 30) {
            throw new RuntimeException("Internal marks must be between 0 and 30");
        }

        if (externalMarks < 0 || externalMarks > 70) {
            throw new RuntimeException("External marks must be between 0 and 70");
        }

        int total = internalMarks + externalMarks;

        Result result = new Result();

        result.setStudent(student);
        result.setSubject(subject);
        result.setInternalMarks(internalMarks);
        result.setExternalMarks(externalMarks);
        result.setTotalMarks(total);

        calculateGrade(result, total);

        return resultRepository.save(result);
    }

    private void calculateGrade(Result result, int total) {

        if (total >= 90) {
            result.setGrade("A+");
            result.setGradePoint(10.0);
            result.setStatus("PASS");

        } else if (total >= 80) {
            result.setGrade("A");
            result.setGradePoint(9.0);
            result.setStatus("PASS");

        } else if (total >= 70) {
            result.setGrade("B+");
            result.setGradePoint(8.0);
            result.setStatus("PASS");

        } else if (total >= 60) {
            result.setGrade("B");
            result.setGradePoint(7.0);
            result.setStatus("PASS");

        } else if (total >= 50) {
            result.setGrade("C");
            result.setGradePoint(6.0);
            result.setStatus("PASS");

        } else if (total >= 40) {
            result.setGrade("D");
            result.setGradePoint(5.0);
            result.setStatus("PASS");

        } else {
            result.setGrade("F");
            result.setGradePoint(0.0);
            result.setStatus("FAIL");
        }
    }

    public List<Result> getResultsByStudent(Long studentId) {

        return resultRepository.findByStudentId(studentId);
    }

    public List<Result> getAllResults() {

        return resultRepository.findAll();
    }

    public void deleteResult(Long id) {

        resultRepository.deleteById(id);
    }
}