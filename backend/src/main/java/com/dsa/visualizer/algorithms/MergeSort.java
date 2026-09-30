package com.dsa.visualizer.algorithms;

import com.dsa.visualizer.model.Step;

import java.util.*;
import java.util.stream.Collectors;

/** Pure algorithm logic for Merge Sort (divide & conquer). */
public final class MergeSort {

    private MergeSort() {}

    private static final class Ctx {
        final List<Step> steps = new ArrayList<>();
        int comparisons = 0;
        int swaps = 0;
    }

    public static List<Step> run(int[] input) {
        int[] a = input.clone();
        Ctx ctx = new Ctx();
        sort(a, 0, a.length - 1, ctx);
        ctx.steps.add(new Step()
                .with("array", toList(a))
                .with("sorted", rangeList(0, a.length - 1))
                .with("comparisons", ctx.comparisons)
                .with("swaps", ctx.swaps)
                .with("message", "Array is sorted"));
        return ctx.steps;
    }

    private static void sort(int[] a, int l, int r, Ctx ctx) {
        if (l >= r) return;
        int m = (l + r) / 2;
        ctx.steps.add(new Step()
                .with("array", toList(a))
                .with("range", List.of(l, r))
                .with("comparisons", ctx.comparisons)
                .with("swaps", ctx.swaps)
                .with("message", "Splitting [" + l + ".." + r + "] into [" + l + ".." + m + "] and [" + (m + 1) + ".." + r + "]"));
        sort(a, l, m, ctx);
        sort(a, m + 1, r, ctx);
        merge(a, l, m, r, ctx);
    }

    private static void merge(int[] a, int l, int m, int r, Ctx ctx) {
        int[] left = Arrays.copyOfRange(a, l, m + 1);
        int[] right = Arrays.copyOfRange(a, m + 1, r + 1);
        int i = 0, j = 0, k = l;

        ctx.steps.add(new Step()
                .with("array", toList(a))
                .with("range", List.of(l, r))
                .with("comparisons", ctx.comparisons)
                .with("swaps", ctx.swaps)
                .with("message", "Merging subarrays [" + l + ".." + m + "] and [" + (m + 1) + ".." + r + "]"));

        while (i < left.length && j < right.length) {
            ctx.comparisons++;
            ctx.steps.add(new Step()
                    .with("array", toList(a))
                    .with("compare", List.of(k))
                    .with("range", List.of(l, r))
                    .with("comparisons", ctx.comparisons)
                    .with("swaps", ctx.swaps)
                    .with("message", "Comparing " + left[i] + " and " + right[j]));
            if (left[i] <= right[j]) { a[k] = left[i]; i++; } else { a[k] = right[j]; j++; }
            ctx.swaps++;
            ctx.steps.add(new Step()
                    .with("array", toList(a))
                    .with("compare", List.of(k))
                    .with("range", List.of(l, r))
                    .with("comparisons", ctx.comparisons)
                    .with("swaps", ctx.swaps)
                    .with("message", "Placing " + a[k] + " at index " + k));
            k++;
        }
        while (i < left.length) {
            a[k] = left[i];
            ctx.swaps++;
            ctx.steps.add(new Step()
                    .with("array", toList(a))
                    .with("compare", List.of(k))
                    .with("range", List.of(l, r))
                    .with("comparisons", ctx.comparisons)
                    .with("swaps", ctx.swaps)
                    .with("message", "Placing remaining " + a[k] + " at index " + k));
            i++; k++;
        }
        while (j < right.length) {
            a[k] = right[j];
            ctx.swaps++;
            ctx.steps.add(new Step()
                    .with("array", toList(a))
                    .with("compare", List.of(k))
                    .with("range", List.of(l, r))
                    .with("comparisons", ctx.comparisons)
                    .with("swaps", ctx.swaps)
                    .with("message", "Placing remaining " + a[k] + " at index " + k));
            j++; k++;
        }
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
