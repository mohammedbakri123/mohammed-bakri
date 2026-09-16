import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { buildAppDefinition } from '../src/core/examples/index.ts'
import { generateFigmaPluginCode } from '../src/core/figma/index.ts'

const appDef = buildAppDefinition()
const code = generateFigmaPluginCode(appDef)
const targetPath = resolve(process.cwd(), 'scripts/figma-layout-plugin/code.js')

writeFileSync(targetPath, code, 'utf8')
console.log(`✓ Successfully updated Figma plugin: scripts/figma-layout-plugin/code.js (${(code.length / 1024).toFixed(1)} KB)`)
