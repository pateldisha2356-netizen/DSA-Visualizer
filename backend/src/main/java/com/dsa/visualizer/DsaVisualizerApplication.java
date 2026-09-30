package com.dsa.visualizer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the DSA Visualizer REST API.
 *
 * Run with: mvn spring-boot:run
 * The API then listens on http://localhost:8080/api/...
 */
@SpringBootApplication
public class DsaVisualizerApplication {

    public static void main(String[] args) {
        SpringApplication.run(DsaVisualizerApplication.class, args);
    }
}
