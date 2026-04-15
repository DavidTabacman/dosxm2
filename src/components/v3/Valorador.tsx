import { useState, type FormEvent } from "react";
import styles from "./Valorador.module.css";

const FIELDS = [
  { name: "nombre", label: "Tu nombre", type: "text" },
  { name: "telefono", label: "Tu teléfono", type: "tel" },
  { name: "direccion", label: "Dirección de la propiedad", type: "text" },
] as const;

type FieldName = (typeof FIELDS)[number]["name"];

export default function Valorador() {
  const [values, setValues] = useState<Record<FieldName, string>>({
    nombre: "",
    telefono: "",
    direccion: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(name: FieldName, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section className={styles.section}>
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
    <section className={styles.section}>
      <h2 className={styles.heading}>Comencemos tu historia.</h2>
      <p className={styles.subheading}>
        Cuéntanos sobre tu propiedad y te contactaremos en menos de 24 horas.
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        {FIELDS.map((field) => (
          <div className={styles.field} key={field.name}>
            <label className={styles.label} htmlFor={`v3-${field.name}`}>
              {field.label}
            </label>
            <input
              className={styles.input}
              id={`v3-${field.name}`}
              type={field.type}
              value={values[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required
            />
          </div>
        ))}

        <button className={styles.submit} type="submit">
          Enviar <span aria-hidden="true">&rarr;</span>
        </button>
      </form>
    </section>
  );
}
