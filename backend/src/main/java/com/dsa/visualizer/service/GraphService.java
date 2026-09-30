package com.dsa.visualizer.service;

import com.dsa.visualizer.algorithms.BreadthFirstSearch;
import com.dsa.visualizer.algorithms.DepthFirstSearch;
import com.dsa.visualizer.model.Step;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Holds the fixed 8-node sample graph (same one the frontend draws) and
 * delegates traversal to the pure algorithm classes.
 */
@Service
public class GraphService {

    private static final Map<String, int[]> NODE_POSITIONS = new LinkedHashMap<>();
    private static final Map<String, List<String>> ADJACENCY = new LinkedHashMap<>();

    static {
        NODE_POSITIONS.put("A", new int[]{230, 40});
        NODE_POSITIONS.put("B", new int[]{100, 130});
        NODE_POSITIONS.put("C", new int[]{360, 130});
        NODE_POSITIONS.put("D", new int[]{40, 230});
        NODE_POSITIONS.put("E", new int[]{180, 230});
        NODE_POSITIONS.put("F", new int[]{360, 230});
        NODE_POSITIONS.put("G", new int[]{150, 320});
        NODE_POSITIONS.put("H", new int[]{360, 320});

        ADJACENCY.put("A", List.of("B", "C"));
        ADJACENCY.put("B", List.of("A", "D", "E"));
        ADJACENCY.put("C", List.of("A", "F"));
        ADJACENCY.put("D", List.of("B"));
        ADJACENCY.put("E", List.of("B", "F", "G"));
        ADJACENCY.put("F", List.of("C", "E", "H"));
        ADJACENCY.put("G", List.of("E"));
        ADJACENCY.put("H", List.of("F"));
    }

    public Map<String, Object> getGraphStructure() {
        Map<String, Object> nodes = new LinkedHashMap<>();
        NODE_POSITIONS.forEach((name, pos) -> {
            Map<String, Integer> p = new LinkedHashMap<>();
            p.put("x", pos[0]);
            p.put("y", pos[1]);
            nodes.put(name, p);
        });
        Map<String, Object> graph = new LinkedHashMap<>();
        graph.put("nodes", nodes);
        graph.put("adjacency", ADJACENCY);
        return graph;
    }

    public boolean nodeExists(String node) {
        return ADJACENCY.containsKey(node);
    }

    public List<Step> bfs(String start) {
        return BreadthFirstSearch.run(start, ADJACENCY);
    }

    public List<Step> dfs(String start) {
        return DepthFirstSearch.run(start, ADJACENCY);
    }
}
