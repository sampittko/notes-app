import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Chip,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { deleteNote } from '../store/notesSlice';
import { Note } from '../types/note';

type NotesListProps = {
  onEdit: (note: Note) => void;
};

export function NotesList({ onEdit }: NotesListProps) {
  const dispatch = useAppDispatch();
  const { notes, loading } = useAppSelector((state) => state.notes);

  if (notes.length === 0) {
    return <Typography color="text.secondary">No notes yet.</Typography>;
  }

  return (
    <List>
      {notes.map((note) => (
        <ListItem
          key={note.id}
          secondaryAction={
            <Box>
              <IconButton onClick={() => onEdit(note)} disabled={loading}>
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={() => dispatch(deleteNote(note.id))}
                disabled={loading}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          }
        >
          <ListItemText
            primary={note.title}
            secondary={
              <>
                {note.description && <span>{note.description}</span>}
                {note.category && (
                  <Chip
                    label={note.category}
                    size="small"
                    sx={{ ml: 1 }}
                    component="span"
                  />
                )}
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );
}
