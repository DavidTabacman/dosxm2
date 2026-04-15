import { useState, type FormEvent } from "react";
import { useSectionReveal } from "../shared/useSectionReveal";
import styles from "./Valorador.module.css";
import anim from "./v3-animations.module.css";

const FIELDS = [
  { name: "nombre", label: "Tu nombre", type: "text" },
  { name: "telefono", label: "Tu teléfono", type: "tel" },
  { name: "direccion", label: "Dirección de la propiedad", type: "text" },
] as const;

type FieldName = (typeof FIELDS)[number]["name"];

const VALIDATORS: Record<FieldName, (v: string) => string | null> = {
  nombre: (v) =>
    v.length > 0 && v.length < 2 ? "El nombre debe tener al menos 2 caracteres" : null,
  telefono: (v) =>
    v.length > 0 && !/^\+?[\d\s()-]{6,}$/.test(v) ? "Introduce un teléfono válido" : null,
  direccion: (v) =>
    v.length > 0 && v.length < 5 ? "La dirección debe tener al menos 5 caracteres" : null,
};

export default function Valorador() {
  const [sectionRef, sectionRevealed] = useSectionReveal(0.15);
  const [values, setValues] = useState<Record<FieldName, string>>({
    nombre: "",
    telefono: "",
    direccion: "",
  });
  const [touched, setTouched] = useState<Record<FieldName, boolean>>({
    nombre: false,
    telefono: false,
    direccion: false,
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(name: FieldName, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleBlur(name: FieldName) {
    if (values[name].length > 0) {
      setTouched((prev) => ({ ...prev, [name]: true }));
    }
  }

  function getError(name: FieldName): string | null {
    // Show validation error on blur only if field has content and is invalid
    if (touched[name]) {
      return VALIDATORS[name](values[name]);
    }
    // Show "required" error only after submit attempt
    if (submitAttempted && values[name].length === 0) {
      return "Este campo es obligatorio";
    }
    return null;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitAttempted(true);

    // Check all fields are filled and valid
    const emptyFields = FIELDS.filter((f) => values[f.name].length === 0).map((f) => f.name);
    const invalidFields = FIELDS.filter((f) => VALIDATORS[f.name](values[f.name]) !== null).map((f) => f.name);

    if (emptyFields.length > 0) {
      console.warn(
        `[V3-Valorador] ⚠️ Form submission BLOCKED — ` +
        `Reason: empty required fields: [${emptyFields.join(", ")}]`
      );
      return;
    }

    if (invalidFields.length > 0) {
      console.warn(
        `[V3-Valorador] ⚠️ Form submission BLOCKED — ` +
        `Reason: invalid fields: [${invalidFields.join(", ")}]. ` +
        `Errors: ${invalidFields.map((f) => `${f}="${VALIDATORS[f as FieldName](values[f as FieldName])}"`).join(", ")}`
      );
      return;
    }

    console.log(
      `[V3-Valorador] ✅ Form submitted successfully — ` +
      `nombre: "${values.nombre}", telefono: "${values.telefono}", direccion: "${values.direccion}"`
    );
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section className={`${styles.section} ${styles.successSection}`}>
        <h2 className={styles.successHeading}>
          Gracias. Tu historia comienza aquí.
        </h2>
        <p className={styles.successText}>
          Nos pondremos en contacto contigo en menos de 24 horas.
        </p>
      </section>
    );
  }

  return (
    <section
      className={`${styles.section} ${anim.stagger} ${sectionRevealed ? anim.staggerVisible : ""}`}
      ref={sectionRef}
    >
      <h2 className={styles.heading}>Comencemos tu historia.</h2>
      <p className={styles.subheading}>
        Cuéntanos sobre tu propiedad y te contactaremos en menos de 24 horas.
      </p>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {FIELDS.map((field) => {
          const error = getError(field.name);
          return (
            <div
              className={`${styles.field} ${error ? styles.fieldError : ""}`}
              key={field.name}
            >
              <label className={styles.label} htmlFor={`v3-${field.name}`}>
                {field.label}
              </label>
              <input
                className={styles.input}
                id={`v3-${field.name}`}
                type={field.type}
                value={values[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                onBlur={() => handleBlur(field.name)}
                aria-invalid={error ? "true" : undefined}
                aria-describedby={error ? `v3-${field.name}-error` : undefined}
                required
              />
              {error && (
                <span
                  className={styles.errorMessage}
                  id={`v3-${field.name}-error`}
                  role="alert"
                >
                  {error}
                </span>
              )}
            </div>
          );
        })}

        <button className={styles.submit} type="submit">
          Enviar <span aria-hidden="true">&rarr;</span>
        </button>
      </form>
    </section>
  );
}
