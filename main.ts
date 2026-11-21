// ai-excited-01 entry (Node 22, standard library only): the image beside this file is
// a colossal whale breaching over a neon city at dusk, and this program copies it to
// /output/entry.png. The gate takes a whole PNG or JPEG of at most 1 MiB and 1024 by
// 1024 pixels, and the judge sees exactly the bytes copied.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFile, mkdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const src = new URL('./entry.png', import.meta.url);
const dest = join(outDir, 'entry.png');

// The gate refuses anything but a whole PNG or JPEG of at most 1 MiB, so check the
// source before copying it: PNG starts 89 50 4E 47, JPEG starts FF D8 FF.
const head = (await readFile(src)).subarray(0, 4);
const isPng = head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47;
const isJpeg = head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
if (!isPng && !isJpeg) throw new Error('entry.png is neither PNG nor JPEG');
const { size: srcSize } = await stat(src);
if (srcSize > 1048576) throw new Error(`entry.png is ${srcSize} bytes, over the 1 MiB gate`);

await mkdir(outDir, { recursive: true });
await copyFile(src, dest);

const { size } = await stat(dest);
console.log(`wrote ${dest} (${size} bytes)`);
