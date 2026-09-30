package com.dsa.visualizer.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class SortRequest {

    @NotNull
    @Size(min = 1, max = 200, message = "array must contain between 1 and 200 elements")
    private int[] array;

    public int[] getArray() {
        return array;
    }

    public void setArray(int[] array) {
        this.array = array;
    }
}
