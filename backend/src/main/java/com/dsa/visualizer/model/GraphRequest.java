package com.dsa.visualizer.model;

public class GraphRequest {

    /** Node id to start the traversal from. Defaults to "A" if blank. */
    private String start;

    public String getStart() {
        return start;
    }

    public void setStart(String start) {
        this.start = start;
    }
}
