/**
 * teamAccess – zentraler Zugriffs-Helper für Teams + deren team-geteilte
 * Ressourcen (Kader, Playbooks, Trainingspläne, Formationsvorlagen),
 * ROADMAP Phase 2 (Team und Organisation).
 *
 * Analog zu boardAccess.js: role-Hierarchie statt read/write, da Teams
 * (anders als einzelne Boards) einen dritten Zustand brauchen – "darf
 * team-geteilte Inhalte anlegen/bearbeiten" (coach) vs. "darf nur lesen"
 * (member). owner verwaltet zusätzlich Mitglieder/Rollen (siehe
 * teamsController.js, dort direkt auf role === 'owner' geprüft statt
 * über assertTeamAccess, analog zum strikten Owner-only-Muster bei
 * board_collaborators).
 */
import pool from '../db/pool.js';

// Alle Team-IDs, in denen der Nutzer Mitglied ist (jede Rolle)
export async function getUserTeamIds(userId) {
  const result = await pool.query(
    'SELECT team_id FROM team_members WHERE user_id = $1',
    [userId]
  );
  return result.rows.map((r) => r.team_id);
}

// Gibt 'owner' | 'coach' | 'member' | null zurück
export async function getTeamRole(teamId, userId) {
  const result = await pool.query(
    'SELECT role FROM team_members WHERE team_id = $1 AND user_id = $2',
    [teamId, userId]
  );
  return result.rows[0]?.role ?? null;
}

const ROLE_RANK = { member: 0, coach: 1, owner: 2 };

export async function assertTeamAccess(teamId, userId, required = 'member') {
  const role = await getTeamRole(teamId, userId);
  if (!role) return false;
  return ROLE_RANK[role] >= ROLE_RANK[required];
}
