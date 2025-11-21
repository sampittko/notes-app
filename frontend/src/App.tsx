import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useEffect, useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Paper,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchNotes, clearError } from './store/notesSlice';
import { NoteForm } from './components/NoteForm';
import { NotesList } from './components/NotesList';
import { Note } from './types/note';

const ALL_CATEGORIES = '';

function App() {
  const dispatch = useAppDispatch();
  const { notes, error, loading } = useAppSelector((state) => state.notes);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [categoryFilter, setCategoryFilter] = useState(ALL_CATEGORIES);

  const categories = useMemo(() => {
    const cats = notes
      .map((note) => note.category)
      .filter((cat): cat is string => !!cat);
    return [...new Set(cats)];
  }, [notes]);

  const filteredNotes = useMemo(() => {
    if (!categoryFilter) {
      return notes;
    }
    return notes.filter((note) => note.category === categoryFilter);
  }, [notes, categoryFilter]);

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  useEffect(() => {
    if (categoryFilter && !categories.includes(categoryFilter)) {
      setCategoryFilter(ALL_CATEGORIES);
    }
  }, [categories, categoryFilter]);

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {error && (
        <Alert
          severity="error"
          onClose={() => dispatch(clearError())}
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {editingNote ? 'Edit Note' : 'Create Note'}
        </Typography>
        <NoteForm
          editingNote={editingNote}
          onCancelEdit={() => setEditingNote(null)}
        />
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Notes {loading && '(loading...)'}
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            label="Category"
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <MenuItem value={ALL_CATEGORIES}>All</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <NotesList notes={filteredNotes} onEdit={setEditingNote} />
      </Paper>
    </Container>
  );
}

export default App;
