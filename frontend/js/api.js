/* =========================================================
   DSA LAB — api.js
   Thin wrapper around the Spring Boot backend's REST API.
   Every visualizer page that talks to the backend (sorting,
   searching, graphs) goes through the functions below instead
   of calling fetch() directly, so the base URL and error
   handling live in exactly one place.

   Linked List and Trees do NOT use this file — they run
   entirely client-side (see linked-list.js / trees.js).
   ========================================================= */

const DsaApi = (() => {
  // Live Spring Boot backend deployed on Render.
  const BASE_URL = 'https://dsa-visualizer-backend-6heu.onrender.com/api';

  async function request(path, options) {
    let res;
    try {
      res = await fetch(BASE_URL + path, options);
    } catch (err) {
      throw new Error(
        'Could not reach the backend at ' + BASE_URL + '. Please try again.'
      );
    }

    let data;
    try {
      data = await res.json();
    } catch (err) {
      throw new Error('Backend returned an invalid response.');
    }

    if (!res.ok) {
      throw new Error(
        data && data.error
          ? data.error
          : ('Request failed with status ' + res.status)
      );
    }

    return data;
  }

  return {
    BASE_URL,

    /** POST /api/sort/{algorithm}  body: { array } */
    sort(algorithm, array) {
      return request('/sort/' + algorithm, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ array }),
      });
    },

    /** POST /api/search/{algorithm}  body: { array, target } */
    search(algorithm, array, target) {
      return request('/search/' + algorithm, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ array, target }),
      });
    },

    /** GET /api/graph — node positions + adjacency list */
    getGraph() {
      return request('/graph', { method: 'GET' });
    },

    /** POST /api/graph/{algorithm}  body: { start } */
    traverseGraph(algorithm, start) {
      return request('/graph/' + algorithm, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start }),
      });
    },

    /** GET /api/meta — complexity + description for every algorithm */
    getAllMeta() {
      return request('/meta', { method: 'GET' });
    },

    /** GET /api/meta/{id} */
    getMeta(id) {
      return request('/meta/' + id, { method: 'GET' });
    },
  };
})();
