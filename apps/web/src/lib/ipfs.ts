
export function resolveIPFS(cid: string): string {
  if (!cid) return "";
  if (cid.startsWith("http")) return cid;
  return `https://ipfs.io/ipfs/${cid}`;
}
export async function uploadToIPFS(data: any): Promise<string> { return ""; }
export async function getFromIPFS(cid: string): Promise<any> { return null; }
export default { resolveIPFS, uploadToIPFS, getFromIPFS };
