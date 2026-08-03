/**
 * LinesPanel – Lines-Verwaltung (Sturm-/Defensivreihen)
 * (Issue #12 – v0.4.0)
 *
 * - Line anlegen (Name + Farbe + Typ)
 * - Spieler einer Line per Klick zu-/abwählen
 * - Line aktivieren → Spieler dieser Line werden auf dem Feld hervorgehoben
 * - Umbenennen + Löschen
 * - Max. 10 Lines pro Board
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LinesPanel.module.css';

const TYPE_LABEL_KEYS = { offense: 'lines.typeOffense', defense: 'lines.typeDefense', special: 'lines.typeSpecial' };
const PRESET_COLORS = ['#facc15', '#22c55e', '#3b82f6', '#ef4444', '#a855f7', '#06b6d4'];

export default function LinesPanel({
  lines = [],
  activeLineId,
  players = [],
  onAddLine,
  onRenameLine,
  onDeleteLine,
  onSetActiveLine,
  onTogglePlayer,
  canAddLine = true,
}) {
  const { t } = useTranslation();
  const [collapsed,   setCollapsed  ] = useState(false);
  const [editingId,   setEditingId  ] = useState(null); // welche Line wird gerade bearbeitet (Spieler zuweisen)
  const [renamingId,  setRenamingId ] = useState(null);
  const [renameDraft, setRenameDraft] = useState('');
  const [newName,     setNewName    ] = useState('');
  const [newColor,    setNewColor   ] = useState(PRESET_COLORS[0]);
  const [newType,     setNewType    ] = useState('offense');

  const handleAdd = () => {
    const name = newName.trim();
    if (!name || !canAddLine) return;
    onAddLine?.(name, newColor, newType);
    setNewName('');
  };

  const startRename = (line) => {
    setRenamingId(line._id);
    setRenameDraft(line.name);
  };

  const commitRename = (lineId) => {
    const name = renameDraft.trim();
    if (name) onRenameLine?.(lineId, name);
    setRenamingId(null);
  };

  return (
    <section className={styles.panel} aria-label={t('lines.sectionAriaLabel')}>
      <header className={styles.header}>
        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed((v) => !v)}
          aria-expanded={!collapsed}
          aria-label={collapsed ? t('lines.expand') : t('lines.collapse')}
        >
          <span aria-hidden="true">{collapsed ? '▸' : '▾'}</span> {t('lines.title')}
        </button>
        {!collapsed && <span className={styles.count}>{lines.length}/10</span>}
      </header>

      {!collapsed && (
        <>
          <ul className={styles.list} role="list">
            {lines.map((line) => {
              const isActive = line._id === activeLineId;
              const isEditing = editingId === line._id;
              return (
                <li key={line._id} className={`${styles.lineItem} ${isActive ? styles.lineActive : ''}`}>
                  <div className={styles.lineRow}>
                    <button
                      className={styles.swatch}
                      style={{ background: line.color }}
                      onClick={() => onSetActiveLine?.(isActive ? null : line._id)}
                      aria-label={t(isActive ? 'lines.deactivateAriaLabel' : 'lines.activateAriaLabel', { name: line.name })}
                      aria-pressed={isActive}
                      title={isActive ? t('lines.activeTitle') : t('lines.inactiveTitle')}
                    />

                    {renamingId === line._id ? (
                      <input
                        className={styles.renameInput}
                        value={renameDraft}
                        autoFocus
                        maxLength={40}
                        onChange={(e) => setRenameDraft(e.target.value)}
                        onBlur={() => commitRename(line._id)}
                        onKeyDown={(e) => e.key === 'Enter' && commitRename(line._id)}
                        aria-label={t('lines.renameAriaLabel')}
                      />
                    ) : (
                      <button className={styles.lineName} onClick={() => startRename(line)} title={t('lines.renameTitle')}>
                        {line.name}
                      </button>
                    )}

                    <span className={styles.typeBadge}>{TYPE_LABEL_KEYS[line.type] ? t(TYPE_LABEL_KEYS[line.type]) : line.type}</span>

                    <button
                      className={styles.iconBtn}
                      onClick={() => setEditingId(isEditing ? null : line._id)}
                      aria-expanded={isEditing}
                      aria-label={t('lines.assignPlayersAriaLabel', { name: line.name })}
                      title={t('lines.assignPlayersTitle')}
                    >
                      👥 {line.playerIds.length}
                    </button>

                    <button
                      className={styles.deleteBtn}
                      onClick={() => onDeleteLine?.(line._id)}
                      aria-label={t('lines.deleteAriaLabel', { name: line.name })}
                      title={t('lines.deleteTitle')}
                    >
                      🗑
                    </button>
                  </div>

                  {isEditing && (
                    <div className={styles.playerGrid} role="group" aria-label={t('lines.assignPlayersTitle')}>
                      {players.length === 0 && (
                        <p className={styles.emptyHint}>{t('lines.noPlayersHint')}</p>
                      )}
                      {players.map((p) => {
                        const assigned = line.playerIds.includes(p.id);
                        return (
                          <button
                            key={p.id}
                            className={`${styles.playerChip} ${assigned ? styles.playerChipActive : ''}`}
                            onClick={() => onTogglePlayer?.(line._id, p.id)}
                            aria-pressed={assigned}
                            style={assigned ? { borderColor: line.color, background: `${line.color}33` } : undefined}
                          >
                            {p.role}{p.name ? ` · ${p.name}` : ''}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className={styles.addRow}>
            <div className={styles.colorPicker} role="radiogroup" aria-label={t('lines.colorPickerAriaLabel')}>
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  className={`${styles.colorDot} ${newColor === c ? styles.colorDotActive : ''}`}
                  style={{ background: c }}
                  onClick={() => setNewColor(c)}
                  role="radio"
                  aria-checked={newColor === c}
                  aria-label={t('lines.colorAriaLabel', { color: c })}
                />
              ))}
            </div>
            <select
              className={styles.typeSelect}
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              aria-label={t('lines.typeSelectAriaLabel')}
            >
              <option value="offense">{t('lines.typeOffense')}</option>
              <option value="defense">{t('lines.typeDefense')}</option>
              <option value="special">{t('lines.typeSpecial')}</option>
            </select>
            <input
              className={styles.newNameInput}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder={t('lines.newLinePlaceholder')}
              maxLength={40}
              disabled={!canAddLine}
              aria-label={t('lines.newLineAriaLabel')}
            />
            <button
              className={styles.addBtn}
              onClick={handleAdd}
              disabled={!canAddLine || !newName.trim()}
              aria-label={t('lines.addAriaLabel')}
            >
              ＋
            </button>
          </div>
          {!canAddLine && <p className={styles.limitHint}>{t('lines.limitHint')}</p>}
        </>
      )}
    </section>
  );
}
