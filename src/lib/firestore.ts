import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import { Player, Race, RaceParticipant, AppUser, getPointsForPosition } from "./types";

// ============ Players ============

export async function getPlayers(): Promise<Player[]> {
  const q = query(collection(db, "players"), orderBy("name"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp)?.toDate() || new Date(),
  })) as Player[];
}

export async function getActivePlayers(): Promise<Player[]> {
  const q = query(
    collection(db, "players"),
    where("active", "==", true),
    orderBy("name")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp)?.toDate() || new Date(),
  })) as Player[];
}

export async function getPlayer(id: string): Promise<Player | null> {
  const snap = await getDoc(doc(db, "players", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Player;
}

export async function createPlayer(name: string): Promise<string> {
  const ref = await addDoc(collection(db, "players"), {
    name: name.trim(),
    active: true,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updatePlayer(id: string, data: Partial<Player>): Promise<void> {
  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name.trim();
  if (data.active !== undefined) updateData.active = data.active;
  await updateDoc(doc(db, "players", id), updateData);
}

// ============ Races ============

export async function getRaces(): Promise<Race[]> {
  const q = query(collection(db, "races"), orderBy("number", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      number: data.number,
      date: (data.date as Timestamp)?.toDate() || new Date(),
      participants: data.participants || [],
      map: data.map || undefined,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
    };
  }) as Race[];
}

export async function getRace(id: string): Promise<Race | null> {
  const snap = await getDoc(doc(db, "races", id));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    number: data.number,
    date: (data.date as Timestamp)?.toDate() || new Date(),
    participants: data.participants || [],
    map: data.map || undefined,
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
  } as Race;
}

export async function createRace(
  date: Date,
  participants: { playerId: string; position: number; carColor?: string }[],
  map?: string
): Promise<string> {
  const races = await getRaces();
  const nextNumber = races.length > 0 ? Math.max(...races.map((r) => r.number)) + 1 : 1;

  const raceParticipants: RaceParticipant[] = participants.map((p) => ({
    playerId: p.playerId,
    position: p.position,
    points: getPointsForPosition(p.position),
    carColor: (p as any).carColor || undefined,
  }));

  const ref = await addDoc(collection(db, "races"), {
    number: nextNumber,
    date: Timestamp.fromDate(date),
    participants: raceParticipants,
    map: map || undefined,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateRace(
  id: string,
  date: Date,
  participants: { playerId: string; position: number; carColor?: string }[],
  map?: string
): Promise<void> {
  const raceParticipants: RaceParticipant[] = participants.map((p) => ({
    playerId: p.playerId,
    position: p.position,
    points: getPointsForPosition(p.position),
    carColor: (p as any).carColor || undefined,
  }));

  await updateDoc(doc(db, "races", id), {
    date: Timestamp.fromDate(date),
    participants: raceParticipants,
    map: map || undefined,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteRace(id: string): Promise<void> {
  await deleteDoc(doc(db, "races", id));
}

// ============ Users ============

export async function getUserByEmail(email: string): Promise<AppUser | null> {
  const q = query(collection(db, "users"), where("email", "==", email));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as AppUser;
}

export async function createUserIfNotExists(
  uid: string,
  name: string,
  email: string
): Promise<void> {
  const existing = await getDoc(doc(db, "users", uid));
  if (!existing.exists()) {
    const q = query(collection(db, "users"), where("email", "==", email));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      await addDoc(collection(db, "users"), {
        id: uid,
        name,
        email,
        role: "admin",
        createdAt: serverTimestamp(),
      });
    }
  }
}
