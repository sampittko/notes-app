import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useEffect, useState } from 'react';
import { Container, Typography, Paper, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchNotes, clearError } from './store/notesSlice';
import { NoteForm } from './components/NoteForm';
import { NotesList } from './components/NotesList';
import { Note } from './types/note';

function App() {
  const dispatch = useAppDispatch();
  const { error, loading } = useAppSelector((state) => state.notes);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

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
        <NotesList onEdit={setEditingNote} />
      </Paper>
    </Container>
  );
}

export default App;
