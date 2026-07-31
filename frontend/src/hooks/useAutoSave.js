/**
 * useAutoSave – Auto-Save alle 30s + debounced bei jeder Änderung
 * Zeigt Status: 'idle' | 'saving' | 'saved' | 'error'
 */
import { useState, useEffect, useRef, useCallback } from 'react';

const DEBOUNCE_MS  = 2000;   // 2s nach letzter Änderung
const INTERVAL_MS  = 30000;  // 30s Intervall

export function useAutoSave(data, saveFn, enabled = true) {
  const [status,   setStatus  ] = useState('idle');  // idle | saving | saved | error
  const [lastSaved,setLastSaved] = useState(null);
  const debounceRef = useRef(null);
  const intervalRef = useRef(null);
  const dataRef     = useRef(data);
  dataRef.current   = data;

  const save = useCallback(async () => {
    if (!enabled) return;
    setStatus('saving');
    try {
      await saveFn(dataRef.current);
      setStatus('saved');
      setLastSaved(new Date());
      // Nach 3s wieder auf idle
      setTimeout(() => setStatus('idle'), 3000);
    } catch {
      setStatus('error');
    }
  }, [saveFn, enabled]);

  // Debounce bei Änderung
  useEffect(() => {
    if (!enabled) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(save, DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data), enabled]);

  // 30s Intervall
  useEffect(() => {
    if (!enabled) return;
    intervalRef.current = setInterval(save, INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [save, enabled]);

  return { status, lastSaved, saveNow: save };
}
