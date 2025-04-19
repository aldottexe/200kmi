  export function parseSiteName(r: string): string {
    const match = r.match(/(?<=https?:\/\/)[^/]+/);
    return match ? match[0] : "";
  }
