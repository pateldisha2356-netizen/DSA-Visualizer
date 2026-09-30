package com.dsa.visualizer.controller;

import com.dsa.visualizer.exception.InvalidAlgorithmException;
import com.dsa.visualizer.model.SearchRequest;
import com.dsa.visualizer.model.Step;
import com.dsa.visualizer.service.SearchService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @PostMapping("/{algorithm}")
    public ResponseEntity<Map<String, Object>> search(@PathVariable String algorithm,
                                                        @Valid @RequestBody SearchRequest request) {
        List<Step> steps = switch (algorithm.toLowerCase()) {
            case "linear" -> searchService.linearSearch(request.getArray(), request.getTarget());
            case "binary" -> searchService.binarySearch(request.getArray(), request.getTarget());
            default -> throw new InvalidAlgorithmException(
                    "Unknown search algorithm '" + algorithm + "'. Expected one of: linear, binary");
        };

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("algorithm", algorithm);
        body.put("target", request.getTarget());
        body.put("steps", steps);
        return ResponseEntity.ok(body);
    }
}
