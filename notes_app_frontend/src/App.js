import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

/**
 * Notes App - Ocean Professional Theme
 * - Top navigation bar with title and Add Note button
 * - Main area displays notes as cards
 * - Users can create, view, edit, and delete notes
 * - Local state and localStorage for persistence now; API service ready for future backend
 * - Smooth transitions, rounded corners, subtle shadows, gradients, blue & amber accents
 */

/** Theme constants based on Ocean Professional style guide */
const OCEAN_THEME = {
  name: 'Ocean Professional',
  colors: {
    primary: '#2563EB', // blue
    secondary: '#F59E0B', // amber
    success: '#F59E0B',
    error: '#EF4444',
    background: '#f9fafb',
    surface: '#ffffff',
    text: '#111827',
    gradientFrom: 'rgba(59,130,246,0.08)', // blue-500/10
    gradientTo: '#f9fafb', // to gray-50
  },
};

/** Utilities */
// Simple ID generator for demo purposes. In a backend-ready app, IDs will come from server.
const genId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

/** Local storage keys */
const LS_NOTES_KEY = 'notes_app_notes';
const LS_THEME_KEY = 'notes_app_theme';

/** Models */
/**
 * @typedef {Object} Note
 * @property {string} id
 * @property {string} title
 * @property {string} content
 * @property {number} updatedAt
 */

/** Storage service: abstracted for future backend switch */
const storageService = {
  // PUBLIC_INTERFACE
  listNotes: () => {
    /** Returns all notes from storage. */
    const raw = localStorage.getItem(LS_NOTES_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },
  // PUBLIC_INTERFACE
  saveNotes: (notes) => {
    /** Saves notes array to storage. */
    localStorage.setItem(LS_NOTES_KEY, JSON.stringify(notes));
  },
};

/** Hooks */
// PUBLIC_INTERFACE
function useNotes() {
  /** Manage notes state with localStorage persistence and CRUD helpers. */
  const [notes, setNotes] = useState(() => storageService.listNotes());

  useEffect(() => {
    storageService.saveNotes(notes);
  }, [notes]);

  // PUBLIC_INTERFACE
  const addNote = (partial = { title: '', content: '' }) => {
    const now = Date.now();
    const newNote = { id: genId(), title: partial.title || 'Untitled', content: partial.content || '', updatedAt: now };
    setNotes((prev) => [newNote, ...prev]);
    return newNote;
  };

  // PUBLIC_INTERFACE
  const updateNote = (id, updates) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n)),
    );
  };

  // PUBLIC_INTERFACE
  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return { notes, addNote, updateNote, deleteNote };
}

/** UI Components */

// PUBLIC_INTERFACE
function TopBar({ themeMode, onToggleTheme, onAddNote }) {
  /** Top navigation bar with title and Add Note button. */
  return (
    <header className="op-topbar" role="banner">
      <div className="op-brand">
        <span className="op-logo" aria-hidden>🗒️</span>
        <h1 className="op-title">Ocean Notes</h1>
      </div>
      <div className="op-actions">
        <button className="op-btn op-btn-secondary" onClick={onAddNote} aria-label="Add note">
          + Add Note
        </button>
        <button className="op-btn op-btn-ghost" onClick={onToggleTheme} aria-label="Toggle theme">
          {themeMode === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
}

// PUBLIC_INTERFACE
function NoteFormInline({ note, onCancel, onSave }) {
  /** Inline editor for creating/editing a note within the card */
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');

  return (
    <div className="op-form">
      <input
        className="op-input"
        placeholder="Note title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Note title"
      />
      <textarea
        className="op-textarea"
        placeholder="Write your note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        aria-label="Note content"
        rows={4}
      />
      <div className="op-form-actions">
        <button
          className="op-btn op-btn-primary"
          onClick={() => onSave({ title: title.trim() || 'Untitled', content })}
        >
          Save
        </button>
        <button className="op-btn op-btn-ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function NoteCard({ note, onEdit, onDelete }) {
  /** Card view for a single note with edit and delete actions */
  const dateStr = useMemo(() => new Date(note.updatedAt).toLocaleString(), [note.updatedAt]);
  return (
    <article className="op-card" aria-label={`Note ${note.title}`}>
      <div className="op-card-header">
        <h3 className="op-card-title">{note.title}</h3>
        <div className="op-card-actions">
          <button className="op-icon-btn" onClick={onEdit} aria-label="Edit note">✏️</button>
          <button className="op-icon-btn danger" onClick={onDelete} aria-label="Delete note">🗑️</button>
        </div>
      </div>
      <p className="op-card-content">{note.content || <span className="op-muted">No content</span>}</p>
      <div className="op-card-meta">Updated: {dateStr}</div>
    </article>
  );
}

// PUBLIC_INTERFACE
function NotesGrid({ notes, onEdit, onDelete }) {
  /** Grid/list that renders note cards */
  if (notes.length === 0) {
    return (
      <div className="op-empty">
        <div className="op-empty-hero">🌊</div>
        <h2>No notes yet</h2>
        <p className="op-muted">Click "Add Note" to create your first note.</p>
      </div>
    );
  }
  return (
    <div className="op-grid">
      {notes.map((n) => (
        <NoteCard
          key={n.id}
          note={n}
          onEdit={() => onEdit(n)}
          onDelete={() => onDelete(n)}
        />
      ))}
    </div>
  );
}

/** Main App component */
// PUBLIC_INTERFACE
function App() {
  /** Root UI and state wiring for the Notes App. */
  const { notes, addNote, updateNote, deleteNote } = useNotes();

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(LS_THEME_KEY);
    return saved === 'dark' ? 'dark' : 'light';
  });

  const [editingNoteId, setEditingNoteId] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(LS_THEME_KEY, theme);
  }, [theme]);

  const startAddNote = () => {
    const created = addNote({ title: 'New Note', content: '' });
    setEditingNoteId(created.id);
  };

  const handleEdit = (note) => setEditingNoteId(note.id);

  const handleSaveEdit = (id, data) => {
    updateNote(id, data);
    setEditingNoteId(null);
  };

  const handleDelete = (note) => {
    if (window.confirm(`Delete note "${note.title}"?`)) {
      deleteNote(note.id);
      if (editingNoteId === note.id) setEditingNoteId(null);
    }
  };

  return (
    <div className="op-app" style={{ background: OCEAN_THEME.colors.background, color: OCEAN_THEME.colors.text }}>
      <TopBar
        themeMode={theme}
        onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        onAddNote={startAddNote}
      />

      <main className="op-main">
        {editingNoteId && (
          <section className="op-editor-section">
            <div className="op-editor-card">
              <h2 className="op-section-title">Edit Note</h2>
              <NoteFormInline
                note={notes.find((n) => n.id === editingNoteId)}
                onCancel={() => setEditingNoteId(null)}
                onSave={(data) => handleSaveEdit(editingNoteId, data)}
              />
            </div>
          </section>
        )}

        <section>
          <div className="op-section-head">
            <h2 className="op-section-title">Your Notes</h2>
          </div>
          <NotesGrid
            notes={notes}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </section>
      </main>

      <footer className="op-footer">
        <span>Ocean Professional UI • Ready for API integration</span>
      </footer>
    </div>
  );
}

export default App;
