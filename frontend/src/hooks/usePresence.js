/**
 * usePresence – Echtzeit-Präsenz + Live-Co-Editing-Relay (ROADMAP-Backlog:
 * Echtzeit-Co-Editing). Zeigt an, wer aktuell dasselbe Board geöffnet hat,
 * verteilt Live-Cursor-Positionen und reicht Live-Merge-Operationen
 * (Spieler-/Zeichen-Änderungen, siehe useDrawing.js REMOTE_OP) zwischen den
 * verbundenen Clients durch. Reiner Nice-to-have: schlägt die Verbindung
 * fehl (z.B. Reverse-Proxy ohne WebSocket-Support), bleiben Liste/Cursor
 * einfach leer und Operationen werden nicht verteilt – kein Fehler-UI,
 * keine Auswirkung auf die eigentliche Board-Funktionalität (der normale
 * Autosave-Pfad bleibt die Quelle der Wahrheit).
 */
import { useEffect, useState, useRef, useCallback } from 'react';

const RECONNECT_DELAY_MS = 3000;
const CURSOR_THROTTLE_MS = 60;

export function usePresence(boardId, { onOp } = {}) {
  const [users, setUsers] = useState([]);
  const [cursors, setCursors] = useState({});
  const wsRef = useRef(null);
  const lastCursorSentRef = useRef(0);
  // Ref statt direkter Dependency im Effekt unten – onOp soll bei jedem
  // Render von BoardEditorPage.jsx neu erzeugt werden dürfen, ohne dass
  // das hier einen WS-Reconnect auslöst (nur boardId soll das tun).
  const onOpRef = useRef(onOp);
  onOpRef.current = onOp;

  useEffect(() => {
    if (!boardId) return undefined;
    let cancelled = false;
    let reconnectTimer = null;

    const connect = () => {
      if (cancelled) return;
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const ws = new WebSocket(`${wsProtocol}//${window.location.host}/api/ws/presence?boardId=${boardId}`);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'presence') {
            setUsers(msg.users);
            // Aufräumen: Cursor von Nutzern entfernen, die laut aktueller
            // Präsenz-Liste nicht mehr da sind (z.B. Verbindung ohne
            // sauberes cursorLeave verloren) – nutzt den ohnehin schon
            // vorhandenen Heartbeat-Broadcast mit statt eines eigenen Timers.
            const known = new Set(msg.users.map((u) => u.userId));
            setCursors((prev) => Object.fromEntries(Object.entries(prev).filter(([userId]) => known.has(userId))));
          } else if (msg.type === 'cursor') {
            setCursors((prev) => ({ ...prev, [msg.userId]: { displayName: msg.displayName, x: msg.x, y: msg.y } }));
          } else if (msg.type === 'cursorLeave') {
            setCursors((prev) => {
              if (!(msg.userId in prev)) return prev;
              const next = { ...prev };
              delete next[msg.userId];
              return next;
            });
          } else if (msg.type === 'op') {
            onOpRef.current?.({ frameId: msg.frameId, op: msg.op, userId: msg.userId });
          }
        } catch {
          // Kaputte Nachricht ignorieren – kein kritischer Pfad
        }
      };
      ws.onclose = () => {
        if (cancelled) return;
        setUsers([]);
        setCursors({});
        // Kurzer Reconnect-Versuch (z.B. Backend-Neustart bei einem Deploy) –
        // kein unbegrenzter Retry-Sturm, nur ein einzelner Versuch pro Close.
        reconnectTimer = setTimeout(connect, RECONNECT_DELAY_MS);
      };
      ws.onerror = () => ws.close();
    };

    connect();

    return () => {
      cancelled = true;
      clearTimeout(reconnectTimer);
      wsRef.current?.close();
    };
  }, [boardId]);

  const send = useCallback((payload) => {
    const ws = wsRef.current;
    if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(payload));
  }, []);

  // Zeitbasiert gedrosselt – wird potenziell bei jeder Mausbewegung übers
  // Feld aufgerufen, kein Dauerfeuer über die WS-Verbindung.
  const sendCursor = useCallback((x, y) => {
    const now = Date.now();
    if (now - lastCursorSentRef.current < CURSOR_THROTTLE_MS) return;
    lastCursorSentRef.current = now;
    send({ type: 'cursor', x, y });
  }, [send]);

  const sendCursorLeave = useCallback(() => send({ type: 'cursorLeave' }), [send]);

  // Operationen sind schon diskret (Drag-Ende, fertiges Element) – keine
  // Drosselung nötig, anders als bei sendCursor.
  const sendOp = useCallback((frameId, op) => send({ type: 'op', frameId, op }), [send]);

  return { users, cursors, sendCursor, sendCursorLeave, sendOp };
}
