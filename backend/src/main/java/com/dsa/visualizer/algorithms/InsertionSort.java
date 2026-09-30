package com.dsa.visualizer.algorithms;

import com.dsa.visualizer.model.Step;

import java.util.*;
import java.util.stream.Collectors;

/** Pure algorithm logic for Insertion Sort. Records one Step per comparison/shift. */
public final class InsertionSort {

    private InsertionSort() {}

    public static List<Step> run(int[] input) {
        int[] a = input.clone();
        List<Step> steps = new ArrayList<>();
        int n = a.length;
        int comparisons = 0, swaps = 0;

        steps.add(new Step()
                .with("array", toList(a))
                .with("sorted", List.of(0))
                .with("comparisons", comparisons)
                .with("swaps", swaps)
                .with("message", "arr[0] is trivially sorted"));

        for (int i = 1; i < n; i++) {
            int key = a[i];
            int j = i - 1;
            steps.add(new Step()
                    .with("array", toList(a))
                    .with("compare", List.of(i))
                    .with("sorted", rangeList(0, i - 1))
                    .with("comparisons", comparisons)
                    .with("swaps", swaps)
                    .with("message", "Picking arr[" + i + "]=" + key + " to insert into sorted portion"));

            while (j >= 0 && a[j] > key) {
                comparisons++;
                swaps++;
                a[j + 1] = a[j];
                steps.add(new Step()
                        .with("array", toList(a))
                        .with("compare", List.of(j, j + 1))
                        .with("comparisons", comparisons)
                        .with("swaps", swaps)
                        .with("message", a[j] + " > " + key + ", shifting right"));
                j--;
            }
            if (j >= 0) comparisons++;
            a[j + 1] = key;
            steps.add(new Step()
                    .with("array", toList(a))
                    .with("compare", List.of(j + 1))
                    .with("sorted", rangeList(0, i))
                    .with("comparisons", comparisons)
                    .with("swaps", swaps)
                    .with("message", "Inserted " + key + " at index " + (j + 1)));
        }
        steps.add(new Step()
                .with("array", toList(a))
                .with("sorted", rangeList(0, n - 1))
                .with("comparisons", comparisons)
                .with("swaps", swaps)
                .with("message", "Array is sorted"));
        return steps;
    }

    private static List<Integer> toList(int[] a) {
        return Arrays.stream(a).boxed().collect(Collectors.toList());
    }

    private static List<Integer> rangeList(int from, int to) {
        List<Integer> list = new ArrayList<>();
        for (int i = from; i <= to; i++) list.add(i);
        return list;
    }
}
