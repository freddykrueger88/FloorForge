/**
 * usePresence – Echtzeit-Präsenz MVP (ROADMAP-Backlog: Echtzeit-Co-Editing)
 * Zeigt an, wer aktuell dasselbe Board geöffnet hat. Reiner Nice-to-have:
 * schlägt die Verbindung fehl (z.B. Reverse-Proxy ohne WebSocket-Support),
 * bleibt die Liste einfach leer – kein Fehler-UI, keine Auswirkung auf die
 * eigentliche Board-Funktionalität.
 */
import { useEffect, useState, useRef } from 'react';

const RECONNECT_DELAY_MS = 3000;

export function usePresence(boardId) {
  const [users, setUsers] = useState([]);
  const wsRef = useRef(null);

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
          if (msg.type === 'presence') setUsers(msg.users);
        } catch {
          // Kaputte Nachricht ignorieren – kein kritischer Pfad
        }
      };
      ws.onclose = () => {
        if (cancelled) return;
        setUsers([]);
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

  return users;
}
