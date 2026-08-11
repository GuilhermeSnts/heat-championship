import { PlayerStats } from "@/lib/types";

interface PodiumProps {
  standings: PlayerStats[];
}

export function Podium({ standings }: PodiumProps) {
  const top3 = standings.slice(0, 3);

  if (top3.length === 0) return null;

  const order = [top3[1], top3[0], top3[2]].filter(Boolean); // 2nd, 1st, 3rd

  return (
    <div className="flex items-end justify-center gap-3 sm:gap-6 py-8">
      {order.map((stats, idx) => {
        const heights = ["h-24 sm:h-32", "h-32 sm:h-40", "h-20 sm:h-28"];
        const colors = [
          "bg-gray-300",
          "bg-linear-to-b from-yellow-400 to-yellow-600",
          "bg-amber-700",
        ];
        const medals = ["🥈", "🥇", "🥉"];
        const posLabels = ["2º Lugar", "1º Lugar", "3º Lugar"];

        if (!stats) return null;

        return (
          <div key={stats.playerId} className="flex flex-col items-center">
            <span className="text-2xl mb-2">{medals[idx]}</span>
            <span className="font-bold text-gray-900 text-sm sm:text-base mb-2 text-center">
              {stats.playerName}
            </span>
            <span className="text-xs text-gray-500 mb-1">
              {stats.totalPoints} pts • Média {stats.average.toFixed(1)}
            </span>
            <div
              className={`w-20 sm:w-28 ${heights[idx]} ${colors[idx]} rounded-t-lg flex items-end justify-center pb-2`}
            >
              <span className="text-white font-bold text-sm drop-shadow">
                {posLabels[idx]}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
