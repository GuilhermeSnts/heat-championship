"use client";

import { useState, useMemo } from "react";
import { Player, Race, getPointsForPosition } from "@/lib/types";
import { Award, Trash } from "lucide-react";

interface RaceFormProps {
  players: Player[];
  race?: Race;
  onSubmit: (
    date: Date,
    participants: { playerId: string; position: number; carColor?: string }[],
    map?: "USA" | "ITALIA" | "FRANÇA" | "INGLATERRA"
  ) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => void;
}

export function RaceForm({
  players,
  race,
  onSubmit,
  onCancel,
  onDelete,
}: RaceFormProps) {
  const existingParticipantIds = race
    ? race.participants.map((p) => p.playerId)
    : [];
  const existingPositions = race
    ? race.participants.map((p) => p.position)
    : [];

  const [selectedPlayers, setSelectedPlayers] = useState<string[]>(
    existingParticipantIds
  );
  const [positions, setPositions] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    if (race) {
      for (const p of race.participants) {
        map[p.playerId] = p.position;
      }
    }
    return map;
  });
  const [date, setDate] = useState(
    race
      ? race.date.toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [map, setMap] = useState<"USA" | "ITALIA" | "FRANÇA" | "INGLATERRA">(
    (race?.map as any) || "USA"
  );

  const [colors, setColors] = useState<Record<string, string>>(() => {
    const c: Record<string, string> = {};
    if (race) {
      for (const p of race.participants) {
        if ((p as any).carColor) c[p.playerId] = (p as any).carColor;
      }
    }
    return c;
  });

  const togglePlayer = (playerId: string) => {
    setSelectedPlayers((prev) => {
      if (prev.includes(playerId)) {
        const next = prev.filter((id) => id !== playerId);
        setPositions((p) => {
          const copy = { ...p };
          delete copy[playerId];
          // Reassign positions for remaining
          const sorted = [...next].sort(
            (a, b) => (p[a] || 99) - (p[b] || 99)
          );
          sorted.forEach((id, i) => {
            copy[id] = i + 1;
          });
          return copy;
        });
        return next;
      }
      const next = [...prev, playerId];
      setPositions((p) => ({
        ...p,
        [playerId]: next.length,
      }));
      setColors((c) => ({ ...c, [playerId]: c[playerId] || "azul" }));
      return next;
    });
  };

  const sortedParticipants = useMemo(() => {
    return [...selectedPlayers].sort(
      (a, b) => (positions[a] || 99) - (positions[b] || 99)
    );
  }, [selectedPlayers, positions]);

  const setPlayerPosition = (playerId: string, newPos: number) => {
    setPositions((prev) => {
      const oldPos = prev[playerId];
      if (oldPos === newPos) return prev;

      const copy = { ...prev };
      // Swap with player currently at newPos
      const swapped = Object.entries(copy).find(
        ([, v]) => v === newPos
      );
      if (swapped) {
        copy[swapped[0]] = oldPos;
      }
      copy[playerId] = newPos;
      return copy;
    });
  };

  const validate = (): string | null => {
    if (selectedPlayers.length === 0) return "Selecione pelo menos um jogador.";
    const posValues = Object.values(positions);
    const uniquePos = new Set(posValues);
    if (uniquePos.size !== posValues.length) return "Posições duplicadas.";
    if (posValues.some((p) => p < 1 || p > selectedPlayers.length))
      return "Posições inválidas.";
    if (!date) return "Selecione uma data.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setSaving(true);
    setError("");
    try {
      const participants = selectedPlayers.map((pid) => ({
        playerId: pid,
        position: positions[pid],
        carColor: colors[pid] || "azul",
      }));
      await onSubmit(new Date(date + "T12:00:00"), participants, map);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data da partida
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
          disabled={saving}
        />
      </div>

      {/* Player selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Jogadores participantes
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {players.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => togglePlayer(p.id)}
              className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                selectedPlayers.includes(p.id)
                  ? "border-red-600 bg-red-50 text-red-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              {selectedPlayers.includes(p.id) ? "☑ " : "☐ "}
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Map selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Mapa</label>
        <select
          value={map}
          onChange={(e) => setMap(e.target.value as any)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="USA">USA</option>
          <option value="ITALIA">ITALIA</option>
          <option value="FRANÇA">FRANÇA</option>
          <option value="INGLATERRA">INGLATERRA</option>
        </select>
      </div>

      {/* Position ordering */}
      {selectedPlayers.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ordem de chegada
          </label>
          <div className="space-y-2">
            {sortedParticipants.map((playerId, idx) => {
              const player = players.find((p) => p.id === playerId);
              const pos = positions[playerId];
              const pts = getPointsForPosition(pos);
              return (
                <div
                  key={playerId}
                  className="flex items-center gap-3 bg-gray-50 rounded-lg p-3"
                >
                  <span className="text-lg font-bold text-gray-400 w-8">
                    {getPositionEmoji(pos)}
                  </span>
                  <span className="flex-1 font-medium">{player?.name}</span>
                  <div className="w-36">
                    <label className="block text-xs text-gray-500">Cor do carro</label>
                    <select
                      value={colors[playerId] || "azul"}
                      onChange={(e) =>
                        setColors((c) => ({ ...c, [playerId]: e.target.value }))
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="azul">Azul</option>
                      <option value="cinza">Cinza</option>
                      <option value="preto">Preto</option>
                      <option value="vermelho">Vermelho</option>
                      <option value="amarelo">Amarelo</option>
                      <option value="verde">Verde</option>
                    </select>
                  </div>
                  <select
                    value={pos}
                    onChange={(e) =>
                      setPlayerPosition(playerId, Number(e.target.value))
                    }
                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                  >
                    {selectedPlayers.map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}º
                      </option>
                    ))}
                  </select>
                  <span className="text-sm font-bold text-red-700 w-16 text-right">
                    {pts} pts
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {error && (
        <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-red-700 hover:bg-red-800 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-colors"
        >
          {saving ? "Salvando..." : race ? "Atualizar Partida" : "Registrar Partida"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
      </div>

      {race && onDelete && (
        <div className="pt-4 border-t border-gray-200">
            <button
            type="button"
            onClick={() => {
              if (confirm("Tem certeza que deseja excluir esta partida?")) {
                onDelete();
              }
            }}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            <Trash className="inline w-4 h-4 mr-1" /> Excluir partida
          </button>
        </div>
      )}
    </form>
  );
}

function getPositionEmoji(pos: number) {
  if (pos === 1) return <Award className="w-5 h-5 text-yellow-400" />;
  if (pos === 2) return <Award className="w-5 h-5 text-slate-400" />;
  if (pos === 3) return <Award className="w-5 h-5 text-amber-700" />;
  return <span>{pos}º</span>;
}
