import Link from "next/link";
import Head from "next/head";

/**
 * Custom 404 (audit §4.10 / scorecard R). Next.js serves this with a real HTTP
 * 404 status, so soft-404s aren't a concern; we just give a branded, on-brand
 * Spanish dead-end with a route back to the homepage. noindex via meta robots.
 */
export default function NotFound() {
  return (
    <>
      <Head>
        <title>Página no encontrada — DOSXM2</title>
        <meta name="robots" content="noindex, follow" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </Head>
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "2rem",
          textAlign: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#2b2b2b",
          background: "#f6f1e9",
        }}
      >
        <p style={{ fontSize: "3rem", fontWeight: 700, margin: 0, letterSpacing: "0.05em" }}>
          DOSXM2
        </p>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>
          Esta página no existe
        </h1>
        <p style={{ maxWidth: "32ch", margin: 0, opacity: 0.8 }}>
          Puede que el enlace haya cambiado. Volvamos al principio para encontrar
          tu próxima casa en Madrid.
        </p>
        <Link
          href="/"
          style={{
            marginTop: "0.5rem",
            padding: "0.75rem 1.5rem",
            borderRadius: "999px",
            background: "#2b2b2b",
            color: "#f6f1e9",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Volver al inicio
        </Link>
      </main>
    </>
  );
}
