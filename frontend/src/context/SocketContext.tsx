import React, { createContext, useContext, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

interface Queue {
  id: string;
  waitTime: number;
}

interface MatchState {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  minute: number;
  status: 'scheduled' | 'live' | 'finished';
  possession: { home: number; away: number };
  expectedGoals: { home: number; away: number };
  event?: { time: number; type: string; detail: string } | null;
}

interface StadiumTick {
  crowdCount: number;
  weather: { temp: number; condition: string; wind: string };
  match: MatchState;
  queues: {
    restrooms: Queue[];
    food: Queue[];
  };
}

interface SocketContextType {
  socket: Socket | null;
  liveData: StadiumTick;
  connected: boolean;
  activeAlerts: string[];
  addAlert: (msg: string) => void;
  clearAlerts: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Initial state for simulated data
const initialData: StadiumTick = {
  crowdCount: 68420,
  weather: { temp: 24, condition: 'Clear', wind: '12 km/h' },
  match: {
    homeTeam: 'USA',
    awayTeam: 'Mexico',
    homeScore: 1,
    awayScore: 1,
    minute: 54,
    status: 'live',
    possession: { home: 55, away: 45 },
    expectedGoals: { home: 1.45, away: 1.12 },
    event: null
  },
  queues: {
    restrooms: [
      { id: 'restroom_1', waitTime: 3 },
      { id: 'restroom_2', waitTime: 6 },
      { id: 'restroom_3', waitTime: 2 },
    ],
    food: [
      { id: 'stall_1', waitTime: 5 },
      { id: 'stall_2', waitTime: 12 },
      { id: 'stall_3', waitTime: 4 },
    ]
  }
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [liveData, setLiveData] = useState<StadiumTick>(initialData);
  const [connected, setConnected] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState<string[]>(['Welcome to ArenaMind AI Platform. Systems Nominal.']);

  const addAlert = (msg: string) => {
    setActiveAlerts(prev => [msg, ...prev.slice(0, 9)]);
  };

  const clearAlerts = () => {
    setActiveAlerts([]);
  };

  useEffect(() => {
    // Connect directly to the backend to avoid Vite WS proxy instability on Windows.
    // The backend has CORS origin:'*' so no cross-origin issues.
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const newSocket = io(BACKEND_URL, {
      // Start with polling (HTTP long-poll) so the Socket.IO handshake
      // completes before upgrading to WebSocket. Forcing 'websocket' first
      // skips the EIO handshake and causes "WS closed before established" on Windows.
      transports: ['polling', 'websocket'],
      autoConnect: true,
      reconnectionDelay: 2000,
      reconnectionAttempts: 15,
      timeout: 10000,
    });

    newSocket.on('connect', () => {
      console.log('🔌 Connected to real-time operations socket.');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Disconnected from real-time operations socket.');
      setConnected(false);
    });

    newSocket.on('stadium_tick', (data: StadiumTick) => {
      setLiveData(data);
      if (data.match.event) {
        addAlert(`⚽ MATCH ALERT [Min ${data.match.event.time}]: ${data.match.event.detail}`);
      }
    });

    newSocket.on('volunteer_location_update', (data: any) => {
      addAlert(`📡 GPS: Volunteer "${data.name}" reported position: SECTION ${data.section}`);
    });

    newSocket.on('chat_message', (data: any) => {
      addAlert(`💬 CHAT: [${data.sender}] ${data.text}`);
    });

    setSocket(newSocket);

    // ----------------------------------------------------
    // Fallback simulation timer when offline
    // ----------------------------------------------------
    let timerId: ReturnType<typeof setInterval>;
    const runOfflineSimulation = () => {
      timerId = setInterval(() => {
        if (newSocket.connected) return; // Skip if live connection exists

        setLiveData(prev => {
          // Fluctuating numbers
          let nextCrowd = prev.crowdCount + Math.floor(Math.random() * 15) - 7;
          if (nextCrowd > 75000) nextCrowd = 75000;
          if (nextCrowd < 60000) nextCrowd = 60000;

          let nextMin = prev.match.minute;
          let nextHome = prev.match.homeScore;
          let nextAway = prev.match.awayScore;
          let nextEvent: any = null;

          if (nextMin < 90 && Math.random() > 0.4) {
            nextMin += 1;
            // Random scoring chance
            if (Math.random() > 0.98) {
              if (Math.random() > 0.5) {
                nextHome += 1;
                nextEvent = { time: nextMin, type: 'goal', detail: 'GOAL! USA scores. What a finish!' };
              } else {
                nextAway += 1;
                nextEvent = { time: nextMin, type: 'goal', detail: 'GOAL! Mexico equalizes. Incredible shot!' };
              }
            }
          }

          if (nextEvent) {
            addAlert(`⚽ MATCH ALERT [Min ${nextEvent.time}]: ${nextEvent.detail}`);
          }

          return {
            crowdCount: nextCrowd,
            weather: prev.weather,
            match: {
              homeTeam: prev.match.homeTeam,
              awayTeam: prev.match.awayTeam,
              status: prev.match.status,
              minute: nextMin,
              homeScore: nextHome,
              awayScore: nextAway,
              possession: {
                home: Math.floor(52 + Math.sin(nextMin / 4) * 5),
                away: Math.floor(48 - Math.sin(nextMin / 4) * 5)
              },
              expectedGoals: {
                home: Number((nextHome * 0.9 + Math.random() * 0.1).toFixed(2)),
                away: Number((nextAway * 0.9 + Math.random() * 0.1).toFixed(2)),
              },
              event: nextEvent
            },
            queues: {
              restrooms: prev.queues.restrooms.map(q => ({
                ...q,
                waitTime: Math.max(1, q.waitTime + (Math.random() > 0.5 ? 1 : -1))
              })),
              food: prev.queues.food.map(q => ({
                ...q,
                waitTime: Math.max(2, q.waitTime + (Math.random() > 0.5 ? 1 : -1))
              }))
            }
          };
        });
      }, 5000);
    };

    runOfflineSimulation();

    return () => {
      newSocket.close();
      if (timerId) clearInterval(timerId);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, liveData, connected, activeAlerts, addAlert, clearAlerts }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
