import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

export const initSockets = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  console.log('🔌 Socket.IO Gateway initialized.');

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    socket.on('join_room', (room: string) => {
      socket.join(room);
      console.log(`🔌 Socket ${socket.id} joined room: ${room}`);
    });

    socket.on('volunteer_location', (data: any) => {
      io.to('admin_alerts').emit('volunteer_location_update', data);
    });

    socket.on('send_chat', (data: any) => {
      io.to('volunteer_tasks').emit('chat_message', data);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  // ----------------------------------------------------
  // Live Stadium Simulation Tick (Broadcasting every 4s)
  // ----------------------------------------------------
  let crowdCount = 68430;
  let minute = 54;
  let homeScore = 1;
  let awayScore = 1;

  setInterval(() => {
    // Fluctuations
    crowdCount += Math.floor(Math.random() * 21) - 10;
    if (crowdCount > 80000) crowdCount = 80000;
    if (crowdCount < 50000) crowdCount = 50000;

    let event = null;
    const rand = Math.random();
    if (rand > 0.97 && minute < 90) {
      if (Math.random() > 0.5) {
        homeScore += 1;
        event = { time: minute, type: 'goal', detail: 'GOAL! USA scores. Dynamic link up play finishes in style!' };
      } else {
        awayScore += 1;
        event = { time: minute, type: 'goal', detail: 'GOAL! Mexico replies. Quick counter attack strikes!' };
      }
    } else if (rand > 0.92 && minute < 90) {
      event = { time: minute, type: 'card', detail: 'Yellow card issued for a sliding tackle.' };
    }

    if (minute < 90 && Math.random() > 0.35) {
      minute += 1;
    }

    // Emit live global telemetry
    io.emit('stadium_tick', {
      crowdCount,
      weather: { temp: 24, condition: 'Clear', wind: '12 km/h' },
      match: {
        homeScore,
        awayScore,
        minute,
        status: minute >= 90 ? 'finished' : 'live',
        possession: {
          home: Math.floor(53 + Math.sin(minute / 5) * 6),
          away: Math.floor(47 - Math.sin(minute / 5) * 6)
        },
        expectedGoals: {
          home: Number((homeScore * 0.85 + Math.random() * 0.25).toFixed(2)),
          away: Number((awayScore * 0.85 + Math.random() * 0.25).toFixed(2)),
        },
        event
      },
      queues: {
        restrooms: [
          { id: 'restroom_1', waitTime: Math.floor(Math.random() * 4) + 1 },
          { id: 'restroom_2', waitTime: Math.floor(Math.random() * 10) + 2 },
          { id: 'restroom_3', waitTime: Math.floor(Math.random() * 3) + 1 },
        ],
        food: [
          { id: 'stall_1', waitTime: Math.floor(Math.random() * 6) + 2 },
          { id: 'stall_2', waitTime: Math.floor(Math.random() * 15) + 3 },
          { id: 'stall_3', waitTime: Math.floor(Math.random() * 5) + 1 },
        ]
      }
    });
  }, 4000);

  return io;
};
export type SocketServer = ReturnType<typeof initSockets>;
