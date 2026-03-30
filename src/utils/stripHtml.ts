/**
 * Strips HTML tags from a string and collapses whitespace.
 */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')   // replace tags with space
    .replace(/\s+/g, ' ')        // collapse whitespace
    .trim();
}
