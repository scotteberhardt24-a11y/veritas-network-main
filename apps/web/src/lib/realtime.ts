export const realtime = {
  connect: () => {},
  disconnect: () => {},
  subscribe: (channel: string, callback: (data: any) => void) => ({ unsubscribe: () => {} }),
  publish: (channel: string, data: any) => {},
  on: (event: string, callback: (data: any) => void) => {},
  off: (event: string) => {},
};
export function subscribeToChannel(channel: string, callback: (data: any) => void) {
  return { unsubscribe: () => {} };
}
export function publishToChannel(channel: string, data: any) {}
export default realtime;
