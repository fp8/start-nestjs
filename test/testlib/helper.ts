import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { IJson } from 'jlog-facade';

const baseUrl = 'test/data';

// assume that baseUrl is test/data
export function getDataPath(input: string): string {
  return path.join(baseUrl, input);
}

export function getTextResource(input: string): string {
  const filePath = getDataPath(input);
  return fs.readFileSync(filePath).toString();
}

export function getJsonResource<T>(input: string): T {
  const text = getTextResource(input);
  return JSON.parse(text);
}

export function getJsonArray(input: string): IJson[] {
  const text = getTextResource(input);
  return JSON.parse(text);
}

export function createHash(): crypto.Hash {
  return crypto.createHash('sha256');
}

export function getHashHexDigest(input: Buffer | string): string {
  const hash = createHash();
  hash.update(input);
  return hash.digest('hex');
}

export function getHashHexDigestOfFile(filename: string): string {
  const buffer = fs.readFileSync(filename);
  return getHashHexDigest(buffer);
}
