import { readFileSync, existsSync } from 'node:fs';

let cachedLogotypeDataUri: string | undefined | null;

export async function loadLogotypeDataUri(): Promise<string | undefined> {
  if (cachedLogotypeDataUri !== undefined) {
    return cachedLogotypeDataUri ?? undefined;
  }

  const logotypeUrl = ERUDIT.config.public.asideMajor?.siteInfo?.logotype;
  if (!logotypeUrl || logotypeUrl === '') {
    cachedLogotypeDataUri = null;
    return undefined;
  }

  if (logotypeUrl.startsWith('http://') || logotypeUrl.startsWith('https://')) {
    try {
      const response = await fetch(logotypeUrl);
      if (response.ok) {
        const contentType =
          response.headers.get('content-type') || 'image/svg+xml';
        const buffer = Buffer.from(await response.arrayBuffer());
        cachedLogotypeDataUri = `data:${contentType};base64,${buffer.toString('base64')}`;
        return cachedLogotypeDataUri;
      }
    } catch {
      // Ignore fetch errors
    }
    cachedLogotypeDataUri = null;
    return undefined;
  }

  // Local path
  const localPath = ERUDIT.paths.project(
    'public',
    logotypeUrl.replace(/^\/+/, ''),
  );
  if (existsSync(localPath)) {
    const buffer = readFileSync(localPath);
    const ext = logotypeUrl.split('.').pop()?.toLowerCase();
    const mime = ext === 'svg' ? 'image/svg+xml' : `image/${ext}`;
    cachedLogotypeDataUri = `data:${mime};base64,${buffer.toString('base64')}`;
    return cachedLogotypeDataUri;
  }

  cachedLogotypeDataUri = null;
  return undefined;
}
