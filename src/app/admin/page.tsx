"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Player, Race } from "@/lib/types";
import { getPlayers, getRaces } from "@/lib/firestore";
import { calculateStandings } from "@/lib/standings";
import { AdminGuard } from "@/components/AdminGuard";

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  );
}

function AdminDashboard() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [p, r] = await Promise.all([getPlayers(), getRaces()]);
      setPlayers(p);
      setRaces(r);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const standings = calculateStandings(players, races);
  const leader = standings[0];
  const lastRace = races.length > 0 ? races[0] : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
        ⚙️ Painel Administrativo
      </h1>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
          <div className="text-3xl font-bold text-red-700">{races.length}</div>
          <div className="text-sm text-gray-500 mt-1">Total de partidas</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
          <div className="text-3xl font-bold text-red-700">
            {players.filter((p) => p.active).length}
          </div>
          <div className="text-sm text-gray-500 mt-1">Jogadores ativos</div>
        </div>
        {leader && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
            <div className="text-lg font-bold text-red-700 truncate">
              {leader.playerName}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Líder ({leader.totalPoints} pts)
            </div>
          </div>
        )}
        {lastRace && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
            <div className="text-lg font-bold text-red-700">
              #{lastRace.number}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {new Intl.DateTimeFormat("pt-BR").format(lastRace.date)}
            </div>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <Link
          href="/admin/jogadores"
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-red-300 transition-all group"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">👥</span>
            <div>
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-red-700 transition-colors">
                Jogadores
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Gerenciar jogadores do campeonato
              </p>
            </div>
          </div>
        </Link>
        <Link
          href="/admin/partidas"
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-red-300 transition-all group"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">🏁</span>
            <div>
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-red-700 transition-colors">
                Partidas
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Registrar e gerenciar partidas
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent races */}
      {races.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              📋 Últimas Partidas
            </h2>
            <Link
              href="/admin/partidas"
              className="text-sm text-red-700 hover:text-red-800 font-medium"
            >
              Ver todas →
            </Link>
          </div>
          <div className="space-y-2">
            {races.slice(0, 5).map((race) => {
              const winner = race.participants.find((p) => p.position === 1);
              const winnerName = players.find(
                (pl) => pl.id === winner?.playerId
              )?.name;
              return (
                <div
                  key={race.id}
                  className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <span className="font-medium text-gray-900">
                      Partida #{race.number}
                    </span>
                    <span className="text-gray-500 text-sm ml-2">
                      {new Intl.DateTimeFormat("pt-BR").format(race.date)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    🥇 {winnerName || "—"} • {race.participants.length} jogadores
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
