"use client";

import { Race, Player } from "@/lib/types";
import { useState } from "react";

interface RaceCardProps {
  race: Race;
  players: Player[];
}

function getPositionEmoji(pos: number) {
  if (pos === 1) return "🥇";
  if (pos === 2) return "🥈";
  if (pos === 3) return "🥉";
  return `${pos}º`;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function RaceCard({ race, players }: RaceCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getPlayerName = (playerId: string) => {
    const p = players.find((pl) => pl.id === playerId);
    return p?.name || "Desconhecido";
  };

  const sorted = [...race.participants].sort(
    (a, b) => a.position - b.position
  );

  return (
    <div className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-4 flex items-center justify-between text-left"
      >
        <div>
          <span className="font-bold text-gray-900">
            Partida #{race.number}
          </span>
          <span className="text-gray-500 text-sm ml-3">
            {formatDate(race.date)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <span className="text-sm">{race.participants.length} jogadores</span>
          <svg
            className={`w-5 h-5 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="pt-3 space-y-2">
            {sorted.map((p) => (
              <div
                key={p.playerId}
                className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getPositionEmoji(p.position)}</span>
                  <span className="font-medium text-gray-900">
                    {getPlayerName(p.playerId)}
                  </span>
                </div>
                <span className="text-sm font-semibold text-red-700">
                  {p.points} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
