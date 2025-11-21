import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Note, NoteInput, NoteValidationErrors } from '../types/note';
import { validateNote } from '../utils/noteValidation';
import * as notesApi from '../services/notesApi';

type NotesState = {
  notes: Note[];
  loading: boolean;
  error: string | null;
  validationErrors: NoteValidationErrors | null;
};

const initialState: NotesState = {
  notes: [],
  loading: false,
  error: null,
  validationErrors: null,
};

export const fetchNotes = createAsyncThunk('notes/fetchNotes', async () => {
  return notesApi.fetchNotes();
});

export const createNote = createAsyncThunk(
  'notes/createNote',
  async (input: NoteInput, { rejectWithValue }) => {
    const errors = validateNote(input);
    if (Object.keys(errors).length > 0) {
      return rejectWithValue(errors);
    }
    return notesApi.createNote(input);
  }
);

export const updateNote = createAsyncThunk(
  'notes/updateNote',
  async (note: Note, { rejectWithValue }) => {
    const errors = validateNote(note);
    if (Object.keys(errors).length > 0) {
      return rejectWithValue(errors);
    }
    return notesApi.updateNote(note);
  }
);

export const deleteNote = createAsyncThunk(
  'notes/deleteNote',
  async (id: string) => {
    await notesApi.deleteNote(id);
    return id;
  }
);

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    clearValidationErrors: (state) => {
      state.validationErrors = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchNotes
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notes';
      })
      // createNote
      .addCase(createNote.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes.unshift(action.payload);
      })
      .addCase(createNote.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.validationErrors = action.payload as NoteValidationErrors;
        } else {
          state.error = action.error.message || 'Failed to create note';
        }
      })
      // updateNote
      .addCase(updateNote.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.notes.findIndex(
          (note) => note.id === action.payload.id
        );
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.validationErrors = action.payload as NoteValidationErrors;
        } else {
          state.error = action.error.message || 'Failed to update note';
        }
      })
      // deleteNote
      .addCase(deleteNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.notes = state.notes.filter((note) => note.id !== action.payload);
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete note';
      });
  },
});

export const { clearValidationErrors, clearError } = notesSlice.actions;
export default notesSlice.reducer;
