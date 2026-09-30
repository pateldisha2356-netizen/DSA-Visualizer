package com.dsa.visualizer.algorithms;

import com.dsa.visualizer.model.Step;

import java.util.*;
import java.util.stream.Collectors;

/** Pure algorithm logic for Selection Sort. Records one Step per comparison/swap. */
public final class SelectionSort {

    private SelectionSort() {}

    public static List<Step> run(int[] input) {
        int[] a = input.clone();
        List<Step> steps = new ArrayList<>();
        int n = a.length;
        int comparisons = 0, swaps = 0;
        Set<Integer> sortedIdx = new LinkedHashSet<>();

        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            steps.add(new Step()
                    .with("array", toList(a))
                    .with("compare", List.of(i, minIdx))
                    .with("sorted", new ArrayList<>(sortedIdx))
                    .with("comparisons", comparisons)
                    .with("swaps", swaps)
                    .with("message", "Assume arr[" + i + "]=" + a[i] + " is the minimum"));

            for (int j = i + 1; j < n; j++) {
                comparisons++;
                steps.add(new Step()
                        .with("array", toList(a))
                        .with("compare", List.of(minIdx, j))
                        .with("sorted", new ArrayList<>(sortedIdx))
                        .with("comparisons", comparisons)
                        .with("swaps", swaps)
                        .with("message", "Comparing arr[" + j + "]=" + a[j] + " with current min arr[" + minIdx + "]=" + a[minIdx]));

                if (a[j] < a[minIdx]) {
                    minIdx = j;
                    steps.add(new Step()
                            .with("array", toList(a))
                            .with("compare", List.of(minIdx))
                            .with("sorted", new ArrayList<>(sortedIdx))
                            .with("comparisons", comparisons)
                            .with("swaps", swaps)
                            .with("message", "New minimum found: arr[" + minIdx + "]=" + a[minIdx]));
                }
            }
            if (minIdx != i) {
                swap(a, i, minIdx);
                swaps++;
                steps.add(new Step()
                        .with("array", toList(a))
                        .with("swap", List.of(i, minIdx))
                        .with("sorted", new ArrayList<>(sortedIdx))
                        .with("comparisons", comparisons)
                        .with("swaps", swaps)
                        .with("message", "Swapping arr[" + i + "] and arr[" + minIdx + "]"));
            }
            sortedIdx.add(i);
            steps.add(new Step()
                    .with("array", toList(a))
                    .with("sorted", new ArrayList<>(sortedIdx))
                    .with("comparisons", comparisons)
                    .with("swaps", swaps)
                    .with("message", "arr[" + i + "] is in its final position"));
        }
        for (int k = 0; k < n; k++) sortedIdx.add(k);
        steps.add(AlgoUtil.finalSortStep(a, sortedIdx, comparisons, swaps));
        return steps;
    }

    private static void swap(int[] a, int x, int y) {
        int tmp = a[x]; a[x] = a[y]; a[y] = tmp;
    }

    private static List<Integer> toList(int[] a) {
        return Arrays.stream(a).boxed().collect(Collectors.toList());
    }
}
