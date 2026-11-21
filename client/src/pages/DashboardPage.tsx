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
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useAuthStore } from "@/stores/authStore";
import { notesService } from "@/services/notes/notesService";
import type { Note, NoteStats } from "@/types";
import { cn } from "@/utils";

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filterQuery = searchParams.get("filter");

  const { user } = useAuthStore();
  const [notes, setNotes] = useState<Note[]>([]);
  const [stats, setStats] = useState<NoteStats>({ total: 0, pinned: 0, archived: 0 });
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
        setStats(res.data.stats);
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
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleArchive = async (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notesService.updateNote(note._id, { isArchived: !note.isArchived });
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await notesService.deleteNote(noteId);
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  // Mock weekly trends data for recharts area graph
  const chartData = [
    { day: "Mon", notes: 2 },
    { day: "Tue", notes: 5 },
    { day: "Wed", notes: stats.total > 4 ? stats.total - 2 : 3 },
    { day: "Thu", notes: 6 },
    { day: "Fri", notes: stats.total || 4 },
    { day: "Sat", notes: 8 },
    { day: "Sun", notes: stats.total + 1 || 9 },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8faff] font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Sidebar */}
      <AppSidebar
        activeTab={
          filterQuery === "pinned"
            ? "pinned"
            : filterQuery === "archived"
            ? "archived"
            : "dashboard"
        }
      />

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between gap-4 mb-8">
          {/* Search Box */}
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

          {/* Right Header Action Controls */}
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

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <span>Good Morning, {user?.name?.split(" ")[0] || "Ammar"}!</span>
            <span>👋</span>
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            Here&apos;s your notes for today.
          </p>
        </div>

        {/* Interactive Analytics Chart and Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
          {/* Recharts Analytics Card */}
          <div className="lg:col-span-3 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Notes Activity & Creation Trend
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time visualization of created and active notes
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-[#5850ec]">
                Live Analytics
              </span>
            </div>

            <div className="h-44 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="notesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5850ec" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#5850ec" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0c0f24",
                      borderRadius: "12px",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="notes"
                    stroke="#5850ec"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#notesGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Metrics Column */}
          <div className="space-y-3 flex flex-col justify-between">
            {/* Total Notes */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-slate-800">
                  {stats.total}
                </div>
                <div className="text-xs text-slate-400 font-medium">Total Notes</div>
              </div>
            </div>

            {/* Pinned Notes */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                <Pin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-slate-800">
                  {stats.pinned}
                </div>
                <div className="text-xs text-slate-400 font-medium">Pinned</div>
              </div>
            </div>

            {/* Archived Notes */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Archive className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-slate-800">
                  {stats.archived}
                </div>
                <div className="text-xs text-slate-400 font-medium">Archived</div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Grid Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Your Notes</h2>
            <span className="text-xs font-medium text-slate-400 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
              Newest First
            </span>
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-sm text-slate-400">
              Loading notes from database...
            </div>
          ) : notes.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-200 p-8 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#5850ec] flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700">No notes found</p>
              <p className="text-xs text-slate-400">
                Click &quot;New Note&quot; to create your first note stored directly in MongoDB.
              </p>
              <button
                onClick={() => navigate("/editor")}
                className="px-4 py-2 rounded-xl bg-[#5850ec] text-white text-xs font-semibold hover:bg-[#4a42db] transition-colors"
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
                              className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 flex items-center gap-2"
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
        </div>
      </main>
    </div>
  );
};
