package com.dsa.visualizer.algorithms;

import com.dsa.visualizer.model.Step;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/** Small shared helpers used by more than one sorting algorithm. */
final class AlgoUtil {

    private AlgoUtil() {}

    static Step finalSortStep(int[] a, Set<Integer> sortedIdx, int comparisons, int swaps) {
        return new Step()
                .with("array", Arrays.stream(a).boxed().collect(Collectors.toList()))
                .with("sorted", new ArrayList<>(sortedIdx))
                .with("comparisons", comparisons)
                .with("swaps", swaps)
                .with("message", "Array is sorted");
    }
}
