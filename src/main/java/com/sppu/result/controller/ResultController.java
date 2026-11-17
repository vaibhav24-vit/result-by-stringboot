package com.sppu.result.controller;

import com.sppu.result.entity.Result;
import com.sppu.result.entity.Subject;
import com.sppu.result.repository.SubjectRepository;
import com.sppu.result.service.ResultService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ResultController {

    private final ResultService resultService;
    private final SubjectRepository subjectRepository;

    public ResultController(
            ResultService resultService,
            SubjectRepository subjectRepository) {

        this.resultService = resultService;
        this.subjectRepository = subjectRepository;
    }

    @PostMapping("/results")
    public ResponseEntity<Result> createResult(
            @RequestParam Long studentId,
            @RequestParam Long subjectId,
            @RequestParam Integer internalMarks,
            @RequestParam Integer externalMarks) {

        return ResponseEntity.ok(
                resultService.createResult(
                        studentId,
                        subjectId,
                        internalMarks,
                        externalMarks
                )
        );
    }

    @GetMapping("/results")
    public ResponseEntity<List<Result>> getAllResults() {

        return ResponseEntity.ok(
                resultService.getAllResults()
        );
    }

    @GetMapping("/students/{studentId}/results")
    public ResponseEntity<List<Result>> getStudentResults(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                resultService.getResultsByStudent(studentId)
        );
    }

    @DeleteMapping("/results/{id}")
    public ResponseEntity<String> deleteResult(
            @PathVariable Long id) {

        resultService.deleteResult(id);

        return ResponseEntity.ok("Result deleted successfully");
    }

    @PostMapping("/subjects")
    public ResponseEntity<Subject> createSubject(
            @Valid @RequestBody Subject subject) {

        return ResponseEntity.ok(
                subjectRepository.save(subject)
        );
    }

    @GetMapping("/subjects")
    public ResponseEntity<List<Subject>> getSubjects() {

        return ResponseEntity.ok(
                subjectRepository.findAll()
        );
    }
}