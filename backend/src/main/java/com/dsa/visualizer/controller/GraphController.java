package com.dsa.visualizer.controller;

import com.dsa.visualizer.exception.InvalidAlgorithmException;
import com.dsa.visualizer.model.GraphRequest;
import com.dsa.visualizer.model.Step;
import com.dsa.visualizer.service.GraphService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/graph")
public class GraphController {

    private final GraphService graphService;

    public GraphController(GraphService graphService) {
        this.graphService = graphService;
    }

    /** Returns the sample graph's nodes (with layout positions) and adjacency list. */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getGraph() {
        return ResponseEntity.ok(graphService.getGraphStructure());
    }

    @PostMapping("/{algorithm}")
    public ResponseEntity<Map<String, Object>> traverse(@PathVariable String algorithm,
                                                          @RequestBody(required = false) GraphRequest request) {
        String start = (request != null && request.getStart() != null && !request.getStart().isBlank())
                ? request.getStart().toUpperCase()
                : "A";

        if (!graphService.nodeExists(start)) {
            throw new InvalidAlgorithmException("Unknown start node '" + start + "'");
        }

        List<Step> steps = switch (algorithm.toLowerCase()) {
            case "bfs" -> graphService.bfs(start);
            case "dfs" -> graphService.dfs(start);
            default -> throw new InvalidAlgorithmException(
                    "Unknown graph algorithm '" + algorithm + "'. Expected one of: bfs, dfs");
        };

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("algorithm", algorithm);
        body.put("start", start);
        body.put("steps", steps);
        return ResponseEntity.ok(body);
    }
}
