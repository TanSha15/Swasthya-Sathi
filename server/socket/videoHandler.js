// server/socket/videoHandler.js

export default function initializeVideoSocket(io) {
  io.on('connection', (socket) => {
      console.log('User connected to WebRTC socket:', socket.id);

      socket.on('join-room', (roomId, userId) => {
          socket.join(roomId);
          console.log(`User ${userId} (Socket: ${socket.id}) joined room ${roomId}`);
          
          // Let everyone else in the room know someone joined
          socket.to(roomId).emit('user-connected', userId);

          // Relay Offer from Caller to Callee
          socket.on('offer', (offer, toUserId) => {
              socket.to(roomId).emit('offer', offer, socket.id);
          });

          // Relay Answer from Callee to Caller
          socket.on('answer', (answer, toUserId) => {
              socket.to(roomId).emit('answer', answer, socket.id);
          });

          // Relay ICE Candidates
          socket.on('ice-candidate', (candidate) => {
              socket.to(roomId).emit('ice-candidate', candidate, socket.id);
          });

          // Disconnection
          socket.on('disconnect', () => {
              socket.to(roomId).emit('user-disconnected', userId);
              console.log(`User ${userId} disconnected from room ${roomId}`);
          });
      });
  });
}
