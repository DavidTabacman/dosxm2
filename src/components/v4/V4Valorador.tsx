import { useEffect, useRef, useState } from "react";
import { useSectionReveal } from "../shared/useSectionReveal";
import styles from "./V4Valorador.module.css";
import anim from "./v4-animations.module.css";

type FieldType = "text" | "tel" | "email" | "select" | "textarea";

interface Step {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  /** Optional validation fn. If returns a string, it's the error message. */
  validate?: (value: string) => string | null;
}

const DEFAULT_STEPS: Step[] = [
  {
    id: "zona",
    label: "Empecemos por conocer tu casa. ¿Dónde está ubicada?",
    type: "text",
    placeholder: "Ej: Chamberí, Salamanca, Retiro...",
  },
  {
    id: "tipo",
    label: "¿Qué tipo de propiedad es?",
    type: "select",
    options: ["Piso", "Casa / Chalet", "Ático", "Estudio", "Local comercial"],
  },
  {
    id: "metros",
    label: "¿Cuántos metros cuadrados tiene?",
    type: "text",
    placeholder: "Ej: 85",
    validate: (v) => {
      const n = Number(v.replace(/[^0-9]/g, ""));
      if (!n || n < 15 || n > 2000) {
        return "Introduce una superficie válida (15–2000 m²).";
      }
      return null;
    },
  },
  {
    id: "contacto",
    label: "¿Cómo te podemos contactar?",
    type: "text",
    placeholder: "Tu teléfono o email",
    validate: (v) => {
      const trimmed = v.trim();
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
      // Phone: must contain only phone-shaped chars AND at least 7 digits.
      // The digit-count check rejects garbage like "(    )" or "- - - -"
      // that would otherwise pass a char-set-only regex.
      const digitsOnly = trimmed.replace(/\D/g, "");
      const phoneShape = /^[+\d\s()-]+$/.test(trimmed);
      const isPhone = phoneShape && digitsOnly.length >= 7;
      if (!isEmail && !isPhone) {
        return "Necesitamos un email o teléfono para llamarte de vuelta.";
      }
      return null;
    },
  },
];

export interface V4ValoradorProps {
  id?: string;
  steps?: ReadonlyArray<Step>;
  /** Called with collected answers on final submit. Throw to trigger an error state. */
  onSubmit?: (answers: Record<string, string>) => Promise<void> | void;
  /** WhatsApp fallback shown in success state. */
  whatsappUrl?: string;
}

