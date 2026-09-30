package com.dsa.visualizer.algorithms;

import com.dsa.visualizer.model.Step;

import java.util.*;
import java.util.stream.Collectors;

/** Pure algorithm logic for Bubble Sort. Records one Step per comparison/swap. */
public final class BubbleSort {

    private BubbleSort() {}

    public static List<Step> run(int[] input) {
        int[] a = input.clone();
        List<Step> steps = new ArrayList<>();
        int n = a.length;
        int comparisons = 0, swaps = 0;
        Set<Integer> sortedIdx = new LinkedHashSet<>();

        for (int i = 0; i < n - 1; i++) {
            boolean swappedAny = false;
            for (int j = 0; j < n - i - 1; j++) {
                comparisons++;
                steps.add(new Step()
                        .with("array", toList(a))
                        .with("compare", List.of(j, j + 1))
                        .with("sorted", new ArrayList<>(sortedIdx))
                        .with("comparisons", comparisons)
                        .with("swaps", swaps)
                        .with("message", "Comparing arr[" + j + "]=" + a[j] + " and arr[" + (j + 1) + "]=" + a[j + 1]));

                if (a[j] > a[j + 1]) {
                    swap(a, j, j + 1);
                    swaps++;
                    swappedAny = true;
                    steps.add(new Step()
                            .with("array", toList(a))
                            .with("swap", List.of(j, j + 1))
                            .with("sorted", new ArrayList<>(sortedIdx))
                            .with("comparisons", comparisons)
                            .with("swaps", swaps)
                            .with("message", "Swapping arr[" + j + "] and arr[" + (j + 1) + "]"));
                }
            }
            sortedIdx.add(n - 1 - i);
            steps.add(new Step()
                    .with("array", toList(a))
                    .with("sorted", new ArrayList<>(sortedIdx))
                    .with("comparisons", comparisons)
                    .with("swaps", swaps)
                    .with("message", "arr[" + (n - 1 - i) + "] is in its final position"));
            if (!swappedAny) break;
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
