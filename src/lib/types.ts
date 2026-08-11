export interface Player {
  id: string;
  name: string;
  active: boolean;
  createdAt: Date;
}

export interface RaceParticipant {
  playerId: string;
  playerName?: string;
  position: number;
  points: number;
}

export interface Race {
  id: string;
  date: Date;
  number: number;
  participants: RaceParticipant[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PlayerStats {
  playerId: string;
  playerName: string;
  active: boolean;
  totalPoints: number;
  racesPlayed: number;
  average: number;
  firstPlaces: number;
  secondPlaces: number;
  thirdPlaces: number;
  eligibility: "OFICIAL" | "PROVISÓRIO";
  lastRacePosition?: number;
  lastRaceDate?: Date;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: "admin";
  createdAt: Date;
}

export const POINTS_TABLE: Record<number, number> = {
  1: 25,
  2: 18,
  3: 15,
  4: 12,
  5: 10,
  6: 8,
};

export const MAX_PLAYERS = 6;

export function getPointsForPosition(position: number): number {
  return POINTS_TABLE[position] || 0;
}
