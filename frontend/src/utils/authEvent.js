const authEvent = {
  subscribers: new Set(),
  subscribe(fn) { this.subscribers.add(fn); },
  unsubscribe(fn) { this.subscribers.delete(fn); },
  emit() { this.subscribers.forEach(fn => fn()); },
};
export default authEvent;
