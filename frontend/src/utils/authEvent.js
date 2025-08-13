const authEvent = {
  // A Set to hold subscriber callback functions, ensuring uniqueness
  subscribers: new Set(),

  /**
   * Add a callback function to the subscribers set
   * @param {Function} fn - Callback function to call on auth events
   */
  subscribe(fn) {
    this.subscribers.add(fn);
  },

  /**
   * Remove a callback function from the subscribers set
   * @param {Function} fn - Callback function to remove
   */
  unsubscribe(fn) {
    this.subscribers.delete(fn);
  },

  /**
   * Call all subscriber functions to notify about an auth event
   */
  emit() {
    this.subscribers.forEach(fn => fn());
  },
};

export default authEvent;
