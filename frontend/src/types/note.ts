export type Note = {
  id: string;
  title: string;
  description?: string;
  category?: string;
};

export type NoteInput = Omit<Note, 'id'>;

export type NoteValidationErrors = {
  title?: string;
  description?: string;
  category?: string;
};
