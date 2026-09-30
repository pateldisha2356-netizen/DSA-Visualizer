package com.dsa.visualizer.service;

import com.dsa.visualizer.algorithms.*;
import com.dsa.visualizer.model.Step;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Thin service layer: validates nothing itself (the controller/model layer
 * already does that) and simply routes to the pure algorithm implementations
 * in {@code com.dsa.visualizer.algorithms}.
 */
@Service
public class SortService {

    public List<Step> bubbleSort(int[] array) {
        return BubbleSort.run(array);
    }

    public List<Step> selectionSort(int[] array) {
        return SelectionSort.run(array);
    }

    public List<Step> insertionSort(int[] array) {
        return InsertionSort.run(array);
    }

    public List<Step> mergeSort(int[] array) {
        return MergeSort.run(array);
    }

    public List<Step> quickSort(int[] array) {
        return QuickSort.run(array);
    }
}
