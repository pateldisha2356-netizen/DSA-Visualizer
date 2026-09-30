package com.dsa.visualizer.algorithms;

import com.dsa.visualizer.model.Step;

import java.util.*;
import java.util.stream.Collectors;

/** Pure algorithm logic for Quick Sort (Lomuto partition scheme, last element as pivot). */
public final class QuickSort {

    private QuickSort() {}

    private static final class Ctx {
        final List<Step> steps = new ArrayList<>();
        final Set<Integer> sortedIdx = new LinkedHashSet<>();
        int comparisons = 0;
        int swaps = 0;
    }

    public static List<Step> run(int[] input) {
        int[] a = input.clone();
        Ctx ctx = new Ctx();
        sort(a, 0, a.length - 1, ctx);
        for (int k = 0; k < a.length; k++) ctx.sortedIdx.add(k);
        ctx.steps.add(AlgoUtil.finalSortStep(a, ctx.sortedIdx, ctx.comparisons, ctx.swaps));
        return ctx.steps;
    }

    private static void sort(int[] a, int l, int r, Ctx ctx) {
        if (l >= r) {
            if (l == r) ctx.sortedIdx.add(l);
            return;
        }
        int p = partition(a, l, r, ctx);
        sort(a, l, p - 1, ctx);
        sort(a, p + 1, r, ctx);
    }

    private static int partition(int[] a, int l, int r, Ctx ctx) {
        int pivot = a[r];
        ctx.steps.add(new Step()
                .with("array", toList(a))
                .with("pivot", r)
                .with("range", List.of(l, r))
                .with("comparisons", ctx.comparisons)
                .with("swaps", ctx.swaps)
                .with("message", "Pivot chosen: arr[" + r + "]=" + pivot));

        int i = l - 1;
        for (int j = l; j < r; j++) {
            ctx.comparisons++;
            ctx.steps.add(new Step()
                    .with("array", toList(a))
                    .with("compare", List.of(j))
                    .with("pivot", r)
                    .with("range", List.of(l, r))
                    .with("comparisons", ctx.comparisons)
                    .with("swaps", ctx.swaps)
                    .with("message", "Comparing arr[" + j + "]=" + a[j] + " with pivot " + pivot));

            if (a[j] < pivot) {
                i++;
                swap(a, i, j);
                ctx.swaps++;
                ctx.steps.add(new Step()
                        .with("array", toList(a))
                        .with("swap", List.of(i, j))
                        .with("pivot", r)
                        .with("range", List.of(l, r))
                        .with("comparisons", ctx.comparisons)
                        .with("swaps", ctx.swaps)
                        .with("message", "Swapping arr[" + i + "] and arr[" + j + "]"));
            }
        }
        swap(a, i + 1, r);
        ctx.swaps++;
        ctx.steps.add(new Step()
                .with("array", toList(a))
                .with("swap", List.of(i + 1, r))
                .with("range", List.of(l, r))
                .with("comparisons", ctx.comparisons)
                .with("swaps", ctx.swaps)
                .with("message", "Placing pivot at index " + (i + 1)));
        ctx.sortedIdx.add(i + 1);
        return i + 1;
    }

    private static void swap(int[] a, int x, int y) {
        int tmp = a[x]; a[x] = a[y]; a[y] = tmp;
    }

    private static List<Integer> toList(int[] a) {
        return Arrays.stream(a).boxed().collect(Collectors.toList());
    }
}
