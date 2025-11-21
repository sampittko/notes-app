import { NoteInput, NoteValidationErrors } from '../types/note';

export const NOTE_CONSTRAINTS = {
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
  CATEGORY_MAX_LENGTH: 50,
} as const;

export function validateNote(note: NoteInput): NoteValidationErrors {
  const errors: NoteValidationErrors = {};

  // Title validation
  if (!note.title || note.title.trim().length === 0) {
    errors.title = 'Title is required';
  } else if (note.title.length > NOTE_CONSTRAINTS.TITLE_MAX_LENGTH) {
    errors.title = `Title must be at most ${NOTE_CONSTRAINTS.TITLE_MAX_LENGTH} characters`;
  }

  // Description validation
  if (
    note.description &&
    note.description.length > NOTE_CONSTRAINTS.DESCRIPTION_MAX_LENGTH
  ) {
    errors.description = `Description must be at most ${NOTE_CONSTRAINTS.DESCRIPTION_MAX_LENGTH} characters`;
  }

  // Category validation
  if (
    note.category &&
    note.category.length > NOTE_CONSTRAINTS.CATEGORY_MAX_LENGTH
  ) {
    errors.category = `Category must be at most ${NOTE_CONSTRAINTS.CATEGORY_MAX_LENGTH} characters`;
  }

  return errors;
}

export function isValidNoteInput(note: NoteInput): boolean {
  const errors = validateNote(note);
  return Object.keys(errors).length === 0;
}
