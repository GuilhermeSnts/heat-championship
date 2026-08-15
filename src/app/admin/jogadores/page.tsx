"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { Player } from "@/lib/types";
import {
  getPlayers,
  createPlayer,
  updatePlayer,
} from "@/lib/firestore";
import { AdminGuard } from "@/components/AdminGuard";
import { PlayerForm } from "@/components/PlayerForm";

export default function AdminPlayersPage() {
  return (
    <AdminGuard>
      <AdminPlayers />
    </AdminGuard>
  );
}

function AdminPlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  const loadPlayers = async () => {
    const p = await getPlayers();
    setPlayers(p);
    setLoading(false);
  };

  useEffect(() => {
    let ignore = false;

    getPlayers().then((p) => {
      if (!ignore) {
        setPlayers(p);
        setLoading(false);
      }
    });

    return () => {
      ignore = true;
    };
  }, []);

  const activePlayers = players.filter((p) => p.active);
  const inactivePlayers = players.filter((p) => !p.active);

  const handleCreate = async (name: string) => {
    await createPlayer(name);
    setShowForm(false);
    await loadPlayers();
  };

  const handleUpdate = async (name: string) => {
    if (!editingPlayer) return;
    await updatePlayer(editingPlayer.id, { name });
    setEditingPlayer(null);
    await loadPlayers();
  };

  const handleToggleActive = async (player: Player) => {
    await updatePlayer(player.id, { active: !player.active });
    await loadPlayers();
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
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2"><Users className="w-6 h-6" /> Jogadores</h1>
        {!showForm && !editingPlayer && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-red-700 hover:bg-red-800 text-white px-5 py-3 rounded-lg font-medium transition-colors"
          >
            + Novo Jogador
          </button>
        )}
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Novo Jogador
          </h2>
          <PlayerForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Edit form */}
      {editingPlayer && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Editar Jogador
          </h2>
          <PlayerForm
            player={editingPlayer}
            onSubmit={handleUpdate}
            onCancel={() => setEditingPlayer(null)}
          />
        </div>
      )}

      {/* Active players */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">
          Ativos ({activePlayers.length}/6)
        </h2>
        <div className="space-y-2">
          {activePlayers.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-gray-900">
                  {player.name}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingPlayer(player)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-white transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleToggleActive(player)}
                  className="px-3 py-1.5 text-sm border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Desativar
                </button>
              </div>
            </div>
          ))}
          {activePlayers.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Nenhum jogador ativo.
            </p>
          )}
        </div>
      </div>

      {/* Inactive players */}
      {inactivePlayers.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Inativos</h2>
          <div className="space-y-2">
            {inactivePlayers.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between bg-gray-100 rounded-lg border border-gray-200 p-4 opacity-75"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-500">
                    {player.name}
                  </span>
                </div>
                <button
                  onClick={() => handleToggleActive(player)}
                  className="px-3 py-1.5 text-sm border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
                >
                  Reativar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
