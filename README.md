# DSA Visualizer

An interactive learning platform for Data Structures &amp; Algorithms — dark,
modern UI with pastel accents, step-by-step playback controls, and a real
Java + Spring Boot backend doing the actual computation for sorting,
searching, and graph traversal.

```
DSA-Visualizer/
├── backend/     Java 17 + Spring Boot REST API (the "Algorithm Engine")
├── frontend/    Static HTML + CSS + vanilla JS site
├── README.md
└── .gitignore
```

## Quick start

**1. Start the backend** (required for Sorting, Searching, and Graphs)

```bash
cd backend
mvn spring-boot:run
```

This starts the API at `http://localhost:8080`. See `backend/README.md` for
the full endpoint list.

**2. Open the frontend**

The frontend is static — no build step. Either:

- Open `frontend/index.html` directly in a browser, or
- Serve it locally so relative paths behave consistently, e.g.:
  ```bash
  cd frontend
  python3 -m http.server 5500
  # then visit http://localhost:5500
  ```

CORS is already open on the backend (`*`) for local development.

## What's inside

| Page | Backed by | Notes |
|---|---|---|
| Sorting (`pages/sorting.html`) | `POST /api/sort/{bubble\|selection\|insertion\|merge\|quick}` | Full playback controls, live stats, plain-English explanation per step |
| Searching (`pages/searching.html`) | `POST /api/search/{linear\|binary}` | Same playback model, box-based visualization |
| Graphs (`pages/graphs.html`) | `GET /api/graph`, `POST /api/graph/{bfs\|dfs}` | Node positions + adjacency come from the backend; queue/stack + visited panels show the BFS/DFS difference live |
| Linked List (`pages/linked-list.html`) | **Client-side only** | Insert (head/tail/position), delete, search, traverse — no backend endpoint yet |
| Trees (`pages/trees.html`) | **Client-side only** | Binary Search Tree: insert, search, inorder/preorder/postorder traversal — no backend endpoint yet |

## Architecture

```
                 DSA VISUALIZER
                       │
          ┌────────────┴────────────┐
          │                         │
      Frontend                   Backend
   HTML/CSS/JS               Java + Spring Boot
          │                         │
          │        REST API        │
          └───────────┬─────────────┘
                       │
               Algorithm Engine
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
     Sorting        Searching        Graphs
        │              │              │
     Bubble          Linear          BFS
     Selection       Binary          DFS
     Insertion
     Merge
     Quick

  (Linked List + Trees run entirely in frontend/js/*.js — no backend call)
```

## Extending it

- Want Linked List / Trees on the backend too? Add
  `LinkedListController` / `TreeController` + matching service and
  algorithm classes following the same pattern as `SortController` →
  `SortService` → `algorithms/BubbleSort.java`, etc.
- Want to deploy? Tighten `backend/src/main/java/com/dsa/visualizer/config/CorsConfig.java`
  to your real frontend origin instead of `*`, and point
  `frontend/js/api.js`'s `BASE_URL` at your deployed API URL.
