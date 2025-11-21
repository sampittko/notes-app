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
  },
});

export const { createNote } = notesSlice.actions;
export default notesSlice.reducer;
