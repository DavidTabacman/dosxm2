# Component Patterns — DOSXM2 Design System

Reference patterns for creating brand-compliant components. Use these as templates when in `create` mode.

## File Structure

Every component produces exactly two files:

```
src/components/
  ComponentName.tsx          — TypeScript component
  ComponentName.module.css   — CSS Module styles
```

## TSX Template

```tsx
import styles from "./ComponentName.module.css";

interface ComponentNameProps {
  /** Brief description */
  title: string;
  /** Optional props use ? */
  variant?: "primary" | "secondary";
  children?: React.ReactNode;
}

export default function ComponentName({
  title,
  variant = "primary",
  children,
}: ComponentNameProps) {
  return (
    <section
      className={`${styles.root} ${styles[variant]}`}
      aria-labelledby="component-title"
    >
      <h2 id="component-title" className={styles.title}>
        {title}
      </h2>
      {children && <div className={styles.content}>{children}</div>}
    </section>
  );
}
```

### TSX Rules

- Default export, named function component (not arrow function)
- Props `interface` defined above the component
- All text props expected in Spanish from the caller
- `aria-labelledby` on `<section>`, `aria-label` on `<nav>` and `<button>` where text is not self-describing
- Compose class names with template literals: `` `${styles.root} ${styles[variant]}` ``
- Do not use `classnames` or `clsx` libraries
- Variant styles via dynamic key: `styles[variant]`
- Import styles as: `import styles from './ComponentName.module.css'`

## CSS Module Template

```css
/* Root container */
.root {
  color: var(--foreground);
  background: var(--background);
  font-family: var(--font-primary), Arial, Helvetica, sans-serif;
  padding: 3rem 2.5rem;
  border-radius: 24px;
}

/* Variant: primary — green accent */
.primary {
  border-left: 4px solid var(--color-accent);
}

/* Variant: secondary — neutral */
.secondary {
  border-left: 4px solid var(--color-neutral-300);
}

.title {
  font-size: clamp(1.25rem, 4vw, 2rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.01em;
  margin-bottom: 1rem;
}

.content {
  font-size: clamp(0.95rem, 2.5vw, 1.125rem);
  line-height: 1.6;
  color: var(--color-neutral-500);
}

/* --- Responsive --- */

@media (max-width: 768px) {
  .root {
    padding: 2.5rem 2rem;
  }
}

@media (max-width: 600px) {
  .root {
    padding: 1.5rem 1.25rem;
  }
}

/* --- Reduced Motion --- */

@media (prefers-reduced-motion: reduce) {
  .root,
  .root * {
    animation: none !important;
    transition: none !important;
  }
}
```

### CSS Rules

- **Every color** must be `var(--*)` — zero hardcoded hex, rgb, or hsl values
- **`clamp()`** for all font sizes — format: `clamp(min, preferred, max)`
- **Responsive breakpoints**: 768px and 600px at minimum
- **`@media (prefers-reduced-motion: reduce)`** at the bottom of every file that uses `animation` or `transition`
- **No nesting** — flat selectors only (CSS Modules handle scoping)
- **No `!important`** except inside `prefers-reduced-motion` overrides
- **Comments** in English
- **No Tailwind** utility classes

## Accessibility Patterns

### Screen Reader Only

```css
.srOnly {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### Focus Visible

```css
.interactive:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

### Button with Screen Reader Text

```tsx
<button
  type="button"
  className={styles.button}
  aria-label="Contactar ahora"
>
  <span aria-hidden="true">Icono</span>
  <span className={styles.srOnly}>Contactar ahora</span>
  Contactar
</button>
```

## Example: CTA Button

### TSX

```tsx
import styles from "./CTAButton.module.css";

interface CTAButtonProps {
  text: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "outline";
}

export default function CTAButton({
  text,
  href,
  onClick,
  variant = "primary",
}: CTAButtonProps) {
  const className = `${styles.cta} ${styles[variant]}`;

  if (href) {
    return (
      <a href={href} className={className}>
        {text}
      </a>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick}>
      {text}
    </button>
  );
}
```

### CSS

```css
.cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0.75rem 2rem;
  font-family: var(--font-primary), Arial, Helvetica, sans-serif;
  font-size: clamp(0.95rem, 2vw, 1.125rem);
  font-weight: 600;
  line-height: 1;
  text-decoration: none;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.primary {
  color: var(--color-white);
  background-color: var(--color-accent);
}

.primary:hover {
  background-color: var(--color-accent-dark);
}

.primary:active {
  transform: scale(0.98);
}

.outline {
  color: var(--color-accent);
  background: transparent;
  border: 2px solid var(--color-accent);
}

.outline:hover {
  background-color: var(--color-accent);
  color: var(--color-white);
}

.cta:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .cta {
    transition: none;
  }
}
```

## Example: Glass Card

Elevated content over gradient backgrounds.

```css
.glassCard {
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(1.4);
  -webkit-backdrop-filter: blur(20px) saturate(1.4);
  border: 1px solid var(--glass-border);
  box-shadow: 0 8px 32px var(--glass-shadow);
  border-radius: 24px;
  padding: 3rem 2.5rem;
}

@media (max-width: 768px) {
  .glassCard {
    padding: 2.5rem 2rem;
  }
}

@media (max-width: 600px) {
  .glassCard {
    padding: 1.5rem 1.25rem;
  }
}
```

**Contrast warning:** Text on glass cards MUST be verified against the worst-case background color visible through the blur. Use `--text-hero` (#fff) only when the gradient behind guarantees sufficient darkness. For lighter backgrounds, use `--foreground` instead.
