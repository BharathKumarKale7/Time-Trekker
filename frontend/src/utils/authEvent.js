// Simple event emitter for auth changes
const authEvent = {
  subscribers: [],
  subscribe(fn) {
    this.subscribers.push(fn);
  },
  unsubscribe(fn) {
    this.subscribers = this.subscribers.filter(sub => sub !== fn);
  },
  emit() {
    this.subscribers.forEach(fn => fn());
  },
};

export default authEvent;
