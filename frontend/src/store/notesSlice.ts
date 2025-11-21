import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Note } from '../types/note';
import {
  loadNotesFromStorage,
  saveNotesToStorage,
} from '../utils/notesStorage';

type NotesState = {
  notes: Note[];
};

const initialState: NotesState = {
  notes: loadNotesFromStorage(),
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    createNote: (state, action: PayloadAction<Omit<Note, 'id'>>) => {
      state.notes.push({
        ...action.payload,
        id: crypto.randomUUID(),
      });
      saveNotesToStorage(state.notes);
    },
    updateNote: (state, action: PayloadAction<Note>) => {
      const index = state.notes.findIndex(
        (note) => note.id === action.payload.id
      );
      if (index !== -1) {
        state.notes[index] = action.payload;
        saveNotesToStorage(state.notes);
      }
    },
  },
});

export const { createNote, updateNote } = notesSlice.actions;
export default notesSlice.reducer;
