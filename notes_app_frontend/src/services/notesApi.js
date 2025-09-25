//
// Notes API Service - Placeholder for future backend integration
// Provides a documented interface that mirrors CRUD operations used in the app.
// For now, not imported by App to avoid unused warnings; App uses localStorage directly via storageService.
// When backend is ready, swap App to use these functions and wire baseURL/env vars.
//

// PUBLIC_INTERFACE
export function listNotesAPI() {
  /** List notes from backend API (placeholder). */
  throw new Error('Not implemented: integrate with backend at /api/notes');
}

// PUBLIC_INTERFACE
export function createNoteAPI(note) {
  /** Create a note in backend API (placeholder). */
  throw new Error('Not implemented: integrate with backend at POST /api/notes');
}

// PUBLIC_INTERFACE
export function updateNoteAPI(id, updates) {
  /** Update a note in backend API (placeholder). */
  throw new Error('Not implemented: integrate with backend at PATCH /api/notes/:id');
}

// PUBLIC_INTERFACE
export function deleteNoteAPI(id) {
  /** Delete a note in backend API (placeholder). */
  throw new Error('Not implemented: integrate with backend at DELETE /api/notes/:id');
}
