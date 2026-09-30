package com.dsa.visualizer.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class SearchRequest {

    @NotNull
    @Size(min = 1, max = 200, message = "array must contain between 1 and 200 elements")
    private int[] array;

    private int target;

    public int[] getArray() {
        return array;
    }

    public void setArray(int[] array) {
        this.array = array;
    }

    public int getTarget() {
        return target;
    }

    public void setTarget(int target) {
        this.target = target;
    }
}
