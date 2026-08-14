import { PlayerStats } from "@/lib/types";
import { PODIUM_COLORS } from "@/lib/podiumColors";
import Image from "next/image";

interface PodiumProps {
  standings: PlayerStats[];
}

// Real image dimensions: 1124x539 (landscape). Used to keep the container's
// aspect ratio so percentage positioning maps 1:1 onto the drawing.
const IMG_ASPECT = "1124 / 539";

// For each placement [2nd, 1st, 3rd]:
//  - left:      horizontal center of the step, in % of image width
//  - top:       top edge of the drawing (non-white area) of that step, in % of image height
//  - rotate:    tilt of the label in degrees (positive = clockwise)
//  - nameColor: color of the player's name (medal color of the placement)
const POSITIONS = [
  { left: 30, top: 10, rotate: -12, nameColor: PODIUM_COLORS.silver }, // 2nd place (left step) — prata
  { left: 53, top: -10, rotate: 0, nameColor: PODIUM_COLORS.gold }, // 1st place (center step, tallest) — ouro
  { left: 78, top: 26, rotate: 12, nameColor: PODIUM_COLORS.bronze }, // 3rd place (right step) — bronze
];

// Gap between the label and the top of the drawing (px).
const GAP_PX = 20;

export function Podium({ standings }: PodiumProps) {
  const top3 = standings.slice(0, 3);

  if (top3.length === 0) return null;

  const order = [top3[1], top3[0], top3[2]].filter(Boolean) as PlayerStats[]; // 2nd, 1st, 3rd

  return (
    <div className="flex justify-center pt-10">
      <div
        className="relative w-[min(90vw,600px)]"
        style={{ aspectRatio: IMG_ASPECT }}
      >
        <Image
          src="/podio.png"
          alt="Pódio"
          fill
          sizes="(max-width: 640px) 90vw, 600px"
          className="pointer-events-none z-10"
        />

        {order.map((stats, idx) => {
          if (!stats) return null;

          const pos = POSITIONS[idx] ?? { left: 50, top: 20 };

          return (
            <div
              key={stats.playerId}
              style={{
                left: `${pos.left}%`,
                // Anchor the label's bottom edge 20px above the drawing top.
                // The label grows upward, so it always stays above the drawing.
                bottom: `calc(${100 - pos.top}% - ${GAP_PX}px)`,
                // Tilt the label; value is parameterized per placement in POSITIONS.
                rotate: `${pos.rotate ?? 0}deg`,
              }}
              className="absolute z-20 flex -translate-x-1/2 flex-col items-center text-center"
            >
              <span
                className="mb-1 text-sm font-bold sm:text-base"
                style={{ color: pos.nameColor ?? "#111827" }}
              >
                {stats.playerName}
              </span>
              <span className="text-xs text-gray-500">
                {stats.totalPoints} pts
              </span>
              <span className="text-xs text-gray-500">
                Média {stats.average.toFixed(1)}
              </span>

            </div>
          );
        })}
      </div>
    </div>
  );
}