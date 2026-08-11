"use client";

import { useState } from "react";
import { Player } from "@/lib/types";

interface PlayerFormProps {
  player?: Player;
  onSubmit: (name: string) => Promise<void>;
  onCancel: () => void;
  existingCount: number;
}

export function PlayerForm({
  player,
  onSubmit,
  onCancel,
  existingCount,
}: PlayerFormProps) {
  const [name, setName] = useState(player?.name || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isNew = !player;
  const atMax = isNew && existingCount >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Nome é obrigatório.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSubmit(trimmed);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome do jogador
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
          placeholder="Nome do jogador"
          disabled={saving}
          autoFocus
        />
      </div>

      {atMax && (
        <p className="text-amber-600 text-sm">
          ⚠️ Limite de 6 jogadores ativos atingido. Desative um jogador existente
          antes de criar um novo.
        </p>
      )}

      {error && (
        <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving || (atMax && isNew)}
          className="flex-1 bg-red-700 hover:bg-red-800 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-colors"
        >
          {saving ? "Salvando..." : isNew ? "Criar Jogador" : "Salvar"}
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
    </form>
  );
}
