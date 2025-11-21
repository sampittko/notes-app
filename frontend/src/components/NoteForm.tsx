import { useState, useEffect } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  createNote,
  updateNote,
  clearValidationErrors,
} from '../store/notesSlice';
import { Note } from '../types/note';
import { NOTE_CONSTRAINTS } from '../utils/noteValidation';

type NoteFormProps = {
  editingNote: Note | null;
  onCancelEdit: () => void;
};

export function NoteForm({ editingNote, onCancelEdit }: NoteFormProps) {
  const dispatch = useAppDispatch();
  const { validationErrors, loading } = useAppSelector((state) => state.notes);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setDescription(editingNote.description || '');
      setCategory(editingNote.category || '');
    } else {
      setTitle('');
      setDescription('');
      setCategory('');
    }
    dispatch(clearValidationErrors());
  }, [editingNote, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const noteData = {
      title,
      description: description || undefined,
      category: category || undefined,
    };

    if (editingNote) {
      const result = await dispatch(
        updateNote({
          ...editingNote,
          ...noteData,
        })
      );
      if (updateNote.fulfilled.match(result)) {
        onCancelEdit();
      }
    } else {
      const result = await dispatch(createNote(noteData));
      if (createNote.fulfilled.match(result)) {
        setTitle('');
        setDescription('');
        setCategory('');
      }
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    dispatch(clearValidationErrors());
    onCancelEdit();
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={!!validationErrors?.title}
        helperText={
          validationErrors?.title ||
          `${title.length}/${NOTE_CONSTRAINTS.TITLE_MAX_LENGTH}`
        }
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={!!validationErrors?.description}
        helperText={
          validationErrors?.description ||
          `${description.length}/${NOTE_CONSTRAINTS.DESCRIPTION_MAX_LENGTH}`
        }
        fullWidth
        margin="normal"
        multiline
        rows={3}
      />
      <TextField
        label="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        error={!!validationErrors?.category}
        helperText={
          validationErrors?.category ||
          `${category.length}/${NOTE_CONSTRAINTS.CATEGORY_MAX_LENGTH}`
        }
        fullWidth
        margin="normal"
      />
      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <Button type="submit" variant="contained" disabled={loading}>
          {editingNote ? 'Update' : 'Create'}
        </Button>
        {editingNote && (
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
        )}
      </Box>
    </Box>
  );
}
