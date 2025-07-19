export function isHttpUrl(
  url: string
): url is `http://${string}` | `https://${string}` {
  return url.startsWith('http://') || url.startsWith('https://');
}
