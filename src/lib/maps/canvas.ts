// Mantık haritalarındaki node boyutu ve kenar hesaplama yardımcısı.
// Tüm haritalar bu sabitleri ve helper'ı paylaşır.

export const NODE_W = 136;
export const NODE_H = 66;

export type Point = { x: number; y: number };

/**
 * İki node arasında, kaynak node'un dış kenarındaki nokta.
 * SVG line marker'lar için kullanılır (oklar node merkezinde değil kenarında bitsin).
 */
export function edgePoint(from: Point, to: Point): Point {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return { x: from.x, y: from.y };
  const hw = NODE_W / 2;
  const hh = NODE_H / 2;
  const scaleX = Math.abs(dx) > 0.01 ? hw / Math.abs(dx) : Infinity;
  const scaleY = Math.abs(dy) > 0.01 ? hh / Math.abs(dy) : Infinity;
  const scale = Math.min(scaleX, scaleY);
  return { x: from.x + dx * scale, y: from.y + dy * scale };
}
