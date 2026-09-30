package com.dsa.visualizer.model;

import java.util.LinkedHashMap;

/**
 * A single frame of an algorithm's execution, serialized to JSON.
 *
 * Deliberately a loose map rather than a rigid POJO: different algorithms
 * populate different optional fields (compare, swap, pivot, range, low/high/mid,
 * visited/queue/stack, edge, etc.), and the frontend already treats every
 * field as optional. Only the fields relevant to a given step are included,
 * which keeps the JSON payload lean.
 */
public class Step extends LinkedHashMap<String, Object> {

    public Step with(String key, Object value) {
        this.put(key, value);
        return this;
    }
}
