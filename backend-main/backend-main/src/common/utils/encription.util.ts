import { createHash } from 'crypto';

export async function encrypt(input: string): Promise<string> {
  return createHash('md5').update(input).digest('hex');
}
