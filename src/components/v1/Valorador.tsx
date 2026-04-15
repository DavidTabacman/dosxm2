import { useState, type FormEvent } from "react";
import styles from "./Valorador.module.css";

const FIELDS = [
  { name: "direccion", label: "Dirección", type: "text" },
  { name: "metros", label: "Metros cuadrados", type: "text" },
  { name: "habitaciones", label: "Habitaciones", type: "text" },
  { name: "nombre", label: "Tu nombre", type: "text" },
  { name: "telefono", label: "Tu teléfono", type: "tel" },
] as const;

type FieldName = (typeof FIELDS)[number]["name"];

export default function Valorador() {
  const [values, setValues] = useState<Record<FieldName, string>>({
    direccion: "",
    metros: "",
    habitaciones: "",
    nombre: "",
    telefono: "",
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
        <div className={styles.successWrapper}>
          <div className={styles.successIcon} aria-hidden="true">
            &#10003;
          </div>
          <h2 className={styles.successHeading}>
            ¡Gracias! Te contactaremos pronto.
          </h2>
          <p className={styles.successText}>
            Nos pondremos en contacto contigo en menos de 24 horas.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        <div className={styles.mediaPanel}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.mediaBg}
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&h=800&fit=crop"
            alt=""
            aria-hidden="true"
            data-asset-type="video-placeholder"
          />
          <div className={styles.mediaOverlay}>
            <h2 className={styles.mediaHeading}>¿Cuánto vale tu historia?</h2>
          </div>
        </div>

        <div className={styles.formPanel}>
          <form className={styles.form} onSubmit={handleSubmit}>
            {FIELDS.map((field) => (
              <div className={styles.fieldGroup} key={field.name}>
                <input
                  className={styles.input}
                  type={field.type}
                  placeholder=" "
                  value={values[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required
                />
                <label className={styles.label}>{field.label}</label>
              </div>
            ))}
            <button className={styles.submit} type="submit">
              Solicitar valoración
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
