/* abstract */ class SessionStore {
  findSession(id) {}
  saveSession(id, session) {}
  findAllSession() {}
}

class InMemorySessionStore extends SessionStore {
  constructor() {
    super();
    this.sessions = new Map();
  }
  findSession(id) {
    return this.sessions.get(id);
  }
  saveSession(id, session) {
    return this.sessions.set(id, session);
  }
  findAllSession() {
    return [...this.sessions.values()];
  }
}

module.exports = {
  InMemorySessionStore,
};
