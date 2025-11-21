import { Note } from '../types/note';

function isValidNote(note: unknown): note is Note {
  if (typeof note !== 'object' || note === null) {
    return false;
  }

  const { id, title, description, category, createdAt, updatedAt } =
    note as Note;

  if (typeof id !== 'string' || typeof title !== 'string') {
    return false;
  }

  if (description != null && typeof description !== 'string') {
    return false;
  }

  if (category != null && typeof category !== 'string') {
    return false;
  }

  if (
    typeof createdAt !== 'string' ||
    typeof updatedAt !== 'string' ||
    isNaN(new Date(createdAt).getTime()) ||
    isNaN(new Date(updatedAt).getTime())
  ) {
    return false;
  }

  return true;
}

export function loadNotesFromStorage(): Note[] {
  try {
    const data = JSON.parse(localStorage.getItem('notes') || '[]');
    if (Array.isArray(data) && data.every(isValidNote)) {
      return data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return [];
  } catch {
    return [];
  }
}

export function saveNotesToStorage(notes: Note[]): void {
  localStorage.setItem('notes', JSON.stringify(notes));
}
