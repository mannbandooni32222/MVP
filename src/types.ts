export type Priority = 'low' | 'medium' | 'high';
export type Category = 'work' | 'personal' | 'health';
export type Status = 'pending' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  time?: string;
  priority: Priority;
  category: Category;
  status: Status;
  date: string; // ISO string (YYYY-MM-DD)
  notes?: string;
}

export interface User {
  username: string;
}

export interface Filters {
  status: Status | 'all';
  priority: Priority | 'all';
  category: Category | 'all';
}
