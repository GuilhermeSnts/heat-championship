"use client";

import { useEffect, useState } from "react";
import { Trophy, Award, Clipboard, AlertCircle } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Player, Race } from "@/lib/types";
import { getPlayers, getRaces, getPlayer } from "@/lib/firestore";
import { getPlayerStats, getPlayerRaceHistory } from "@/lib/standings";
import { RaceCard } from "@/components/RaceCard";

export default function PlayerPage() {
  const params = useParams();
  const id = params.id as string;

  const [player, setPlayer] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [p, allPlayers, allRaces] = await Promise.all([
        getPlayer(id),
        getPlayers(),
        getRaces(),
      ]);
      setPlayer(p);
      setPlayers(allPlayers);
      setRaces(allRaces);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-4"><AlertCircle className="w-12 h-12 mx-auto text-gray-400" /></p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Jogador não encontrado
        </h1>
        <Link href="/" className="text-red-700 hover:text-red-800 font-medium">
          ← Voltar para classificação
        </Link>
      </div>
    );
  }

  const stats = getPlayerStats(id, players, races);
  const history = getPlayerRaceHistory(id, races);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-6 text-sm"
      >
        ← Voltar para classificação
      </Link>

      {/* Player header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          {player.name}
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <span
            className={`px-2 py-1 rounded-full text-xs font-bold ${
              stats?.eligibility === "OFICIAL"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {stats?.eligibility || "—"}
          </span>
          {!player.active && (
            <span className="px-2 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
              INATIVO
            </span>
          )}
        </div>
      </div>

      {/* Stats grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-red-700">
              {stats.totalPoints}
            </div>
            <div className="text-xs text-gray-500 mt-1">Pontos</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-red-700">
              {stats.average.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Média</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-red-700">
              {stats.racesPlayed}
            </div>
            <div className="text-xs text-gray-500 mt-1">Partidas</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-red-700">
              {stats.racesPlayed > 0 && races.length > 0
                ? Math.round((stats.racesPlayed / races.length) * 100)
                : 0}
              %
            </div>
            <div className="text-xs text-gray-500 mt-1">Participação</div>
          </div>
        </div>
      )}

      {/* Podium stats */}
      {stats && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5" /> Desempenho
          </h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl mb-1"><Award className="w-8 h-8 text-yellow-400" /></div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.firstPlaces}
              </div>
              <div className="text-xs text-gray-500">Vitórias</div>
            </div>
            <div>
              <div className="text-3xl mb-1"><Award className="w-8 h-8 text-slate-400" /></div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.secondPlaces}
              </div>
              <div className="text-xs text-gray-500">2º lugares</div>
            </div>
            <div>
              <div className="text-3xl mb-1"><Award className="w-8 h-8 text-amber-700" /></div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.thirdPlaces}
              </div>
              <div className="text-xs text-gray-500">3º lugares</div>
            </div>
          </div>
        </div>
      )}

      {/* Race history */}
      {history.length > 0 && (
        <>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clipboard className="w-5 h-5" /> Histórico de Partidas
          </h2>
          <div className="space-y-3">
            {history.map(({ race, position, points }) => (
              <div
                key={race.id}
                className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900">
                      Partida #{race.number}
                    </span>
                    <span className="text-gray-500 text-sm ml-2">
                      {new Intl.DateTimeFormat("pt-BR").format(race.date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">
                      {position}º lugar
                    </span>
                    <span className="font-bold text-red-700">{points} pts</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {history.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>Nenhuma partida registrada ainda.</p>
        </div>
      )}
    </div>
  );
}
