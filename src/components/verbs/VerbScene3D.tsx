"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { pathPoints } from "@/lib/geometry";
import { projectByVerb, VERB_ORDER, type Verb } from "@/lib/projects";
import { useTheme } from "@/lib/prefs";

/**
 * The desktop version of the verb figure. Same four paths as the 2D SVG (same geometry, same
 * bearings, so the HTML labels still sit at each path's start), given depth: the paths weave in
 * and out of the page, and the chosen one lifts toward you while the others recede.
 * Visual only; the canvas is aria-hidden and every word lives in HTML.
 */

type Palette = {
  ink: THREE.Color;
  a1: Record<Verb, THREE.Color>;
  a2: Record<Verb, THREE.Color>;
};

function readPalette(): Palette {
  const css = getComputedStyle(document.documentElement);
  const color = (name: string) =>
    new THREE.Color(css.getPropertyValue(name).trim() || "#111515");
  const a1 = {} as Record<Verb, THREE.Color>;
  const a2 = {} as Record<Verb, THREE.Color>;
  for (const verb of VERB_ORDER) {
    const slug = projectByVerb(verb).slug;
    a1[verb] = color(`--${slug}-1`);
    a2[verb] = color(`--${slug}-2`);
  }
  return { ink: color("--ink"), a1, a2 };
}

// Camera distance chosen so a unit radius covers the same 41.7% of the frame as the SVG's ring.
const CAMERA_Z = 3.8;
const FOV = 35;

function Figure({
  active,
  palette,
}: {
  active: Verb | null;
  palette: Palette;
}) {
  const group = useRef<THREE.Group>(null);
  const bead = useRef<THREE.Mesh>(null);
  const progress = useRef(0);
  const traced = useRef<Verb | null>(null);

  const paths = useMemo(
    () =>
      VERB_ORDER.map((verb, i) => {
        const points = pathPoints(verb, 64);
        const depth = i % 2 === 0 ? 0.32 : -0.32;
        const curve = new THREE.CatmullRomCurve3(
          points.map(
            ([x, y], j) =>
              new THREE.Vector3(
                x,
                -y,
                Math.sin((j / (points.length - 1)) * Math.PI) * depth,
              ),
          ),
        );
        return {
          verb,
          curve,
          geometry: new THREE.TubeGeometry(curve, 200, 0.009, 8, false),
          // The selected path is drawn slightly heavier.
          heavy: new THREE.TubeGeometry(curve, 200, 0.014, 8, false),
        };
      }),
    [],
  );

  const rings = useMemo(
    () =>
      [1, 0.66, 0.33].map((r, i) => {
        const pts = Array.from({ length: 129 }, (_, k) => {
          const a = (k / 128) * Math.PI * 2;
          return new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0);
        });
        const material = new THREE.LineBasicMaterial({
          color: palette.ink,
          transparent: true,
          opacity: i === 0 ? 0.22 : 0.1,
        });
        return new THREE.LineLoop(
          new THREE.BufferGeometry().setFromPoints(pts),
          material,
        );
      }),
    [palette],
  );

  useEffect(
    () => () =>
      paths.forEach((p) => {
        p.geometry.dispose();
        p.heavy.dispose();
      }),
    [paths],
  );
  useEffect(
    () => () =>
      rings.forEach((ring) => {
        ring.geometry.dispose();
        (ring.material as THREE.Material).dispose();
      }),
    [rings],
  );

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    // A fixed, slight tilt so the depth reads; small enough that labels stay on their paths.
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -0.16, 3, dt);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, 0.05, 3, dt);

    g.children.forEach((child) => {
      const verb = child.userData.verb as Verb | undefined;
      if (!verb) return;
      const on = verb === active;
      const target = active === null ? 1 : on ? 1.9 : 0.8;
      const s = THREE.MathUtils.damp(child.scale.z, target, 5, dt);
      child.scale.set(1, 1, s);
      child.position.z = THREE.MathUtils.damp(
        child.position.z,
        on ? 0.18 : 0,
        5,
        dt,
      );
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.color.lerp(
        on ? palette.a1[verb] : palette.ink,
        1 - Math.exp(-6 * dt),
      );
      mat.opacity = THREE.MathUtils.damp(
        mat.opacity,
        active === null ? 0.9 : on ? 1 : 0.45,
        6,
        dt,
      );
    });

    if (bead.current) {
      bead.current.visible = active !== null;
      if (active) {
        // Each new choice sends the marker once from the outer end into the center, then it rests.
        if (traced.current !== active) {
          traced.current = active;
          progress.current = 0;
        }
        progress.current = Math.min(1, progress.current + dt * 1.1);
        const path = paths.find((p) => p.verb === active)!;
        const point = path.curve.getPointAt(progress.current);
        const owner = g.children.find((c) => c.userData.verb === active)!;
        bead.current.position.set(
          point.x,
          point.y,
          point.z * owner.scale.z + owner.position.z,
        );
        (bead.current.material as THREE.MeshBasicMaterial).color.copy(
          palette.a2[active],
        );
      }
    }
  });

  return (
    <group ref={group}>
      {rings.map((ring, i) => (
        <primitive key={i} object={ring} />
      ))}
      {paths.map(({ verb, geometry, heavy }) => (
        <mesh
          key={verb}
          geometry={verb === active ? heavy : geometry}
          userData={{ verb }}
        >
          <meshBasicMaterial color={palette.ink} transparent opacity={0.9} />
        </mesh>
      ))}
      <mesh ref={bead} visible={false}>
        <sphereGeometry args={[0.026, 16, 16]} />
        <meshBasicMaterial />
      </mesh>
      {/* Human judgment */}
      <mesh>
        <torusGeometry args={[0.05, 0.007, 8, 48]} />
        <meshBasicMaterial color={palette.ink} />
      </mesh>
    </group>
  );
}

export default function VerbScene3D({
  active,
  onReady,
}: {
  active: Verb | null;
  onReady: () => void;
}) {
  const theme = useTheme();
  // Re-read the CSS colors whenever the theme flips.
  const palette = useMemo(() => {
    void theme;
    return readPalette();
  }, [theme]);

  const wrapper = useRef<HTMLDivElement>(null);
  const frameloop = useFrameloopWhenVisible(wrapper);

  return (
    <div ref={wrapper} className="absolute inset-0" aria-hidden="true">
      <Canvas
        frameloop={frameloop}
        dpr={[1, 2]}
        camera={{ position: [0, 0, CAMERA_Z], fov: FOV }}
        gl={{ antialias: true, alpha: true }}
        onCreated={() => onReady()}
      >
        <Figure active={active} palette={palette} />
      </Canvas>
    </div>
  );
}

/** Stops rendering while the figure is scrolled out of view. */
function useFrameloopWhenVisible(ref: RefObject<HTMLDivElement | null>) {
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) =>
      setFrameloop(entry.isIntersecting ? "always" : "never"),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return frameloop;
}
