import { useCallback } from "react";
import { useHeroMorph } from "./HeroMorphContext";
import { useVideoPlayback } from "../shared/useVideoPlayback";
import { HERO_IMAGE_BASE, HERO_VIDEO } from "./heroAssets";
import styles from "./HeroMorphLayer.module.css";

const HERO_POSTER = `${HERO_IMAGE_BASE}?w=1920&h=1080&fit=crop`;

export default function HeroMorphLayer() {
  const { morphLayerRef } = useHeroMorph();
  const { ref: videoRef, hasError } = useVideoPlayback("HeroMorph");

  // Combine morphLayerRef (for the container div) stays separate —
  // videoRef goes on the <video> element, morphLayerRef on the <div>.

  const handleImageLoad = useCallback(() => {
    console.log(`[V3-HeroMorphLayer] ✅ Fallback image loaded`);
  }, []);

  const handleImageError = useCallback(() => {
    console.error(
      `[V3-HeroMorphLayer] ❌ Fallback image FAILED to load — ` +
      `the hero background will be missing. Check image URL.`
    );
  }, []);

  return (
    <div className={styles.morphLayer} ref={morphLayerRef} aria-hidden="true">
      {hasError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={styles.morphImage}
          src={HERO_POSTER}
          alt=""
          loading="eager"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      ) : (
        <video
          ref={videoRef}
          className={styles.morphImage}
          src={HERO_VIDEO}
          poster={HERO_POSTER}
          muted
          loop
          playsInline
          preload="auto"
          data-asset-type="hero-video"
        />
      )}
    </div>
  );
}
