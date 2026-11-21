import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  Plus,
  Bell,
  FileText,
  Pin,
  Archive,
  MoreVertical,
  Calendar,
  Trash2,
  Edit,
} from "lucide-react";
import Swal from "sweetalert2";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { notesService } from "@/services/notes/notesService";
import type { Note } from "@/types";

export const NotesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filterQuery = searchParams.get("filter");

  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const isPinned = filterQuery === "pinned" ? true : undefined;
      const isArchived = filterQuery === "archived" ? true : false;
      const res = await notesService.getNotes({
        isPinned,
        isArchived,
        search: search.trim() || undefined,
      });

      if (res.success && res.data) {
        setNotes(res.data.notes);
      }
    } catch (err) {
      console.error("Failed to load notes", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [filterQuery, search]);

  const handleTogglePin = async (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notesService.updateNote(note._id, { isPinned: !note.isPinned });
      fetchNotes();
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: note.isPinned ? "Note unpinned" : "Note pinned to top",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleArchive = async (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notesService.updateNote(note._id, { isArchived: !note.isArchived });
      fetchNotes();
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "info",
        title: note.isArchived ? "Restored from archive" : "Note archived",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: "Delete Note?",
      text: "This action cannot be undone. Are you sure you want to delete this note?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#cbd5e1",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-3xl font-['Plus_Jakarta_Sans',sans-serif]",
        confirmButton: "rounded-xl font-semibold px-4 py-2 text-sm",
        cancelButton: "rounded-xl font-semibold px-4 py-2 text-sm text-slate-700",
      },
    });

    if (result.isConfirmed) {
      try {
        await notesService.deleteNote(noteId);
        fetchNotes();
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Note has been permanently removed.",
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup: "rounded-3xl font-['Plus_Jakarta_Sans',sans-serif]",
          },
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const pageTitle = filterQuery === "pinned"
    ? "Pinned Notes"
    : filterQuery === "archived"
    ? "Archived Notes"
    : "My Notes";

  return (
    <div className="flex min-h-screen bg-[#f8faff] font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Sidebar with active tab */}
      <AppSidebar
        activeTab={
          filterQuery === "pinned"
            ? "pinned"
            : filterQuery === "archived"
            ? "archived"
            : "notes"
        }
      />

      {/* Main Notes Area - Pure notes list without any dashboard charts */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your notes..."
              className="w-full pl-11 pr-4 py-2.5 bg-white rounded-2xl border border-slate-200/80 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5850ec]/20 focus:border-[#5850ec] transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/editor")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#5850ec] hover:bg-[#4a42db] text-white text-sm font-semibold shadow-md shadow-indigo-600/20 active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Note</span>
            </button>

            <button
              type="button"
              className="w-10 h-10 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-500 hover:text-slate-700 shadow-sm transition-colors"
            >
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section Heading */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              {pageTitle}
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {notes.length} {notes.length === 1 ? "note" : "notes"} in this view
            </p>
          </div>

          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600">
            All Categories
          </span>
        </div>

        {/* Notes Grid */}
        {isLoading ? (
          <div className="py-16 text-center text-sm text-slate-400">
            Loading notes from database...
          </div>
        ) : notes.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200 p-8 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#5850ec] flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-base font-bold text-slate-800">No notes found here</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {filterQuery === "pinned"
                ? "You haven't pinned any notes yet. Click the pin icon on any note to keep it here."
                : filterQuery === "archived"
                ? "No archived notes found."
                : "Create your first note to start capturing ideas and thoughts."}
            </p>
            <button
              onClick={() => navigate("/editor")}
              className="mt-2 px-5 py-2.5 rounded-xl bg-[#5850ec] text-white text-xs font-semibold hover:bg-[#4a42db] transition-colors"
            >
              Create Note
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {notes.map((note) => (
              <div
                key={note._id}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to={`/editor/${note._id}`}
                      className="font-bold text-slate-800 text-base line-clamp-1 hover:text-[#5850ec] focus:outline-none focus:ring-2 focus:ring-[#5850ec]/30 rounded-lg transition-colors"
                    >
                      {note.title}
                    </Link>

                    <div className="relative">
                      <button
                        type="button"
                        aria-label="Note actions"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === note._id ? null : note._id);
                        }}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeMenuId === note._id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 top-7 w-36 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-20 text-xs"
                        >
                          <Link
                            to={`/editor/${note._id}`}
                            className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-600"
                            onClick={() => setActiveMenuId(null)}
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Note</span>
                          </Link>

                          <button
                            onClick={(e) => {
                              handleTogglePin(note, e);
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-600"
                          >
                            <Pin className="w-3.5 h-3.5" />
                            <span>{note.isPinned ? "Unpin Note" : "Pin Note"}</span>
                          </button>

                          <button
                            onClick={(e) => {
                              handleToggleArchive(note, e);
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-600"
                          >
                            <Archive className="w-3.5 h-3.5" />
                            <span>{note.isArchived ? "Unarchive" : "Archive"}</span>
                          </button>

                          <button
                            onClick={(e) => {
                              handleDelete(note._id, e);
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-600 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {note.content.replace(/<[^>]+>/g, "") || "No content added yet..."}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-50 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-300" />
                    <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium capitalize">
                    {note.category || "Work"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
