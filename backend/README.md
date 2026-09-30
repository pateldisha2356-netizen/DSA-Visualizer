# DSA Visualizer — Backend

Spring Boot REST API that powers the DSA Visualizer's "Algorithm Engine".
Every sorting, searching, and graph algorithm runs here in Java; each call
returns a full list of **steps** so the frontend can play the run back
frame by frame instead of just receiving a final answer.

## Requirements

- Java 17+
- Maven 3.8+

## Run it

```bash
cd backend
mvn spring-boot:run
```

The API starts on **http://localhost:8080**.

## Project layout

```
backend/
└── src/main/java/com/dsa/visualizer/
    ├── controller/     REST endpoints (thin — validation + routing only)
    ├── service/        Orchestration layer, called by controllers
    ├── algorithms/     Pure algorithm logic (no Spring), one class per algorithm
    ├── model/          Request/response shapes (SortRequest, Step, ...)
    ├── exception/       Centralized error handling
    └── config/          CORS configuration
```

## Endpoints

| Method | Path                  | Body                              | Description |
|--------|-----------------------|------------------------------------|--------------|
| POST   | `/api/sort/{algo}`    | `{ "array": [5,3,8,1] }`          | `algo` = bubble / selection / insertion / merge / quick |
| POST   | `/api/search/{algo}`  | `{ "array": [...], "target": 8 }` | `algo` = linear / binary |
| GET    | `/api/graph`          | —                                  | Returns the sample 8-node graph (nodes + adjacency) |
| POST   | `/api/graph/{algo}`   | `{ "start": "A" }` (optional)     | `algo` = bfs / dfs |
| GET    | `/api/meta`           | —                                  | Time/space complexity + description for every algorithm |
| GET    | `/api/meta/{id}`      | —                                  | Metadata for one algorithm (e.g. `bubble`, `bfs`) |

Every response is a JSON object containing a `steps` array. Each step is a
loose map — only the fields relevant to that moment are present (e.g. a sort
step might include `compare`, `swap`, or `sorted`; a graph step includes
`visited`, `queue`/`stack`, and `current`). The frontend's `api.js` /
`sorting.js` / `searching.js` / `graphs.js` already know how to read these.

## Notes

- CORS is wide open (`allowedOrigins("*")`) for local development. Restrict
  this in `config/CorsConfig.java` before deploying anywhere public.
- Linked List and Binary Search Tree visualizers are **not** backed by this
  API — they run entirely in the browser (see `frontend/js/linked-list.js`
  and `frontend/js/trees.js`). Add `LinkedListController` / `TreeController`
  here if you want to move that logic server-side too.
