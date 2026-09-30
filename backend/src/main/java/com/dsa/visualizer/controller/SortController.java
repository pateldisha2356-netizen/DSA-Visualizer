package com.dsa.visualizer.controller;

import com.dsa.visualizer.exception.InvalidAlgorithmException;
import com.dsa.visualizer.model.SortRequest;
import com.dsa.visualizer.model.Step;
import com.dsa.visualizer.service.SortService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sort")
public class SortController {

    private final SortService sortService;

    public SortController(SortService sortService) {
        this.sortService = sortService;
    }

    @PostMapping("/{algorithm}")
    public ResponseEntity<Map<String, Object>> sort(@PathVariable String algorithm,
                                                      @Valid @RequestBody SortRequest request) {
        List<Step> steps = switch (algorithm.toLowerCase()) {
            case "bubble" -> sortService.bubbleSort(request.getArray());
            case "selection" -> sortService.selectionSort(request.getArray());
            case "insertion" -> sortService.insertionSort(request.getArray());
            case "merge" -> sortService.mergeSort(request.getArray());
            case "quick" -> sortService.quickSort(request.getArray());
            default -> throw new InvalidAlgorithmException(
                    "Unknown sort algorithm '" + algorithm + "'. Expected one of: bubble, selection, insertion, merge, quick");
        };

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("algorithm", algorithm);
        body.put("steps", steps);
        return ResponseEntity.ok(body);
    }
}
