export const LESSON_VISIT_INTERVAL = 24 * 60 * 60 * 1000;

// Reading a lesson again should not repeatedly write the same account record.
// Completion and reading-level changes still save immediately. Never suppress
// quiz checkpoints, which are also used to resume on another device.
export function lessonChangeNeedsSave(previous, change, now = Date.now()) {
  if (change.action !== 'lesson' || !previous) return true;
  if (change.completed === true && !previous.completedAt) return true;
  if (change.readingLevel !== undefined && change.readingLevel !== previous.readingLevel) return true;
  const elapsed = now - previous.lastVisitedAt;
  return !Number.isFinite(elapsed) || elapsed < 0 || elapsed >= LESSON_VISIT_INTERVAL;
}
