
export const realtime = {
  subscribe: (channel: string, callback: (data: any) => void) => ({ unsubscribe: () => {} }),
  publish: (channel: string, data: any) => {},
};
export function subscribeToChannel(channel: string, callback: (data: any) => void) {
  return { unsubscribe: () => {} };
}
export function publishToChannel(channel: string, data: any) {}
export default realtime;
