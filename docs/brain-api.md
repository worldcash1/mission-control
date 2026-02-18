# Brain / Notes API Documentation

## Overview
The Brain feature provides a "second brain" for capturing thoughts, links, reminders, ideas, and snippets in one centralized place.

## API Endpoint
**Base URL**: `https://reminiscent-avocet-969.convex.cloud/api/notes`

## Create a Note

### POST /api/notes
Add a new note to the brain.

**Request Body**:
```json
{
  "text": "Your note content here",
  "category": "general",  // optional: "general" | "trading" | "health" | "ideas" | "research" | "personal" | "work"
  "tags": ["link", "todo"],  // optional: array of tags
  "source": "alfred"  // optional: "web" | "discord" | "alfred" | "manual"
}
```

**Required**:
- `text` (string): The note content

**Optional**:
- `category` (string): Categorize the note
- `tags` (array): Auto-tags like "link", "todo", or custom tags
- `source` (string): Where the note came from (defaults to "alfred")

**Response**:
```json
{
  "success": true,
  "id": "jd7f6s8d9f7s6d8f7s6d8f7s6d8f7s6d"
}
```

## Examples

### Basic Note
```bash
curl -X POST https://reminiscent-avocet-969.convex.cloud/api/notes \
  -H "Content-Type: application/json" \
  -d '{"text": "Remember to check Schwab auth tomorrow", "source": "alfred"}'
```

### Categorized Note with Tags
```bash
curl -X POST https://reminiscent-avocet-969.convex.cloud/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "text": "New trading strategy: momentum + RSI crossover",
    "category": "trading",
    "tags": ["strategy", "research"],
    "source": "alfred"
  }'
```

### Link Note
```bash
curl -X POST https://reminiscent-avocet-969.convex.cloud/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Interesting article on Convex: https://convex.dev/blog",
    "category": "ideas",
    "tags": ["link"],
    "source": "alfred"
  }'
```

## List Notes

### GET /api/notes
Retrieve all non-archived notes.

**Response**:
```json
[
  {
    "_id": "...",
    "text": "Note content",
    "category": "general",
    "tags": ["link"],
    "pinned": false,
    "archived": false,
    "source": "alfred",
    "createdAt": 1708264800000,
    "updatedAt": 1708264900000,
    "_creationTime": 1708264800000
  }
]
```

## Alfred Integration

When the user says things like:
- "remember this..."
- "note this down..."
- "brain dump..."
- "save this..."

Alfred should call the `/api/notes` endpoint with:
- `text`: The content to remember
- `source`: "alfred"
- `category`: Auto-detect from context (trading mentions → "trading", health → "health", etc.)
- `tags`: Auto-detect links and TODOs

### Auto-Detection Rules

**Categories**:
- Mentions of stocks, trading, options → `"trading"`
- Health, fitness, Oura, sleep → `"health"`
- Creative concepts, new ideas → `"ideas"`
- Research, learning → `"research"`
- Personal life, family → `"personal"`
- Work, projects → `"work"`
- Everything else → `"general"`

**Tags**:
- Contains "http://" or "https://" → add `"link"` tag
- Contains "TODO" or "todo" → add `"todo"` tag

## Frontend Access
Users can view and manage all notes at: `https://mission-control.vercel.app/brain`

Features:
- Quick capture with Enter to submit
- Category filters
- Search
- Pin important notes
- Archive old notes
- Inline editing
- Relative timestamps

## Notes
- The API accepts CORS requests from any origin
- All notes are stored in Convex with timestamps
- Pinned notes appear at the top
- Archived notes are hidden by default but can be toggled visible
- The frontend auto-detects links and makes them clickable
