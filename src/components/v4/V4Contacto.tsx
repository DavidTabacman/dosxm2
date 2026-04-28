import { useEffect, useRef, useState } from "react";
import { useSectionReveal } from "../shared/useSectionReveal";
import V4FounderLinks from "./V4FounderLinks";
import styles from "./V4Contacto.module.css";
import anim from "./v4-animations.module.css";

interface FounderContact {
  name: string;
  phone: string;
  portraitUrl: string;
  portraitAlt: string;
}

export interface V4ContactoProps {
  id?: string;
  /** Called with collected answers on final submit. Throw to trigger an error state. */
  onSubmit?: (answers: { name: string; contact: string; message: string }) => Promise<void> | void;
  /**
   * Founder contact pair shown in the success state as two portrait WhatsApp
   * buttons (matching the floating FAB). When omitted, the success state
   * renders the thank-you copy alone with no CTA.
   */
  founders?: {
    a: FounderContact;
    b: FounderContact;
    message?: string;
  };
}

type FieldErrors = Partial<Record<"name" | "contact" | "message", string>>;

function validateContact(value: string): string | null {
  const trimmed = value.trim();
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  const digitsOnly = trimmed.replace(/\D/g, "");
  const phoneShape = /^[+\d\s()-]+$/.test(trimmed);
  const isPhone = phoneShape && digitsOnly.length >= 7;
  if (!isEmail && !isPhone) {
    return "Necesitamos un email o teléfono para llamarte de vuelta.";
  }
  return null;
}

export default function V4Contacto({
  id = "contacto",
  onSubmit,
  founders,
}: V4ContactoProps) {
  const [sectionRef, sectionRevealed] = useSectionReveal(0.15);

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<FieldErrors>({});
  const [shake, setShake] = useState<"name" | "contact" | "message" | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  function validate(): { ok: boolean; first?: "name" | "contact" | "message" } {
    const next: FieldErrors = {};
    if (name.trim() === "") next.name = "Este campo es obligatorio.";
    if (contact.trim() === "") {
      next.contact = "Este campo es obligatorio.";
    } else {
      const err = validateContact(contact);
      if (err) next.contact = err;
    }
    if (message.trim() === "") next.message = "Cuéntanos en qué te podemos ayudar.";
    setErrors(next);
    if (Object.keys(next).length === 0) return { ok: true };
    const first = (Object.keys(next)[0] as "name" | "contact" | "message") ?? undefined;
    return { ok: false, first };
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = validate();
    if (!result.ok) {
      console.warn(`[V4-Contacto] ⚠️ Validation failed on field "${result.first}"`);
      if (result.first) {
        setShake(result.first);
        const refs = { name: nameRef, contact: contactRef, message: messageRef };
        refs[result.first].current?.focus();
        setTimeout(() => setShake(null), 500);
      }
      return;
    }
    const payload = { name: name.trim(), contact: contact.trim(), message: message.trim() };
    console.log(`[V4-Contacto] 📨 Submitting form — ${JSON.stringify(payload)}`);
    setSubmitting(true);
    try {
      if (onSubmit) await onSubmit(payload);
      setSubmitted(true);
      setSubmitError(null);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "No hemos podido enviar tu mensaje. Inténtalo de nuevo.";
      console.error(`[V4-Contacto] ❌ Submit failed — ${msg}`);
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (submitted) {
      console.log(`[V4-Contacto] ✅ Form submission complete — success UI visible`);
    }
  }, [submitted]);

  if (submitted) {
    return (
      <section
        id={id}
        className={styles.section}
        ref={sectionRef}
        aria-labelledby="v4-contacto-heading"
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
            <h2 id="v4-contacto-heading" className={styles.successHeading}>
              ¡Gracias! Nos ponemos en contacto contigo.
            </h2>
            <p className={styles.successText}>
              En menos de 24 horas alguno de los dos te llama o te escribe.
            </p>
            {founders ? (
              <div className={styles.successFounders}>
                <p className={styles.successInvite}>
                  Mientras tanto, escríbele directamente a{" "}
                  {founders.a.name} o a {founders.b.name} por WhatsApp.
                </p>
                <V4FounderLinks
                  founderAPhone={founders.a.phone}
                  founderBPhone={founders.b.phone}
                  founderAName={founders.a.name}
                  founderBName={founders.b.name}
                  portraitAUrl={founders.a.portraitUrl}
                  portraitAAlt={founders.a.portraitAlt}
                  portraitBUrl={founders.b.portraitUrl}
                  portraitBAlt={founders.b.portraitAlt}
                  message={founders.message}
                />
              </div>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id={id}
      className={styles.section}
      ref={sectionRef}
      aria-labelledby="v4-contacto-heading"
    >
      <div
        className={`${styles.container} ${anim.stagger} ${
          sectionRevealed ? anim.staggerVisible : ""
        }`}
      >
        <h2 id="v4-contacto-heading" className={styles.heading}>
          Hablemos.{" "}
          <span className={styles.headingAccent}>Estamos aquí para ti.</span>
        </h2>
        <p className={styles.sub}>
          Cuéntanos qué necesitas y te llamamos en menos de 24 horas.
        </p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="v4-contacto-name" className={styles.label}>
              ¿Cómo te llamas?
            </label>
            <input
              id="v4-contacto-name"
              ref={nameRef}
              type="text"
              className={`${styles.input} ${shake === "name" ? styles.shake : ""}`}
              autoComplete="name"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "v4-contacto-name-error" : undefined}
            />
            {errors.name ? (
              <span
                id="v4-contacto-name-error"
                role="alert"
                className={styles.errorText}
              >
                {errors.name}
              </span>
            ) : null}
          </div>

          <div className={styles.field}>
            <label htmlFor="v4-contacto-contact" className={styles.label}>
              Email o teléfono
            </label>
            <input
              id="v4-contacto-contact"
              ref={contactRef}
              type="text"
              inputMode="email"
              autoComplete="email tel"
              className={`${styles.input} ${shake === "contact" ? styles.shake : ""}`}
              placeholder="hola@ejemplo.com o 600 000 000"
              value={contact}
              onChange={(e) => {
                setContact(e.target.value);
                if (errors.contact) setErrors((prev) => ({ ...prev, contact: undefined }));
              }}
              aria-invalid={errors.contact ? true : undefined}
              aria-describedby={errors.contact ? "v4-contacto-contact-error" : undefined}
            />
            {errors.contact ? (
              <span
                id="v4-contacto-contact-error"
                role="alert"
                className={styles.errorText}
              >
                {errors.contact}
              </span>
            ) : null}
          </div>

          <div className={styles.field}>
            <label htmlFor="v4-contacto-message" className={styles.label}>
              ¿En qué te podemos ayudar?
            </label>
            <textarea
              id="v4-contacto-message"
              ref={messageRef}
              className={`${styles.textarea} ${shake === "message" ? styles.shake : ""}`}
              placeholder="Cuéntanos un poco sobre tu casa o lo que necesitas."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
              }}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={errors.message ? "v4-contacto-message-error" : undefined}
            />
            {errors.message ? (
              <span
                id="v4-contacto-message-error"
                role="alert"
                className={styles.errorText}
              >
                {errors.message}
              </span>
            ) : null}
          </div>

          {submitError ? (
            <span role="alert" className={styles.errorText}>
              {submitError}
            </span>
          ) : null}

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={submitting}
            >
              {submitting ? "Enviando…" : "Enviar"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
