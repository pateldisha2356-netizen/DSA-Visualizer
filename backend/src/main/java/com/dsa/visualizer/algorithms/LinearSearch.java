package com.dsa.visualizer.algorithms;

import com.dsa.visualizer.model.Step;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/** Pure algorithm logic for Linear Search. */
public final class LinearSearch {

    private LinearSearch() {}

    public static List<Step> run(int[] input, int target) {
        List<Step> steps = new ArrayList<>();
        int comparisons = 0;
        List<Integer> arrList = toList(input);

        for (int i = 0; i < input.length; i++) {
            comparisons++;
            steps.add(new Step()
                    .with("array", arrList)
                    .with("current", i)
                    .with("comparisons", comparisons)
                    .with("message", "Checking index " + i + ": is " + input[i] + " == " + target + "?"));

            if (input[i] == target) {
                steps.add(new Step()
                        .with("array", arrList)
                        .with("current", i)
                        .with("found", i)
                        .with("comparisons", comparisons)
                        .with("message", "Found " + target + " at index " + i));
                return steps;
            }
        }
        steps.add(new Step()
                .with("array", arrList)
                .with("comparisons", comparisons)
                .with("message", target + " was not found in the array"));
        return steps;
    }

    private static List<Integer> toList(int[] a) {
        return Arrays.stream(a).boxed().collect(Collectors.toList());
    }
}
