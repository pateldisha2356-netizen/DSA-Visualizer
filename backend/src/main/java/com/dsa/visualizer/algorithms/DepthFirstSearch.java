package com.dsa.visualizer.algorithms;

import com.dsa.visualizer.model.Step;

import java.util.*;

/** Pure algorithm logic for graph DFS traversal (explicit stack, not recursion). */
public final class DepthFirstSearch {

    private DepthFirstSearch() {}

    public static List<Step> run(String start, Map<String, List<String>> adjacency) {
        List<Step> steps = new ArrayList<>();
        Set<String> visited = new LinkedHashSet<>();
        Deque<String> stack = new ArrayDeque<>();

        stack.push(start);
        steps.add(new Step()
                .with("visited", new ArrayList<>(visited))
                .with("stack", new ArrayList<>(stack))
                .with("current", null)
                .with("message", "Start DFS at " + start + ". Push to stack."));

        while (!stack.isEmpty()) {
            String node = stack.pop();
            if (visited.contains(node)) continue;
            visited.add(node);
            steps.add(new Step()
                    .with("visited", new ArrayList<>(visited))
                    .with("stack", new ArrayList<>(stack))
                    .with("current", node)
                    .with("message", "Visit " + node));

            List<String> neighbors = new ArrayList<>(adjacency.get(node));
            Collections.reverse(neighbors);
            for (String neighbor : neighbors) {
                if (!visited.contains(neighbor)) {
                    stack.push(neighbor);
                    steps.add(new Step()
                            .with("visited", new ArrayList<>(visited))
                            .with("stack", new ArrayList<>(stack))
                            .with("current", node)
                            .with("edge", List.of(node, neighbor))
                            .with("message", "Push " + neighbor + " onto stack via " + node));
                }
            }
        }
        steps.add(new Step()
                .with("visited", new ArrayList<>(visited))
                .with("stack", List.of())
                .with("current", null)
                .with("message", "DFS complete — all reachable nodes visited"));
        return steps;
    }
}
