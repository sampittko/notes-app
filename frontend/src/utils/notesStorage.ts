import { Note } from '../types/note';

function isValidNote(note: unknown): note is Note {
  return (
    typeof note === 'object' &&
    note !== null &&
    typeof (note as Note).id === 'string' &&
    typeof (note as Note).title === 'string'
  );
}

export function loadNotesFromStorage(): Note[] {
  try {
    const data = JSON.parse(localStorage.getItem('notes') || '[]');
    if (Array.isArray(data) && data.every(isValidNote)) {
      return data;
    }
    return [];
  } catch {
    return [];
  }
}

export function saveNotesToStorage(notes: Note[]): void {
  localStorage.setItem('notes', JSON.stringify(notes));
}
