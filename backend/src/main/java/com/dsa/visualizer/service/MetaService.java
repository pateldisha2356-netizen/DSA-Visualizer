package com.dsa.visualizer.service;

import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Serves descriptive content (time/space complexity, plain-English
 * description, pseudocode) for every algorithm, so the frontend can render
 * the stats panel and "what is this algorithm" copy from one source of truth.
 */
@Service
public class MetaService {

    private final Map<String, Map<String, Object>> meta = new LinkedHashMap<>();

    public MetaService() {
        register("bubble", "Bubble Sort", "O(n\u00B2)", "O(n)", "O(1)",
                "Repeatedly steps through the array, comparing adjacent elements and swapping them if they're out of order. The largest unsorted element 'bubbles' to the end each pass.",
                "for i in 0..n-1:\n  for j in 0..n-i-2:\n    if arr[j] > arr[j+1]:\n      swap(arr[j], arr[j+1])");

        register("selection", "Selection Sort", "O(n\u00B2)", "O(n\u00B2)", "O(1)",
                "Divides the array into a sorted and unsorted region, repeatedly selecting the smallest element from the unsorted region and moving it to the end of the sorted region.",
                "for i in 0..n-1:\n  minIdx = i\n  for j in i+1..n-1:\n    if arr[j] < arr[minIdx]:\n      minIdx = j\n  swap(arr[i], arr[minIdx])");

        register("insertion", "Insertion Sort", "O(n\u00B2)", "O(n)", "O(1)",
                "Builds the sorted array one element at a time, taking each new element and inserting it into its correct position among the already-sorted elements.",
                "for i in 1..n-1:\n  key = arr[i]\n  j = i - 1\n  while j >= 0 and arr[j] > key:\n    arr[j+1] = arr[j]\n    j = j - 1\n  arr[j+1] = key");

        register("merge", "Merge Sort", "O(n log n)", "O(n log n)", "O(n)",
                "A divide-and-conquer algorithm that splits the array into halves, recursively sorts each half, then merges the two sorted halves back together.",
                "mergeSort(arr, l, r):\n  if l >= r: return\n  m = (l + r) / 2\n  mergeSort(arr, l, m)\n  mergeSort(arr, m+1, r)\n  merge(arr, l, m, r)");

        register("quick", "Quick Sort", "O(n\u00B2)", "O(n log n)", "O(log n)",
                "Picks a pivot element and partitions the array so smaller elements come before it and larger ones after, then recursively sorts each partition.",
                "quickSort(arr, l, r):\n  if l >= r: return\n  p = partition(arr, l, r)\n  quickSort(arr, l, p-1)\n  quickSort(arr, p+1, r)");

        register("linear", "Linear Search", "O(n)", "O(1)", "O(1)",
                "Checks every element one by one from the start of the array until the target is found or the array is exhausted.",
                "for i in 0..n-1:\n  if arr[i] == target:\n    return i\nreturn -1");

        register("binary", "Binary Search", "O(log n)", "O(1)", "O(1)",
                "Repeatedly halves a sorted array's search range, comparing the middle element to the target to decide which half to search next.",
                "low, high = 0, n-1\nwhile low <= high:\n  mid = (low+high)/2\n  if arr[mid] == target: return mid\n  if arr[mid] < target: low = mid+1\n  else: high = mid-1\nreturn -1");

        register("bfs", "BFS", "O(V+E)", "O(V+E)", "O(V)",
                "Breadth-First Search explores a graph level by level, visiting all neighbors of a node before moving to the next depth, using a queue.",
                "queue = [start]\nvisited = {start}\nwhile queue not empty:\n  node = queue.dequeue()\n  visit(node)\n  for neighbor in adj[node]:\n    if neighbor not in visited:\n      visited.add(neighbor)\n      queue.enqueue(neighbor)");

        register("dfs", "DFS", "O(V+E)", "O(V+E)", "O(V)",
                "Depth-First Search explores a graph by going as deep as possible along each branch before backtracking, using a stack (or recursion).",
                "stack = [start]\nvisited = {}\nwhile stack not empty:\n  node = stack.pop()\n  if node not in visited:\n    visited.add(node)\n    visit(node)\n    for neighbor in adj[node]:\n      stack.push(neighbor)");
    }

    private void register(String id, String name, String time, String best, String space, String description, String pseudocode) {
        Map<String, Object> entry = new LinkedHashMap<>();
        entry.put("id", id);
        entry.put("name", name);
        entry.put("time", time);
        entry.put("best", best);
        entry.put("space", space);
        entry.put("description", description);
        entry.put("pseudocode", pseudocode);
        meta.put(id, entry);
    }

    public Map<String, Map<String, Object>> getAll() {
        return meta;
    }

    public Map<String, Object> get(String id) {
        return meta.get(id.toLowerCase());
    }
}
