"use client";

import { Race, Player } from "@/lib/types";
import { useState } from "react";
import { Award } from "lucide-react";

interface RaceCardProps {
  race: Race;
  players: Player[];
}

function getPositionEmoji(pos: number) {
  if (pos === 1) return <Award className="w-5 h-5 text-yellow-400" />;
  if (pos === 2) return <Award className="w-5 h-5 text-slate-400" />;
  if (pos === 3) return <Award className="w-5 h-5 text-amber-700" />;
  return <span>{pos}º</span>;
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
          <div className="flex items-center gap-3 mt-1">
            <span className="text-gray-500 text-sm">{formatDate(race.date)}</span>
            {race.map && (
              <span className="text-xs text-gray-600 px-2 py-1 rounded border">{race.map}</span>
            )}
          </div>
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
                className="flex items-center justify-between gap-3 py-2 px-3 bg-gray-50 rounded-lg"
              >
                <div className="ml-auto flex items-center justify-end gap-2 w-4">
                  {p.carColor && (
                    <span className="flex h-5 w-5 items-center justify-center shrink-0">
                      <span className={`block h-4 w-4 rounded-full ${colorClass(p.carColor)}`} />
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-lg">{getPositionEmoji(p.position)}</span>
                  <span className="font-medium text-gray-900 truncate">{getPlayerName(p.playerId)}</span>
                </div>
                  <span className="text-sm font-semibold text-red-700 whitespace-nowrap w-10">{p.points} pts</span>

              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function colorClass(color?: string) {
  switch (color) {
    case "azul":
      return "bg-blue-500";
    case "cinza":
      return "bg-gray-500";
    case "preto":
      return "bg-black";
    case "vermelho":
      return "bg-red-600";
    case "amarelo":
      return "bg-yellow-400";
    case "verde":
      return "bg-green-500";
    default:
      return "bg-gray-300";
  }
}
