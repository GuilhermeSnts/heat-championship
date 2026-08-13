"use client";

import { PlayerStats } from "@/lib/types";
import { Award, Car } from "lucide-react";
import Link from "next/link";

interface StandingsTableProps {
  standings: PlayerStats[];
  totalRaces: number;
}

function getMedal(position: number) {
  if (position === 1) return <Award className="w-5 h-5 text-yellow-400" />;
  if (position === 2) return <Award className="w-5 h-5 text-slate-400" />;
  if (position === 3) return <Award className="w-5 h-5 text-amber-700" />;
  return <span>{position}</span>;
}

export function StandingsTable({ standings, totalRaces }: StandingsTableProps) {
  if (standings.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-4xl mb-4"><Car className="w-12 h-12 mx-auto" /></p>
        <p className="text-lg">Nenhum jogador cadastrado ainda.</p>
        <p className="text-sm mt-2">
          Aguarde o administrador configurar o campeonato.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-linear-to-r from-red-700 to-red-900 text-white">
              <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Jogador
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold">
                Pts
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold">
                Partidas
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold">
                Média
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold">
                <Award className="w-5 h-5 text-yellow-400 mx-auto" />
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold">
                <Award className="w-5 h-5 text-slate-400 mx-auto" />
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold">
                <Award className="w-5 h-5 text-amber-700 mx-auto" />
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {standings.map((stats, index) => (
              <tr
                key={stats.playerId}
                className={`border-t border-gray-100 hover:bg-red-50 transition-colors ${
                  index < 3 ? "bg-amber-50/50" : ""
                }`}
              >
                <td className="px-4 py-3">
                  <span className="text-lg">{getMedal(index + 1)}</span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/jogador/${stats.playerId}`}
                    className="font-medium text-gray-900 hover:text-red-700 transition-colors"
                  >
                    {stats.playerName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-center font-semibold">
                  {stats.totalPoints}
                </td>
                <td className="px-4 py-3 text-center text-gray-600">
                  {stats.racesPlayed}
                </td>
                <td className="px-4 py-3 text-center font-medium">
                  {stats.average.toFixed(1)}
                </td>
                <td className="px-4 py-3 text-center">{stats.firstPlaces}</td>
                <td className="px-4 py-3 text-center">
                  {stats.secondPlaces}
                </td>
                <td className="px-4 py-3 text-center">{stats.thirdPlaces}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                      stats.eligibility === "OFICIAL"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {stats.eligibility}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-gray-100">
        {standings.map((stats, index) => (
          <Link
            href={`/jogador/${stats.playerId}`}
            key={stats.playerId}
            className={`block p-4 hover:bg-red-50 transition-colors ${
              index < 3 ? "bg-amber-50/50" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getMedal(index + 1)}</span>
                <span className="font-semibold text-gray-900">
                  {stats.playerName}
                </span>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-bold ${
                  stats.eligibility === "OFICIAL"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {stats.eligibility}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-sm">
              <div>
                <div className="text-gray-500">Pts</div>
                <div className="font-bold">{stats.totalPoints}</div>
              </div>
              <div>
                <div className="text-gray-500">Jogos</div>
                <div>{stats.racesPlayed}</div>
              </div>
              <div>
                <div className="text-gray-500">Média</div>
                <div className="font-medium">{stats.average.toFixed(1)}</div>
              </div>
              <div>
                <div className="text-gray-500">
                  <Award className="inline w-4 h-4 text-yellow-400" />
                  <Award className="inline w-4 h-4 text-slate-400 ml-1" />
                  <Award className="inline w-4 h-4 text-amber-700 ml-1" />
                </div>
                <div>
                  {stats.firstPlaces}/{stats.secondPlaces}/{stats.thirdPlaces}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
