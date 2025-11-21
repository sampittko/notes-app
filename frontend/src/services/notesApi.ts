import { Note, NoteInput } from '../types/note';

const API_URL = 'http://localhost:3001/notes';

export async function fetchNotes(): Promise<Note[]> {
  const response = await fetch(`${API_URL}?_sort=createdAt&_order=desc`);
  if (!response.ok) {
    throw new Error('Failed to fetch notes');
  }
  return response.json();
}

export async function createNote(input: NoteInput): Promise<Note> {
  const now = new Date().toISOString();
  const note: Omit<Note, 'id'> = {
    ...input,
    createdAt: now,
    updatedAt: now,
  };

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  });

  if (!response.ok) {
    throw new Error('Failed to create note');
  }
  return response.json();
}

export async function updateNote(note: Note): Promise<Note> {
  const updated: Note = {
    ...note,
    updatedAt: new Date().toISOString(),
  };

  const response = await fetch(`${API_URL}/${note.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updated),
  });

  if (!response.ok) {
    throw new Error('Failed to update note');
  }
  return response.json();
}

export async function deleteNote(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete note');
  }
}
