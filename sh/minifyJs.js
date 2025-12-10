#!/usr/bin/env bun

import minifyJs from "@3-/minifyjs"
import { walkRel } from "@3-/walk"
import { dirname, join } from "node:path"
import { writeFileSync } from "node:fs"
import read from "@3-/read"

const ROOT = dirname(import.meta.dirname),
	DIST = join(ROOT, "dist")

const minify = async (fp) => {
	fp = join(DIST, fp)
	try {
		const { code, map } = await minifyJs(read(fp), fp)
		writeFileSync(fp, code)
		writeFileSync(fp + ".map", map)
	} catch (e) {
		console.error(fp)
		throw e
	}
}

for (const mod of ["com", "dom", "lib"]) {
	const dir = join(DIST, mod)

	for await (const i of walkRel(dir)) {
		if (i.endsWith(".js")) {
			await minify(mod + "/" + i)
		}
	}
}
await minify("srv.js")

process.exit()
