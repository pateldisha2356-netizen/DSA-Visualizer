package com.dsa.visualizer.service;

import com.dsa.visualizer.algorithms.BinarySearch;
import com.dsa.visualizer.algorithms.LinearSearch;
import com.dsa.visualizer.model.Step;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SearchService {

    public List<Step> linearSearch(int[] array, int target) {
        return LinearSearch.run(array, target);
    }

    public List<Step> binarySearch(int[] array, int target) {
        return BinarySearch.run(array, target);
    }
}
