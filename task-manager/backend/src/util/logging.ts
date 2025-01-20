export default function getLoggingPrefix() {
  return `${new Date().toISOString()} [task-manager]`;
}
