export function convertIpfsUrl(ipfsUrl: string): string {
  if (ipfsUrl.startsWith("ipfs://")) {
    return ipfsUrl.replace("ipfs://", "https://482b934d10599d46f13e52972ea433e8.ipfscdn.io/ipfs/");
  }
  return ipfsUrl;
}

export function calculateDaysLeft(endTimestamp: number): number {
    const now = Math.floor(Date.now() / 1000); // 轉換為秒
    const diffInSeconds = endTimestamp - now;
    return Math.max(0, Math.floor(diffInSeconds / (60 * 60 * 24))); // 轉換為天數
  }