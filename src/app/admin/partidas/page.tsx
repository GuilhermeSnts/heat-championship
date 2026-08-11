"use client";

import { useEffect, useState } from "react";
import { Player, Race } from "@/lib/types";
import {
  getPlayers,
  getRaces,
  createRace,
  updateRace,
  deleteRace,
} from "@/lib/firestore";
import { AdminGuard } from "@/components/AdminGuard";
import { RaceForm } from "@/components/RaceForm";
import Link from "next/link";

export default function AdminRacesPage() {
  return (
    <AdminGuard>
      <AdminRaces />
    </AdminGuard>
  );
}

function AdminRaces() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRace, setEditingRace] = useState<Race | null>(null);

  const loadData = async () => {
    const [p, r] = await Promise.all([getPlayers(), getRaces()]);
    setPlayers(p.filter((pl) => pl.active));
    setRaces(r);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (
    date: Date,
    participants: { playerId: string; position: number }[]
  ) => {
    await createRace(date, participants);
    setShowForm(false);
    await loadData();
  };

  const handleUpdate = async (
    date: Date,
    participants: { playerId: string; position: number }[]
  ) => {
    if (!editingRace) return;
    await updateRace(editingRace.id, date, participants);
    setEditingRace(null);
    await loadData();
  };

  const handleDelete = async () => {
    if (!editingRace) return;
    await deleteRace(editingRace.id);
    setEditingRace(null);
    await loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          🏁 Partidas
        </h1>
        {!showForm && !editingRace && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-red-700 hover:bg-red-800 text-white px-5 py-3 rounded-lg font-medium transition-colors"
          >
            + Nova Partida
          </button>
        )}
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Registrar Partida
          </h2>
          <RaceForm
            players={players}
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Edit form */}
      {editingRace && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Editar Partida #{editingRace.number}
          </h2>
          <RaceForm
            players={players}
            race={editingRace}
            onSubmit={handleUpdate}
            onCancel={() => setEditingRace(null)}
            onDelete={handleDelete}
          />
        </div>
      )}

      {/* Race list */}
      <div className="space-y-3">
        {races.map((race) => {
          const sorted = [...race.participants].sort(
            (a, b) => a.position - b.position
          );
          return (
            <div
              key={race.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <div className="flex items-center justify-between p-4">
                <div>
                  <span className="font-bold text-gray-900">
                    Partida #{race.number}
                  </span>
                  <span className="text-gray-500 text-sm ml-3">
                    {new Intl.DateTimeFormat("pt-BR").format(race.date)}
                  </span>
                  <span className="text-gray-400 text-sm ml-3">
                    {race.participants.length} jogadores
                  </span>
                </div>
                <button
                  onClick={() => setEditingRace(race)}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                >
                  Editar
                </button>
              </div>
              <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
                <div className="flex flex-wrap gap-3">
                  {sorted.map((p) => {
                    const player = players.find(
                      (pl) => pl.id === p.playerId
                    );
                    return (
                      <span
                        key={p.playerId}
                        className="inline-flex items-center gap-1 text-sm"
                      >
                        <span>
                          {p.position === 1
                            ? "🥇"
                            : p.position === 2
                            ? "🥈"
                            : p.position === 3
                            ? "🥉"
                            : `${p.position}º`}
                        </span>
                        <span className="font-medium">
                          {player?.name || "—"}
                        </span>
                        <span className="text-gray-400">
                          ({p.points}pts)
                        </span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
        {races.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-3">🏁</p>
            <p>Nenhuma partida registrada.</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-3 text-red-700 hover:text-red-800 font-medium"
            >
              Registrar primeira partida →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
