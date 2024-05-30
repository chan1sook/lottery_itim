export function toTimestampSec(date: Date) {
  return Math.floor(date.getTime() / 1000);
}
