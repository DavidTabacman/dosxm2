import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const V4_DIR = resolve(process.cwd(), "src/components/v4");
const SHARED_DIR = resolve(process.cwd(), "src/components/shared");
const PAGES_DIR = resolve(process.cwd(), "src/pages");

export function readV4Css(name: string): string {
  return readFileSync(resolve(V4_DIR, name), "utf8");
}

export function readV4Tsx(name: string): string {
  return readFileSync(resolve(V4_DIR, name), "utf8");
}

export function readSharedFile(name: string): string {
  return readFileSync(resolve(SHARED_DIR, name), "utf8");
}

export function readPageFile(name: string): string {
  return readFileSync(resolve(PAGES_DIR, name), "utf8");
}

export function readProjectFile(relative: string): string {
  return readFileSync(resolve(process.cwd(), relative), "utf8");
}
