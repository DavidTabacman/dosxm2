import { useEffect, useState } from "react";
import { useSectionReveal } from "../shared/useSectionReveal";
import styles from "./ConversationalForm.module.css";
import anim from "./v2-animations.module.css";

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
  const [sectionRef, sectionRevealed] = useSectionReveal(0.15);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(
    Array(STEPS.length).fill("")
  );
  const [submitted, setSubmitted] = useState(false);
  const [shakeField, setShakeField] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(value: string) {
    const next = [...answers];
    next[currentStep] = value;
    setAnswers(next);
    if (error) setError(null);
  }

  function handleNext() {
    const value = answers[currentStep].trim();
    if (value === "") {
      console.warn(`[V2-Form] ⚠️ Validation failed at step ${currentStep + 1}/${STEPS.length} ("${step.label}") — Reason: empty input, type: "${step.type}"`);
      setError("Este campo es obligatorio");
      setShakeField(true);
      setTimeout(() => setShakeField(false), 500);
      return;
    }
    setError(null);
    if (currentStep < STEPS.length - 1) {
      console.log(`[V2-Form] ➡️ Step ${currentStep + 1} → ${currentStep + 2} — answer: "${value}"`);
      setCurrentStep(currentStep + 1);
    } else {
      console.log(`[V2-Form] 📨 Form submitted — answers: ${JSON.stringify(answers.map((a, i) => `${STEPS[i].label}: "${a}"`))}`);
      setSubmitted(true);
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      console.log(`[V2-Form] ⬅️ Step ${currentStep + 1} → ${currentStep} — going back`);
      setError(null);
      setCurrentStep(currentStep - 1);
    }
  }

  useEffect(() => {
    if (submitted) {
      console.log(`[V2-Form] ✅ Form submitted successfully — rendering success state with SVG checkmark animation`);
    }
  }, [submitted]);

  if (submitted) {
    return (
      <section className={styles.section} ref={sectionRef}>
        <div className={styles.container}>
          <div className={styles.success} role="status" aria-live="polite">
            <div className={styles.successIconWrapper} aria-hidden="true">
              <svg className={styles.successSvg} viewBox="0 0 52 52">
                <circle
                  className={styles.successCircle}
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  className={styles.successCheck}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.1 27.2l7.1 7.2 16.7-16.8"
                />
              </svg>
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
  const hasError = error !== null;
  const inputErrorProps = {
    "aria-invalid": hasError || undefined,
    "aria-describedby": hasError ? "step-error" : undefined,
  };

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={`${styles.container} ${anim.stagger} ${sectionRevealed ? anim.staggerVisible : ""}`}>
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
          <div
            className={`${styles.step} ${isFocused ? styles.stepFocused : ""}`}
            key={currentStep}
          >
            <label className={styles.label}>{step.label}</label>

            {step.type === "text" && (
              <input
                className={`${styles.input} ${shakeField ? styles.shake : ""}`}
                type="text"
                placeholder={step.placeholder}
                value={answers[currentStep]}
                onChange={(e) => handleChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                autoFocus
                {...inputErrorProps}
              />
            )}

            {step.type === "select" && (
              <select
                className={`${styles.select} ${shakeField ? styles.shake : ""}`}
                value={answers[currentStep]}
                onChange={(e) => handleChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...inputErrorProps}
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
                className={`${styles.textarea} ${shakeField ? styles.shake : ""}`}
                placeholder={step.placeholder}
                value={answers[currentStep]}
                onChange={(e) => handleChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...inputErrorProps}
              />
            )}

            {error && (
              <span id="step-error" role="alert" className={styles.errorText}>
                {error}
              </span>
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
