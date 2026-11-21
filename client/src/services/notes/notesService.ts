import { axiosClient } from "../api/axiosClient";
import type { ApiResponse, Note, NoteStats } from "@/types";

export interface NotePayload {
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  isPinned?: boolean;
  isArchived?: boolean;
}

export const notesService = {
  async getNotes(params?: {
    category?: string;
    isPinned?: boolean;
    isArchived?: boolean;
    search?: string;
  }): Promise<ApiResponse<{ notes: Note[]; stats: NoteStats }>> {
    const res = await axiosClient.get<ApiResponse<{ notes: Note[]; stats: NoteStats }>>("/notes", {
      params,
    });
    return res.data;
  },

  async getNoteById(id: string): Promise<ApiResponse<Note>> {
    const res = await axiosClient.get<ApiResponse<Note>>(`/notes/${id}`);
    return res.data;
  },

  async createNote(payload: NotePayload): Promise<ApiResponse<Note>> {
    const res = await axiosClient.post<ApiResponse<Note>>("/notes", payload);
    return res.data;
  },

  async updateNote(id: string, payload: Partial<NotePayload>): Promise<ApiResponse<Note>> {
    const res = await axiosClient.put<ApiResponse<Note>>(`/notes/${id}`, payload);
    return res.data;
  },

  async deleteNote(id: string): Promise<ApiResponse<null>> {
    const res = await axiosClient.delete<ApiResponse<null>>(`/notes/${id}`);
    return res.data;
  },
};
