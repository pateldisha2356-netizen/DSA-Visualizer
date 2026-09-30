package com.dsa.visualizer.algorithms;

import com.dsa.visualizer.model.Step;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/** Pure algorithm logic for Binary Search. Sorts a copy of the input first. */
public final class BinarySearch {

    private BinarySearch() {}

    public static List<Step> run(int[] input, int target) {
        int[] sorted = input.clone();
        Arrays.sort(sorted);
        List<Integer> arrList = toList(sorted);

        List<Step> steps = new ArrayList<>();
        int comparisons = 0;
        int low = 0, high = sorted.length - 1;

        steps.add(new Step()
                .with("array", arrList)
                .with("low", low)
                .with("high", high)
                .with("comparisons", comparisons)
                .with("message", "Array sorted for binary search. Searching for " + target));

        while (low <= high) {
            int mid = (low + high) / 2;
            comparisons++;
            steps.add(new Step()
                    .with("array", arrList)
                    .with("low", low)
                    .with("high", high)
                    .with("mid", mid)
                    .with("comparisons", comparisons)
                    .with("message", "mid = " + mid + ", arr[" + mid + "] = " + sorted[mid]));

            if (sorted[mid] == target) {
                steps.add(new Step()
                        .with("array", arrList)
                        .with("low", low)
                        .with("high", high)
                        .with("mid", mid)
                        .with("found", mid)
                        .with("comparisons", comparisons)
                        .with("message", "Found " + target + " at index " + mid));
                return steps;
            } else if (sorted[mid] < target) {
                steps.add(new Step()
                        .with("array", arrList)
                        .with("low", low)
                        .with("high", high)
                        .with("mid", mid)
                        .with("comparisons", comparisons)
                        .with("message", sorted[mid] + " < " + target + ", search right half"));
                low = mid + 1;
            } else {
                steps.add(new Step()
                        .with("array", arrList)
                        .with("low", low)
                        .with("high", high)
                        .with("mid", mid)
                        .with("comparisons", comparisons)
                        .with("message", sorted[mid] + " > " + target + ", search left half"));
                high = mid - 1;
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
