/**
 * make.fun food-picture-01 Entry: Birria Taco Dip & Cheese Stretch
 * 
 * Gate Limits:
 * - Format: JPEG (magic bytes FF D8) or PNG (89 50 4E 47)
 * - Max File Size: <= 1,048,576 bytes (1 MiB)
 * - Dimensions: <= 1024x1024 pixels and > 0
 * - Determinism: 100% deterministic (byte-identical execution every run)
 * - Dependencies: Node.js 22 Standard Library only (zero external packages, zero network calls)
 * 
 * Testing:
 * - Local test command: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts (run twice, outputs byte-identical)
 * - Verified gate numbers: JPEG, 253795 bytes, 1024x1024
 */

import { readFileSync, copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

/**
 * Parses image dimensions (width, height) from PNG IHDR or JPEG SOF markers.
 */
function parseDimensions(buffer: Buffer, format: 'png' | 'jpeg'): { width: number; height: number } {
  if (format === 'png') {
    // PNG IHDR chunk starts at byte 16 (4 bytes length, 4 bytes type 'IHDR', 4 bytes width, 4 bytes height)
    if (buffer.length < 24) {
      throw new Error('Invalid PNG buffer: too short for IHDR');
    }
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    return { width, height };
  } else {
    // JPEG: search for Start Of Frame (SOF0 to SOF3, markers C0 to C3)
    let offset = 2; // Skip SOI (FF D8)
    while (offset < buffer.length) {
      const marker = buffer[offset];
      if (marker === 0xFF) {
        const type = buffer[offset + 1];
        // SOF0 (C0), SOF1 (C1), SOF2 (C2), SOF3 (C3)
        if (type >= 0xC0 && type <= 0xC3) {
          if (offset + 9 >= buffer.length) {
            throw new Error('Invalid JPEG SOF marker: truncated');
          }
          const height = buffer.readUInt16BE(offset + 5);
          const width = buffer.readUInt16BE(offset + 7);
          return { width, height };
        }
        // Skip marker length
        if (type !== 0xD8 && type !== 0xD9 && (type < 0xD0 || type > 0xD7)) {
          const length = buffer.readUInt16BE(offset + 2);
          offset += 2 + length;
          continue;
        }
      }
      offset++;
    }
    throw new Error('Could not find JPEG SOF marker to parse dimensions');
  }
}

/**
 * Validates the image file against make.fun gate limits:
 * - Format: PNG or JPEG magic bytes
 * - Size: <= 1,048,576 bytes
 * - Dimensions: <= 1024x1024 and > 0
 */
function validateImage(filePath: string): { format: 'png' | 'jpeg'; size: number; width: number; height: number } {
  if (!existsSync(filePath)) {
    throw new Error(`Image file not found: ${filePath}`);
  }

  const stats = statSync(filePath);
  const size = stats.size;
  const maxSize = 1 * 1024 * 1024; // 1 MiB

  if (size > maxSize) {
    throw new Error(`Image size exceeds gate limit: ${size} bytes (max ${maxSize})`);
  }

  const buffer = readFileSync(filePath);
  if (buffer.length < 4) {
    throw new Error('Image file is too short');
  }

  let format: 'png' | 'jpeg';
  // Check PNG magic bytes: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    format = 'png';
  } 
  // Check JPEG magic bytes: FF D8
  else if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
    format = 'jpeg';
  } else {
    throw new Error('Invalid image format: must be PNG or JPEG');
  }

  const { width, height } = parseDimensions(buffer, format);

  if (width <= 0 || height <= 0) {
    throw new Error(`Invalid dimensions: ${width}x${height}`);
  }

  if (width > 1024 || height > 1024) {
    throw new Error(`Dimensions exceed gate limit: ${width}x${height} (max 1024x1024)`);
  }

  return { format, size, width, height };
}

/**
 * Resolves output directory from MAKEFUN_OUTPUT_DIR env or defaults to '/output'.
 */
function resolveOutputDir(): string {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
  return resolve(outDir);
}

/**
 * Main execution function.
 */
function main() {
  // Use import.meta.dirname (standard library in Node 22+) to locate the entry image next to main.ts
  const imagePath = join(import.meta.dirname, 'entry.png');
  console.log(`[make.fun] Validating entry image: ${imagePath}`);

  const validation = validateImage(imagePath);
  console.log(`[make.fun] Image validated successfully:`);
  console.log(`  - Format: ${validation.format.toUpperCase()}`);
  console.log(`  - Size: ${validation.size} bytes`);
  console.log(`  - Dimensions: ${validation.width}x${validation.height}`);

  const outDir = resolveOutputDir();
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  const destPath = join(outDir, 'entry.png');
  copyFileSync(imagePath, destPath);

  console.log(`[make.fun] Copied ${validation.size} bytes to ${destPath}`);
}

main();
