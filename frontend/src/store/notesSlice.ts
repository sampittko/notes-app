import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Note, NoteInput, NoteValidationErrors } from '../types/note';
import {
  loadNotesFromStorage,
  saveNotesToStorage,
} from '../utils/notesStorage';
import { validateNote } from '../utils/noteValidation';

type NotesState = {
  notes: Note[];
  validationErrors: NoteValidationErrors | null;
};

const initialState: NotesState = {
  notes: loadNotesFromStorage(),
  validationErrors: null,
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    createNote: (state, action: PayloadAction<NoteInput>) => {
      const errors = validateNote(action.payload);
      if (Object.keys(errors).length > 0) {
        state.validationErrors = errors;
        return;
      }
      state.validationErrors = null;
      state.notes.push({
        ...action.payload,
        id: crypto.randomUUID(),
      });
      saveNotesToStorage(state.notes);
    },
    updateNote: (state, action: PayloadAction<Note>) => {
      const errors = validateNote(action.payload);
      if (Object.keys(errors).length > 0) {
        state.validationErrors = errors;
        return;
      }
      state.validationErrors = null;
      const index = state.notes.findIndex(
        (note) => note.id === action.payload.id
      );
      if (index !== -1) {
        state.notes[index] = action.payload;
        saveNotesToStorage(state.notes);
      }
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter((note) => note.id !== action.payload);
      saveNotesToStorage(state.notes);
    },
    clearValidationErrors: (state) => {
      state.validationErrors = null;
    },
  },
});

export const { createNote, updateNote, deleteNote, clearValidationErrors } =
  notesSlice.actions;
export default notesSlice.reducer;
