import { useCallback } from "react";
import { useHeroMorph } from "./HeroMorphContext";
import styles from "./HeroMorphLayer.module.css";

export default function HeroMorphLayer() {
  const { morphLayerRef } = useHeroMorph();

  const handleImageLoad = useCallback(() => {
    console.log(
      `[V3-HeroMorphLayer] ✅ Morph layer image loaded successfully`
    );
  }, []);

  const handleImageError = useCallback(() => {
    console.error(
      `[V3-HeroMorphLayer] ❌ Morph layer image FAILED to load — ` +
      `the hero background will be missing. Check image URL.`
    );
  }, []);

  return (
    <div className={styles.morphLayer} ref={morphLayerRef} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.morphImage}
        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop"
        alt=""
        loading="eager"
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
}