export default function V4Valorador({
  id = "valorador",
  steps = DEFAULT_STEPS,
  onSubmit,
  whatsappUrl,
}: V4ValoradorProps) {
  const [sectionRef, sectionRevealed] = useSectionReveal(0.15);

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(steps.length).fill(""));
  const [shakeField, setShakeField] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null>(
    null
  );
  const prevStepRef = useRef<number | null>(null);

  // Move focus only on actual step changes, never on mount. Auto-focusing
  // on mount would yank the viewport to the valorador the moment the
  // section scrolls into view, which broke the cinematic hero flow.
  useEffect(() => {
    if (prevStepRef.current !== null && prevStepRef.current !== currentStep) {
      inputRef.current?.focus();
    }
    prevStepRef.current = currentStep;
  }, [currentStep]);

  const step = steps[currentStep];

  function handleChange(value: string) {
    const next = [...answers];
    next[currentStep] = value;
    setAnswers(next);
    if (error) setError(null);
  }

  function runValidation(value: string): string | null {
    if (value.trim() === "") return "Este campo es obligatorio.";
    if (step.validate) return step.validate(value);
    return null;
  }

  function handleNext() {
    const value = answers[currentStep] ?? "";
    const validation = runValidation(value);
    if (validation) {
      console.warn(
        `[V4-Valorador] ⚠️ Validation failed on step ${currentStep + 1}/${steps.length} ("${step.id}") — ${validation}`
      );
      setError(validation);
      setShakeField(true);
      setTimeout(() => setShakeField(false), 500);
      return;
    }
    setError(null);
    if (currentStep < steps.length - 1) {
      console.log(`[V4-Valorador] ➡️ Step ${currentStep + 1} → ${currentStep + 2}`);
      setCurrentStep(currentStep + 1);
      return;
    }
    void submit();
  }

  async function submit() {
    const payload = steps.reduce<Record<string, string>>((acc, s, i) => {
      acc[s.id] = answers[i] ?? "";
      return acc;
    }, {});
    console.log(`[V4-Valorador] 📨 Submitting form — ${JSON.stringify(payload)}`);
    setSubmitting(true);
    try {
      if (onSubmit) await onSubmit(payload);
      setSubmitted(true);
      setSubmitError(null);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "No hemos podido enviar tu solicitud. Inténtalo de nuevo.";
      console.error(`[V4-Valorador] ❌ Submit failed — ${msg}`);
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setError(null);
      setCurrentStep(currentStep - 1);
    }
  }

  useEffect(() => {
    if (submitted) {
      console.log(`[V4-Valorador] ✅ Form submission flow complete — success UI visible`);
    }
  }, [submitted]);

  if (submitted) {
    return (
      <section
        id={id}
        className={styles.section}
        ref={sectionRef}
        aria-labelledby="v4-valorador-heading"
      >
        <div className={styles.container}>
          <div className={styles.success} role="status" aria-live="polite">
            <div className={styles.successIcon} aria-hidden="true">
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
            <h2 id="v4-valorador-heading" className={styles.successHeading}>
              ¡Gracias! Nos ponemos en contacto contigo.
            </h2>
            <p className={styles.successText}>
              En menos de 24 horas tendrás una valoración y un plan para
              vender tu casa.
            </p>
            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.successCta}
              >
                Hablemos ahora por WhatsApp
              </a>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  const hasError = error !== null;

  return (
    <section
      id={id}
      className={styles.section}
      ref={sectionRef}
      aria-labelledby="v4-valorador-heading"
    >
      <div
        className={`${styles.container} ${anim.stagger} ${
          sectionRevealed ? anim.staggerVisible : ""
        }`}
      >
        <h2 id="v4-valorador-heading" className={styles.heading}>
          Cuéntanos sobre tu casa{" "}
          <span className={styles.headingAccent}>en menos de un minuto.</span>
        </h2>
        <p className={styles.sub}>
          Cuatro preguntas — ni una más — y te llamamos con una valoración
          honesta. Ningún algoritmo, solo dos expertos en Madrid.
        </p>

        <div
          className={styles.progress}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={steps.length}
          aria-valuenow={currentStep + 1}
          aria-label={`Paso ${currentStep + 1} de ${steps.length}`}
        >
          {steps.map((s, i) => (
            <span
              key={s.id}
              className={`${styles.dot} ${i <= currentStep ? styles.dotActive : ""}`}
            />
          ))}
        </div>

        <div className={styles.stepWrapper}>
          <div key={step.id} className={styles.step}>
            <label htmlFor={`v4-step-${step.id}`} className={styles.label}>
              {step.label}
            </label>

            {step.type === "select" ? (
              <div className={styles.selectWrap}>
                <select
                  id={`v4-step-${step.id}`}
                  ref={(el) => {
                    inputRef.current = el;
                  }}
                  className={`${styles.select} ${shakeField ? styles.shake : ""}`}
                  value={answers[currentStep]}
                  onChange={(e) => handleChange(e.target.value)}
                  aria-invalid={hasError || undefined}
                  aria-describedby={hasError ? "v4-step-error" : undefined}
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
              </div>
            ) : step.type === "textarea" ? (
              <textarea
                id={`v4-step-${step.id}`}
                ref={(el) => {
                  inputRef.current = el;
                }}
                className={`${styles.textarea} ${shakeField ? styles.shake : ""}`}
                placeholder={step.placeholder}
                value={answers[currentStep]}
                onChange={(e) => handleChange(e.target.value)}
                aria-invalid={hasError || undefined}
                aria-describedby={hasError ? "v4-step-error" : undefined}
              />
            ) : (
              <input
                id={`v4-step-${step.id}`}
                ref={(el) => {
                  inputRef.current = el;
                }}
                className={`${styles.input} ${shakeField ? styles.shake : ""}`}
                type={step.type}
                inputMode={step.id === "contacto" ? "email" : undefined}
                autoComplete={step.id === "contacto" ? "email tel" : undefined}
                placeholder={step.placeholder}
                value={answers[currentStep]}
                onChange={(e) => handleChange(e.target.value)}
                aria-invalid={hasError || undefined}
                aria-describedby={hasError ? "v4-step-error" : undefined}
              />
            )}

            {error ? (
              <span
                id="v4-step-error"
                role="alert"
                className={styles.errorText}
              >
                {error}
              </span>
            ) : null}

            {submitError ? (
              <span role="alert" className={styles.errorText}>
                {submitError}
              </span>
            ) : null}

            <div className={styles.actions}>
              {currentStep > 0 ? (
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={handleBack}
                >
                  Atrás
                </button>
              ) : null}
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={handleNext}
                disabled={submitting}
              >
                {currentStep < steps.length - 1
                  ? "Siguiente"
                  : submitting
                    ? "Enviando…"
                    : "Enviar"}
              </button>
              <span className={styles.stepMeta}>
                {currentStep + 1} / {steps.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
