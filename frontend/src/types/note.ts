export type Note = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
};

export type NoteInput = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;

export type NoteValidationErrors = {
  title?: string;
  description?: string;
  category?: string;
};
