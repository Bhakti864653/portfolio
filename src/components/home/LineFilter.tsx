/**
 * How a thin line sits on the paper: its color bleeds softly into the fibers around it, and it
 * casts a faint shadow down and to the right (the light comes from the upper left). `region` is
 * the area the filter may paint, in the SVG's own units.
 */
export function LineFilter({
  id,
  region: [x, y, width, height],
  blur,
}: {
  id: string;
  region: [number, number, number, number];
  blur: number;
}) {
  return (
    <filter
      id={id}
      filterUnits="userSpaceOnUse"
      x={x}
      y={y}
      width={width}
      height={height}
      colorInterpolationFilters="sRGB"
    >
      <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="bleed" />
      <feColorMatrix
        in="bleed"
        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.55 0"
        result="bleed"
      />
      <feGaussianBlur
        in="SourceAlpha"
        stdDeviation={blur * 0.45}
        result="shade"
      />
      <feOffset in="shade" dx={blur * 0.3} dy={blur * 0.8} result="shade" />
      <feColorMatrix
        in="shade"
        values="0 0 0 0 0.2  0 0 0 0 0.15  0 0 0 0 0.1  0 0 0 0.2 0"
        result="shade"
      />
      <feMerge>
        <feMergeNode in="shade" />
        <feMergeNode in="bleed" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  );
}
