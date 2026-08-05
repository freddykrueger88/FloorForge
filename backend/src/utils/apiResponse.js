/**
 * OpenFloorball – Einheitliche API Response Helfer
 *
 * Diese Helfer geben reine Payload-Objekte zurück (kein `res`!) – der
 * Aufrufer entscheidet selbst über den HTTP-Statuscode via `res.status(...)`:
 *   res.status(201).json(created({ user }));
 *   res.status(401).json(error('Nicht authentifiziert'));
 */

export const success = (data) => ({
  success: true,
  data,
});

export const created = (data) => success(data);

export const paginated = (data, pagination) => ({
  success: true,
  data,
  pagination,
});

export const error = (message, details = null) => ({
  success: false,
  message,
  ...(details && { details }),
});
