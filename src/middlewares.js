export const isAuthenticated = (request) => {
  if (!request.user) {
    console.error("middleware.js : isAuthenticated : 리퀘스트 유저 없어.");
  }
  return;
};
