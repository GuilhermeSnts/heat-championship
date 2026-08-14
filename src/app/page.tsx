"use client";

import { useEffect, useState } from "react";
import { Player, Race } from "@/lib/types";
import { getPlayers, getRaces } from "@/lib/firestore";
import { calculateStandings } from "@/lib/standings";
import { StandingsTable } from "@/components/StandingsTable";
import { Podium } from "@/components/Podium";
import { RaceCard } from "@/components/RaceCard";
import Image from "next/image";
import { Flag, Clipboard } from "lucide-react";

export default function HomePage() {
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
  const officialPlayers = standings.filter((s) => s.eligibility === "OFICIAL");
  const mostWins = standings.reduce(
    (max, s) => (s.firstPlaces > (max?.firstPlaces || 0) ? s : max),
    standings[0]
  );
  const lastRace = races.length > 0 ? races[0] : null;
  const bestAvg = officialPlayers.reduce(
    (max, s) => (s.average > (max?.average || 0) ? s : max),
    officialPlayers[0]
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="w-full flex align-middle justify-center">
        <Image src="/dog_flag.png" alt="Logo" width={250} height={150} />
      </div>
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">
          GRAND PRIX HEAT
        </h1>
        <p className="text-lg text-gray-500">Grande prêmio de 2026</p>
      </div>


      {/* Podium */}
      {standings.length > 0 && <Podium standings={standings} />}

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-red-700">{races.length}</div>
          <div className="text-xs text-gray-500 mt-1">Partidas</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-red-700">
            {players.filter((p) => p.active).length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Jogadores</div>
        </div>
        {mostWins && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <div className="text-sm font-bold text-red-700 truncate">
              {mostWins.playerName}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Mais vitórias ({mostWins.firstPlaces})
            </div>
          </div>
        )}
        {bestAvg && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <div className="text-sm font-bold text-red-700 truncate">
              {bestAvg.playerName}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Melhor média ({bestAvg.average.toFixed(1)})
            </div>
          </div>
        )}
      </div>



      {/* Last race highlight */}
      {lastRace && (
        <div className="bg-linear-to-r from-red-50 to-amber-50 rounded-xl border border-red-200 p-4 mb-8">
          <p className="text-sm text-red-700 font-semibold mb-1 flex items-center gap-2">
            <Flag className="w-4 h-4" /> Última partida: #{lastRace.number}
          </p>
          <p className="text-xs text-gray-500">
            {new Intl.DateTimeFormat("pt-BR").format(lastRace.date)}
          </p>
        </div>
      )}

      <div className="w-full flex align-middle justify-center">
        <Image src="/trofeu.png" alt="Logo" width={250} height={150} />
      </div>

      {/* Standings */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Classificação</h2>
      <StandingsTable standings={standings} totalRaces={races.length} />

      {/* Race history */}
      {races.length > 0 && (
        <>
        <div className="w-full mt-8 flex align-middle justify-center">
          <Image src="/running.png" alt="Logo" width={250} height={150} />
        </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4 flex items-center gap-2">
            <Clipboard className="w-5 h-5" /> Histórico de Partidas
          </h2>
          <div className="space-y-3">
            {races.map((race) => (
              <RaceCard key={race.id} race={race} players={players} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
