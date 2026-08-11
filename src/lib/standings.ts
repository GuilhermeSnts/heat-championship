import { Player, Race, PlayerStats } from "./types";

/**
 * Calculates full standings from players and races.
 *
 * Eligibility rule: a player must have played at least ceil(2/3 * totalRaces)
 * to be "OFICIAL". Otherwise "PROVISÓRIO".
 *
 * Ordering:
 *   1. OFICIAL players first, sorted by average DESC
 *   2. PROVISÓRIO players after, sorted by average DESC
 *
 * Tiebreakers (OFICIAL only, same average):
 *   1. Most races played
 *   2. Most first places
 *   3. Most second places
 *   4. Most third places
 *   5. Best position in the most recent race
 */
export function calculateStandings(
  players: Player[],
  races: Race[]
): PlayerStats[] {
  const totalRaces = races.length;
  const minRaces = totalRaces === 0 ? 0 : Math.ceil((2 / 3) * totalRaces);

  const statsMap = new Map<string, PlayerStats>();

  // Initialize stats for all active players
  for (const player of players) {
    if (!player.active) continue;
    statsMap.set(player.id, {
      playerId: player.id,
      playerName: player.name,
      active: player.active,
      totalPoints: 0,
      racesPlayed: 0,
      average: 0,
      firstPlaces: 0,
      secondPlaces: 0,
      thirdPlaces: 0,
      eligibility: "PROVISÓRIO",
    });
  }

  // Accumulate stats from races, sorted oldest to newest
  const sortedRaces = [...races].sort(
    (a, b) => a.number - b.number
  );

  for (const race of sortedRaces) {
    for (const p of race.participants) {
      const stats = statsMap.get(p.playerId);
      if (!stats) continue;

      stats.totalPoints += p.points;
      stats.racesPlayed += 1;

      if (p.position === 1) stats.firstPlaces += 1;
      if (p.position === 2) stats.secondPlaces += 1;
      if (p.position === 3) stats.thirdPlaces += 1;

      // Track last race performance
      stats.lastRacePosition = p.position;
      stats.lastRaceDate = race.date;
    }
  }

  // Calculate averages and eligibility
  for (const stats of statsMap.values()) {
    stats.average =
      stats.racesPlayed > 0 ? stats.totalPoints / stats.racesPlayed : 0;
    stats.eligibility =
      totalRaces === 0 || stats.racesPlayed >= minRaces
        ? "OFICIAL"
        : "PROVISÓRIO";
  }

  // Sort: OFICIAL first by average DESC, then PROVISÓRIO by average DESC
  const result = Array.from(statsMap.values()).sort((a, b) => {
    // OFICIAL comes before PROVISÓRIO
    if (a.eligibility !== b.eligibility) {
      return a.eligibility === "OFICIAL" ? -1 : 1;
    }

    // Same eligibility: sort by average DESC
    if (a.average !== b.average) {
      return b.average - a.average;
    }

    // Tiebreakers (only meaningful for OFICIAL)
    if (a.eligibility === "OFICIAL") {
      // Most races played
      if (a.racesPlayed !== b.racesPlayed) {
        return b.racesPlayed - a.racesPlayed;
      }
      // Most first places
      if (a.firstPlaces !== b.firstPlaces) {
        return b.firstPlaces - a.firstPlaces;
      }
      // Most second places
      if (a.secondPlaces !== b.secondPlaces) {
        return b.secondPlaces - a.secondPlaces;
      }
      // Most third places
      if (a.thirdPlaces !== b.thirdPlaces) {
        return b.thirdPlaces - a.thirdPlaces;
      }
      // Best position in most recent race (lower = better)
      const aPos = a.lastRacePosition || 999;
      const bPos = b.lastRacePosition || 999;
      return aPos - bPos;
    }

    // PROVISÓRIO: just by average
    return b.average - a.average;
  });

  return result;
}

/**
 * Gets stats for a single player
 */
export function getPlayerStats(
  playerId: string,
  players: Player[],
  races: Race[]
): PlayerStats | null {
  const standings = calculateStandings(players, races);
  return standings.find((s) => s.playerId === playerId) || null;
}

/**
 * Get player race history sorted by race number
 */
export function getPlayerRaceHistory(
  playerId: string,
  races: Race[]
): { race: Race; position: number; points: number }[] {
  return races
    .filter((r) => r.participants.some((p) => p.playerId === playerId))
    .map((r) => {
      const part = r.participants.find((p) => p.playerId === playerId)!;
      return { race: r, position: part.position, points: part.points };
    })
    .sort((a, b) => a.race.number - b.race.number);
}
