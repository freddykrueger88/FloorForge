/**
 * knowledgeRetrieval – einfache Stichwortsuche für den Wissensassistenten
 * (EPIC 010, AI_SYSTEM.md §5.4).
 *
 * Bewusst kein Vektor-/Embedding-Retrieval: für die Datenmenge einer
 * einzelnen Vereinsinstanz reicht ILIKE-Suche aus und erzeugt keine neue
 * KI-Anbieter-Abhängigkeit (CLAUDE.md 5.8 KI-Unabhängigkeit). Sichtbarkeit
 * folgt denselben Regeln wie die jeweiligen List-Endpunkte: Boards = eigene
 * + über board_collaborators geteilte (getBoards), Trainings = eigene +
 * team-geteilte (getSessions), Bibliothekseinträge = instanzweit
 * (listLibrary) – keine neue Rechteausweitung.
 */
import pool from '../../db/pool.js';
import { getUserTeamIds } from '../../utils/teamAccess.js';

const STOPWORDS = new Set([
  'der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einer', 'eines', 'einem', 'einen',
  'und', 'oder', 'für', 'fuer', 'mit', 'von', 'vom', 'zu', 'zum', 'zur', 'im', 'in', 'am', 'an',
  'auf', 'ist', 'sind', 'war', 'waren', 'wir', 'haben', 'hat', 'wie', 'was', 'welche', 'welcher',
  'welches', 'unser', 'unsere', 'unseren', 'unserem', 'gibt', 'es', 'nutzen', 'genutzt', 'uns',
  'the', 'and', 'for', 'with', 'from', 'what', 'which', 'how', 'are', 'do', 'does', 'you',
  'our', 'we', 'have', 'has', 'that', 'this', 'of', 'to', 'on', 'at',
]);

const MAX_KEYWORDS = 8;
const MAX_PER_TYPE = 3;
const EXCERPT_LENGTH = 200;

export function extractKeywords(question) {
  const tokens = (question ?? '')
    .toLowerCase()
    .split(/[^a-zäöüß0-9]+/i)
    .filter((token) => token.length >= 3 && !STOPWORDS.has(token));
  return [...new Set(tokens)].slice(0, MAX_KEYWORDS);
}

function truncate(text) {
  if (!text) return '';
  return text.length > EXCERPT_LENGTH ? `${text.slice(0, EXCERPT_LENGTH)}…` : text;
}

async function findBoards(userId, patterns) {
  const result = await pool.query(
    `SELECT * FROM (
       SELECT id, name, notes, goal, opponent, category, age_group, material, updated_at
       FROM boards
       WHERE user_id = $1 AND deleted_at IS NULL
       UNION ALL
       SELECT b.id, b.name, b.notes, b.goal, b.opponent, b.category, b.age_group, b.material, b.updated_at
       FROM boards b
       JOIN board_collaborators bc ON bc.board_id = b.id
       WHERE bc.user_id = $1 AND b.deleted_at IS NULL
     ) combined
     WHERE name ILIKE ANY($2::text[]) OR notes ILIKE ANY($2::text[]) OR goal ILIKE ANY($2::text[])
        OR opponent ILIKE ANY($2::text[]) OR category ILIKE ANY($2::text[])
        OR age_group ILIKE ANY($2::text[]) OR material ILIKE ANY($2::text[])
     ORDER BY updated_at DESC
     LIMIT ${MAX_PER_TYPE}`,
    [userId, patterns]
  );
  return result.rows.map((row) => ({
    type: 'board',
    id: row.id,
    name: row.name,
    excerpt: truncate([row.notes, row.goal].filter(Boolean).join(' – ')),
  }));
}

async function findTrainings(userId, patterns) {
  const teamIds = await getUserTeamIds(userId);
  const result = await pool.query(
    `SELECT id, name, notes, goal, updated_at
     FROM training_sessions
     WHERE (user_id = $1 OR team_id = ANY($3::uuid[]))
       AND (name ILIKE ANY($2::text[]) OR notes ILIKE ANY($2::text[]) OR goal ILIKE ANY($2::text[]))
     ORDER BY updated_at DESC
     LIMIT ${MAX_PER_TYPE}`,
    [userId, patterns, teamIds]
  );
  return result.rows.map((row) => ({
    type: 'training',
    id: row.id,
    name: row.name,
    excerpt: truncate([row.notes, row.goal].filter(Boolean).join(' – ')),
  }));
}

async function findLibraryEntries(patterns) {
  const result = await pool.query(
    `SELECT id, name, goal, material, category, age_group, updated_at
     FROM library_entries
     WHERE name ILIKE ANY($1::text[]) OR goal ILIKE ANY($1::text[]) OR material ILIKE ANY($1::text[])
        OR category ILIKE ANY($1::text[]) OR age_group ILIKE ANY($1::text[])
     ORDER BY updated_at DESC
     LIMIT ${MAX_PER_TYPE}`,
    [patterns]
  );
  return result.rows.map((row) => ({
    type: 'library',
    id: row.id,
    name: row.name,
    excerpt: truncate([row.goal, row.material].filter(Boolean).join(' – ')),
  }));
}

export async function findRelevantItems(userId, question) {
  const keywords = extractKeywords(question);
  if (keywords.length === 0) {
    return { boards: [], trainings: [], libraryEntries: [] };
  }
  const patterns = keywords.map((keyword) => `%${keyword}%`);
  const [boards, trainings, libraryEntries] = await Promise.all([
    findBoards(userId, patterns),
    findTrainings(userId, patterns),
    findLibraryEntries(patterns),
  ]);
  return { boards, trainings, libraryEntries };
}
