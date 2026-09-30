package com.dsa.visualizer.algorithms;

import com.dsa.visualizer.model.Step;

import java.util.*;

/** Pure algorithm logic for graph BFS traversal (queue-based). */
public final class BreadthFirstSearch {

    private BreadthFirstSearch() {}

    public static List<Step> run(String start, Map<String, List<String>> adjacency) {
        List<Step> steps = new ArrayList<>();
        Set<String> visited = new LinkedHashSet<>();
        Deque<String> queue = new ArrayDeque<>();

        visited.add(start);
        queue.addLast(start);
        steps.add(new Step()
                .with("visited", new ArrayList<>(visited))
                .with("queue", new ArrayList<>(queue))
                .with("current", null)
                .with("message", "Start BFS at " + start + ". Add to queue."));

        while (!queue.isEmpty()) {
            String node = queue.removeFirst();
            steps.add(new Step()
                    .with("visited", new ArrayList<>(visited))
                    .with("queue", new ArrayList<>(queue))
                    .with("current", node)
                    .with("message", "Visit " + node));

            for (String neighbor : adjacency.get(node)) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.addLast(neighbor);
                    steps.add(new Step()
                            .with("visited", new ArrayList<>(visited))
                            .with("queue", new ArrayList<>(queue))
                            .with("current", node)
                            .with("edge", List.of(node, neighbor))
                            .with("message", "Discovered " + neighbor + " via " + node + ", enqueue it"));
                }
            }
        }
        steps.add(new Step()
                .with("visited", new ArrayList<>(visited))
                .with("queue", List.of())
                .with("current", null)
                .with("message", "BFS complete — all reachable nodes visited"));
        return steps;
    }
}
