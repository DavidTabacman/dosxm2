import { useState } from "react";
import styles from "./ConversationalForm.module.css";

interface Step {
  label: string;
  type: "text" | "select" | "textarea";
  placeholder?: string;
  options?: string[];
}

const STEPS: Step[] = [
  {
    label: "¿En qué zona está tu propiedad?",
    type: "text",
    placeholder: "Ej: Chamberí, Salamanca, Retiro...",
  },
  {
    label: "¿Qué tipo de propiedad es?",
    type: "select",
    options: ["Piso", "Casa / Chalet", "Ático", "Estudio", "Local comercial"],
  },
  {
    label: "¿Cuántos metros cuadrados tiene?",
    type: "text",
    placeholder: "Ej: 85 m²",
  },
  {
    label: "Cuéntanos algo más sobre tu propiedad...",
    type: "textarea",
    placeholder: "Reformas recientes, vistas, garaje, terraza... Lo que quieras contarnos.",
  },
];

export default function ConversationalForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(
    Array(STEPS.length).fill("")
  );
  const [submitted, setSubmitted] = useState(false);

  function handleChange(value: string) {
    const next = [...answers];
    next[currentStep] = value;
    setAnswers(next);
  }

  function handleNext() {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setSubmitted(true);
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }

  if (submitted) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.success}>
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
        </div>
      </section>
    );
  }

  const step = STEPS[currentStep];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Cuéntanos sobre tu casa.</h2>
        <p className={styles.subheading}>
          Nosotros nos encargamos del resto.
        </p>

        <div className={styles.progress}>
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={i <= currentStep ? styles.dotActive : styles.dot}
            />
          ))}
        </div>

        <div className={styles.stepWrapper}>
          <div className={styles.step} key={currentStep}>
            <label className={styles.label}>{step.label}</label>

            {step.type === "text" && (
              <input
                className={styles.input}
                type="text"
                placeholder={step.placeholder}
                value={answers[currentStep]}
                onChange={(e) => handleChange(e.target.value)}
                autoFocus
              />
            )}

            {step.type === "select" && (
              <select
                className={styles.select}
                value={answers[currentStep]}
                onChange={(e) => handleChange(e.target.value)}
              >
                <option value="" disabled>
                  Selecciona una opción
                </option>
                {step.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {step.type === "textarea" && (
              <textarea
                className={styles.textarea}
                placeholder={step.placeholder}
                value={answers[currentStep]}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}

            <div className={styles.actions}>
              {currentStep > 0 && (
                <button
                  className={styles.btnSecondary}
                  onClick={handleBack}
                  type="button"
                >
                  Atrás
                </button>
              )}
              <button
                className={styles.btnPrimary}
                onClick={handleNext}
                type="button"
              >
                {currentStep < STEPS.length - 1 ? "Siguiente" : "Enviar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
