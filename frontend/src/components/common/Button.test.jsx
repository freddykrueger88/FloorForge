import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button.jsx';

describe('Button', () => {
  it('rendert Kinder und ruft onClick auf', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Speichern</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Speichern' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('setzt type="button" standardmäßig (kein versehentliches Form-Submit)', () => {
    render(<Button>Klick</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('respektiert einen explizit übergebenen type', () => {
    render(<Button type="submit">Absenden</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('ist deaktivierbar', () => {
    render(<Button disabled>Deaktiviert</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('reicht zusätzliche Props wie aria-label durch (iconOnly)', () => {
    render(<Button iconOnly aria-label="Löschen">🗑</Button>);
    expect(screen.getByRole('button', { name: 'Löschen' })).toBeInTheDocument();
  });
});
