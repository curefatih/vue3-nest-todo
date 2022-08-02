export function errorMessage(message) {
  return Array.isArray(message) ? message.join(", ") : message;
}
