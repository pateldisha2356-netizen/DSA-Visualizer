package com.dsa.visualizer.controller;

import com.dsa.visualizer.exception.InvalidAlgorithmException;
import com.dsa.visualizer.service.MetaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/meta")
public class MetaController {

    private final MetaService metaService;

    public MetaController(MetaService metaService) {
        this.metaService = metaService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Map<String, Object>>> getAll() {
        return ResponseEntity.ok(metaService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getOne(@PathVariable String id) {
        Map<String, Object> entry = metaService.get(id);
        if (entry == null) {
            throw new InvalidAlgorithmException("No metadata found for '" + id + "'");
        }
        return ResponseEntity.ok(entry);
    }
}
