
export function subscribeToChannel(channel: string, callback: (data: any) => void) {
  return { unsubscribe: () => {} };
}
export function publishToChannel(channel: string, data: any) {}
export default { subscribeToChannel, publishToChannel };
