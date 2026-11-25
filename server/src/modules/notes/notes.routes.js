// @ts-check
import express from "express";
import { Note } from "../../models/Note.js";
import { authenticate } from "../../middleware/authenticate.js";
import { logger } from "../../config/logger.js";

/**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 * @typedef {import("express").NextFunction} NextFunction
 * @typedef {Request & { user: any }} AuthenticatedRequest
 * @typedef {{
 *   userId?: any,
 *   category?: string,
 *   isPinned?: boolean,
 *   isArchived?: boolean,
 *   $or?: Array<Record<string, any>>
 * }} NoteQueryFilter
 */

export const notesRouter = express.Router();

// Protect all note routes with authentication
notesRouter.use(authenticate);

/**
 * GET /api/v1/notes
 * Fetch all notes for the authenticated user, with optional filter by category or status
 */
notesRouter.get("/", async (req, res, next) => {
  const authReq = /** @type {AuthenticatedRequest} */ (req);
  try {
    const { category, isPinned, isArchived, search } = authReq.query;
    /** @type {NoteQueryFilter} */
    const filter = { userId: authReq.user._id };

    if (category && typeof category === "string") filter.category = category;
    if (isPinned !== undefined) filter.isPinned = isPinned === "true";
    if (isArchived !== undefined) filter.isArchived = isArchived === "true";
    if (search && typeof search === "string") {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(String(search), "i")] } },
      ];
    }

    const notes = await Note.find(filter).sort({ isPinned: -1, updatedAt: -1 });

    // Aggregate statistics for dashboard & charts
    const totalCount = await Note.countDocuments({ userId: authReq.user._id });
    const pinnedCount = await Note.countDocuments({ userId: authReq.user._id, isPinned: true });
    const archivedCount = await Note.countDocuments({ userId: authReq.user._id, isArchived: true });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        notes,
        stats: {
          total: totalCount,
          pinned: pinnedCount,
          archived: archivedCount,
        },
      },
    });
  } catch (error) {
    logger.error({ err: error, userId: authReq.user._id }, "Failed to fetch notes");
    return next(error);
  }
});

/**
 * GET /api/v1/notes/:id
 */
notesRouter.get("/:id", async (req, res, next) => {
  const authReq = /** @type {AuthenticatedRequest} */ (req);
  try {
    const note = await Note.findOne({ _id: authReq.params.id, userId: authReq.user._id });
    if (!note) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Note not found",
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: note,
    });
  } catch (error) {
    logger.error({ err: error, noteId: authReq.params.id }, "Failed to fetch single note");
    return next(error);
  }
});

/**
 * POST /api/v1/notes
 */
notesRouter.post("/", async (req, res, next) => {
  const authReq = /** @type {AuthenticatedRequest} */ (req);
  try {
    const { title, content, category, tags, isPinned, isArchived } = authReq.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Note title is required and must be a non-empty string",
      });
    }

    // Validate content is a string if supplied, or default to empty string
    if (content !== undefined && content !== null && typeof content !== "string") {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Note content must be a string",
      });
    }

    const safeContent = typeof content === "string" ? content : "";

    const newNote = await Note.create({
      userId: authReq.user._id,
      title: title.trim(),
      content: safeContent,
      category: typeof category === "string" ? category : "General",
      tags: Array.isArray(tags) ? tags.filter((t) => typeof t === "string") : [],
      isPinned: Boolean(isPinned),
      isArchived: Boolean(isArchived),
    });

    logger.info({ noteId: newNote._id, userId: authReq.user._id }, "Note created in MongoDB");

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Note created successfully",
      data: newNote,
    });
  } catch (error) {
    logger.error({ err: error, userId: authReq.user._id }, "Failed to create note");
    return next(error);
  }
});

/**
 * PUT /api/v1/notes/:id
 */
notesRouter.put("/:id", async (req, res, next) => {
  const authReq = /** @type {AuthenticatedRequest} */ (req);
  try {
    const { title, content, category, tags, isPinned, isArchived } = authReq.body;

    const note = await Note.findOne({ _id: authReq.params.id, userId: authReq.user._id });
    if (!note) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Note not found",
      });
    }

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Note title must be a non-empty string",
        });
      }
      note.title = title.trim();
    }

    // Explicitly validate content type - reject non-strings (e.g. numbers, objects, booleans)
    if (content !== undefined) {
      if (content === null) {
        note.content = "";
      } else if (typeof content === "string") {
        note.content = content;
      } else {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Note content must be a string",
        });
      }
    }

    if (category !== undefined && typeof category === "string") note.category = category;
    if (Array.isArray(tags)) note.tags = tags.filter((t) => typeof t === "string");
    if (isPinned !== undefined) note.isPinned = Boolean(isPinned);
    if (isArchived !== undefined) note.isArchived = Boolean(isArchived);

    await note.save();

    logger.info({ noteId: note._id, userId: authReq.user._id }, "Note updated in MongoDB");

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Note updated successfully",
      data: note,
    });
  } catch (error) {
    logger.error({ err: error, noteId: authReq.params.id }, "Failed to update note");
    return next(error);
  }
});

/**
 * DELETE /api/v1/notes/:id
 */
notesRouter.delete("/:id", async (req, res, next) => {
  const authReq = /** @type {AuthenticatedRequest} */ (req);
  try {
    const deleted = await Note.findOneAndDelete({ _id: authReq.params.id, userId: authReq.user._id });
    if (!deleted) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Note not found",
      });
    }

    logger.info({ noteId: authReq.params.id, userId: authReq.user._id }, "Note deleted from MongoDB");

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Note deleted successfully",
    });
  } catch (error) {
    logger.error({ err: error, noteId: authReq.params.id }, "Failed to delete note");
    return next(error);
  }
});
