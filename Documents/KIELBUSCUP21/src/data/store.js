import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase";

const PLAYERS_COLLECTION = "players";

// =====================================================
// CREAR JUGADOR
// =====================================================

export async function createPlayer(playerData) {
  const name = playerData.name?.trim();

  if (!name) {
    throw new Error("El nombre es obligatorio.");
  }

  const player = {
    name,
    teamId: playerData.teamId || null,
    lives: playerData.lives ?? 4,
    points: playerData.points ?? 0,
    eliminated: playerData.eliminated ?? false,
    isCaptain: playerData.isCaptain ?? false,
    createdAt: serverTimestamp(),
  };

  const playersRef = collection(db, PLAYERS_COLLECTION);

  const result = await addDoc(playersRef, player);

  return {
    id: result.id,
    ...player,
  };
}

// =====================================================
// OBTENER TODOS LOS JUGADORES
// =====================================================

export async function getPlayers() {
  const playersRef = collection(db, PLAYERS_COLLECTION);

  const playersQuery = query(
    playersRef,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(playersQuery);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

// =====================================================
// OBTENER UN JUGADOR POR ID
// =====================================================

export async function getPlayerById(playerId) {
  if (!playerId) {
    return null;
  }

  const playerRef = doc(
    db,
    PLAYERS_COLLECTION,
    playerId
  );

  const snapshot = await getDoc(playerRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}


// Escuchar en tiempo real la ficha individual del jugador.
export function subscribeToPlayer(playerId, callback, onError) {
  if (!playerId) {
    callback(null);
    return () => {};
  }

  const playerRef = doc(db, PLAYERS_COLLECTION, playerId);
  return onSnapshot(
    playerRef,
    (snapshot) => {
      callback(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
    },
    (error) => {
      console.error("Error escuchando la ficha del jugador:", error);
      onError?.(error);
    },
  );
}

// =====================================================
// ACTUALIZAR JUGADOR
// =====================================================

export async function updatePlayer(playerId, changes) {
  if (!playerId) {
    throw new Error("ID de jugador no válido.");
  }

  const playerRef = doc(
    db,
    PLAYERS_COLLECTION,
    playerId
  );

  await updateDoc(playerRef, changes);

  return getPlayerById(playerId);
}

// =====================================================
// ELIMINAR JUGADOR
// =====================================================

export async function deletePlayer(playerId) {
  if (!playerId) {
    throw new Error("ID de jugador no válido.");
  }

  const playerRef = doc(
    db,
    PLAYERS_COLLECTION,
    playerId
  );

  await deleteDoc(playerRef);
}

// =====================================================
// REINICIAR TORNEO
// Borra todos los jugadores de Firestore
// =====================================================

export async function resetPlayers() {
  const playersRef = collection(
    db,
    PLAYERS_COLLECTION
  );

  const snapshot = await getDocs(playersRef);

  const deletePromises = snapshot.docs.map(
    (playerDoc) =>
      deleteDoc(
        doc(
          db,
          PLAYERS_COLLECTION,
          playerDoc.id
        )
      )
  );

  await Promise.all(deletePromises);
}

// =====================================================
// ESCUCHAR JUGADORES EN TIEMPO REAL
// =====================================================

export function subscribeToPlayers(
  callback,
  onError
) {
  const playersRef = collection(
    db,
    PLAYERS_COLLECTION
  );

  const playersQuery = query(
    playersRef,
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    playersQuery,
    (snapshot) => {
      const players = snapshot.docs.map(
        (item) => ({
          id: item.id,
          ...item.data(),
        })
      );

      callback(players);
    },
    (error) => {
      console.error(
        "Error escuchando jugadores:",
        error
      );

      if (onError) {
        onError(error);
      }
    }
  );
}