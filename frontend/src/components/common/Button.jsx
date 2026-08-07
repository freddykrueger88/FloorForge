/**
 * Button – gemeinsame Basis für alle Buttons im Projekt (UI/UX-Audit,
 * "Must Have": vorher definierte 37 Dateien eigene Button-Stile
 * unabhängig voneinander, mit messbar unterschiedlichen Höhen
 * (36px/44px/48px) und Fokus-Ring-Stilen zur Folge.
 *
 * `md` (44px) ist der Standard – das Projekt hat 44px bereits an anderer
 * Stelle bewusst als Touch-Ziel-Mindestgröße etabliert (Mobile-Touch-
 * Optimierung). `sm` (36px) ist eine bewusste Ausnahme NUR für dichte,
 * nicht-primäre Inline-Aktionen (z.B. ein Lösch-Icon in einer
 * Listenzeile), nicht für eigenständige Haupt-Aktionen.
 */
import { forwardRef } from 'react';
import styles from './Button.module.css';

const Button = forwardRef(function Button(
  { variant = 'secondary', size = 'md', iconOnly = false, className = '', type = 'button', children, ...rest },
  ref
) {
  const cls = [
    styles.btn,
    styles[variant],
    size === 'sm' ? styles.sm : styles.md,
    iconOnly ? styles.iconOnly : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button ref={ref} type={type} className={cls} {...rest}>
      {children}
    </button>
  );
});

export default Button;
