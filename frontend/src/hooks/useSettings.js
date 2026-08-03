/**
 * useSettings – User-Einstellungen laden/speichern (Issue #18)
 */
import { useState, useCallback, useEffect } from 'react';
import { apiFetch } from '../utils/apiFetch.js';

export function useSettings() {
  const [settings, setSettings] = useState(null);
  const [loading,  setLoading ] = useState(true);
  const [error,    setError   ] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/settings');
      setSettings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateSettings = useCallback(async (patch) => {
    try {
      const data = await apiFetch('/api/settings', { method: 'PUT', body: JSON.stringify(patch) });
      setSettings(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return { settings, loading, error, updateSettings, reload: load };
}
