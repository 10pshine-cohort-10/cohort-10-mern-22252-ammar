import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Tag,
  X,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Undo,
  Redo,
} from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Swal from "sweetalert2";
import { notesService } from "@/services/notes/notesService";
import { cn } from "@/utils";

export const NoteEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Work");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(["Work", "Web Dev"]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(id));

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: "list-disc pl-6 space-y-1 my-2",
          },
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: "list-decimal pl-6 space-y-1 my-2",
          },
        },
        heading: {
          levels: [1, 2],
          HTMLAttributes: {
            class: "font-extrabold text-slate-800 my-2",
          },
        },
      }),
      Placeholder.configure({
        placeholder: "Write your note here... supports headings, bold, italic, lists, and links.",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#5850ec] underline font-medium",
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: "prose prose-slate max-w-none focus:outline-none min-h-[320px] text-sm text-slate-700 leading-relaxed",
      },
    },
    content: "<p>Build a modern notes app with:</p><ul><li>Authentication</li><li>Rich text editor</li><li>Real-time updates</li></ul><p>Let's make it awesome! 🚀</p>",
  });

  useEffect(() => {
    if (!id) return;
    const fetchNote = async () => {
      try {
        const res = await notesService.getNoteById(id);
        if (res.success && res.data) {
          setTitle(res.data.title);
          setCategory(res.data.category || "Work");
          setTags(res.data.tags || []);
          if (editor) {
            editor.commands.setContent(res.data.content);
          }
        }
      } catch (err) {
        console.error("Failed to load note", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Could not load note from MongoDB",
        });
      } finally {
        setIsLoading(false);
      }
    };
    if (editor) {
      fetchNote();
    }
  }, [id, editor]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSetLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Title Required",
        text: "Please enter a title for your note before saving.",
        confirmButtonColor: "#5850ec",
      });
      return;
    }

    setIsSaving(true);
    try {
      const contentHtml = editor?.getHTML() || "";
      if (id) {
        await notesService.updateNote(id, {
          title: title.trim(),
          content: contentHtml,
          category,
          tags,
        });
      } else {
        await notesService.createNote({
          title: title.trim(),
          content: contentHtml,
          category,
          tags,
        });
      }

      await Swal.fire({
        icon: "success",
        title: "Saved!",
        text: "Your note has been saved to MongoDB.",
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup: "rounded-3xl font-['Plus_Jakarta_Sans',sans-serif]",
        },
      });

      navigate("/notes");
    } catch (err) {
      console.error("Save note error:", err);
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: "Failed to save note to MongoDB. Check server connection.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8faff] flex items-center justify-center text-slate-400 text-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading note from MongoDB...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faff] font-['Plus_Jakarta_Sans',sans-serif] p-6 lg:p-10 flex flex-col justify-between">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <button
            onClick={() => navigate("/notes")}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/notes")}
              className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#5850ec] hover:bg-[#4a42db] text-white text-xs font-semibold shadow-md shadow-indigo-600/20 active:scale-[0.98] transition-all disabled:opacity-70"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save Note"}</span>
            </button>
          </div>
        </div>

        {/* Title Input */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title..."
            className="w-full text-2xl font-extrabold text-slate-800 placeholder:text-slate-300 focus:outline-none"
          />
        </div>

        {/* Professional TipTap Toolbar matching design */}
        {editor && (
          <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-600 shadow-sm">
            {/* Bold */}
            <button
              type="button"
              title="Bold (Ctrl+B)"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center font-bold transition-all",
                editor.isActive("bold")
                  ? "bg-[#5850ec] text-white shadow-sm"
                  : "hover:bg-slate-200 text-slate-700"
              )}
            >
              <Bold className="w-4 h-4" />
            </button>

            {/* Italic */}
            <button
              type="button"
              title="Italic (Ctrl+I)"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                editor.isActive("italic")
                  ? "bg-[#5850ec] text-white shadow-sm"
                  : "hover:bg-slate-200 text-slate-700"
              )}
            >
              <Italic className="w-4 h-4" />
            </button>

            {/* Strike */}
            <button
              type="button"
              title="Strikethrough"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                editor.isActive("strike")
                  ? "bg-[#5850ec] text-white shadow-sm"
                  : "hover:bg-slate-200 text-slate-700"
              )}
            >
              <UnderlineIcon className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-slate-300 mx-1" />

            {/* Headings */}
            <button
              type="button"
              title="Heading 1"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                editor.isActive("heading", { level: 1 })
                  ? "bg-[#5850ec] text-white shadow-sm"
                  : "hover:bg-slate-200 text-slate-700"
              )}
            >
              <Heading1 className="w-4 h-4" />
            </button>

            <button
              type="button"
              title="Heading 2"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                editor.isActive("heading", { level: 2 })
                  ? "bg-[#5850ec] text-white shadow-sm"
                  : "hover:bg-slate-200 text-slate-700"
              )}
            >
              <Heading2 className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-slate-300 mx-1" />

            {/* Bullet List */}
            <button
              type="button"
              title="Bullet List"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                editor.isActive("bulletList")
                  ? "bg-[#5850ec] text-white shadow-sm"
                  : "hover:bg-slate-200 text-slate-700"
              )}
            >
              <List className="w-4 h-4" />
            </button>

            {/* Numbered List */}
            <button
              type="button"
              title="Numbered List"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                editor.isActive("orderedList")
                  ? "bg-[#5850ec] text-white shadow-sm"
                  : "hover:bg-slate-200 text-slate-700"
              )}
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-slate-300 mx-1" />

            {/* Link */}
            <button
              type="button"
              title="Insert Link"
              onClick={handleSetLink}
              className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                editor.isActive("link")
                  ? "bg-[#5850ec] text-white shadow-sm"
                  : "hover:bg-slate-200 text-slate-700"
              )}
            >
              <LinkIcon className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-slate-300 mx-1" />

            {/* Undo / Redo */}
            <button
              type="button"
              title="Undo"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-200 text-slate-700 disabled:opacity-30"
            >
              <Undo className="w-4 h-4" />
            </button>

            <button
              type="button"
              title="Redo"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-200 text-slate-700 disabled:opacity-30"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Editor Area with explicit list styles */}
        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 min-h-[340px]">
          <EditorContent editor={editor} />
        </div>

        {/* Tags Section */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5 mr-2">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            Tags:
          </span>

          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 text-[#5850ec] text-xs font-semibold"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-indigo-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Add tag and press Enter..."
            className="text-xs bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#5850ec]"
          />
        </div>
      </div>
    </div>
  );
};
