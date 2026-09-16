import assert from 'node:assert'
import { buildAppDefinition } from '../src/core/examples/index.ts'
import { FigmaRenderer, generateFigmaPluginCode } from '../src/core/figma/index.ts'
import { validateFigmaDocument } from '../src/core/validation/validator.ts'

console.log('🧪 Starting React-to-Figma End-to-End System Tests...\n')

// 1. Compile App Definition from React screens
console.log('▶ [Phase 1 & 2] Compiling React screens to Intermediate Representation...')
const appDef = buildAppDefinition()
assert.strictEqual(appDef.screens.length, 3, 'Should produce 3 screens')
assert.strictEqual(appDef.components.length, 1, 'Should produce 1 component (Button)')
console.log(`  ✓ Successfully compiled ${appDef.screens.length} screens: ${appDef.screens.map((s) => s.name).join(', ')}`)

// 2. Run Figma Renderer
console.log('▶ [Phase 3, 4, 5, 6, 7, 8] Executing Figma Renderer...')
const renderer = new FigmaRenderer()
const result = await renderer.renderApp(appDef)

assert.strictEqual(result.screens.size, 3, 'Figma renderer should produce 3 screen frames')
assert.strictEqual(result.components.size, 1, 'Figma renderer should register 1 component')
assert.ok(result.connections.length >= 3, 'Figma renderer should resolve prototype connections')

console.log(`  ✓ Rendered ${result.stats.totalNodes} total Figma nodes`)
console.log(`  ✓ Registered ${result.components.size} reusable Figma Component`)
console.log(`  ✓ Resolved ${result.connections.length} prototype connections:`)
for (const conn of result.connections) {
  console.log(`     - [${conn.fromNodeName}] --(${conn.trigger}:${conn.action})--> [${conn.toScreenName}]`)
}

// 3. Validation Suite (Phase 9)
console.log('▶ [Phase 9] Running Automated Document & Prototype Validation...')
const report = validateFigmaDocument(result, {
  expectedScreens: ['Login Screen', 'Dashboard Screen', 'Settings Screen'],
  expectedComponents: ['Button'],
  expectedConnections: [
    { from: 'ContinueButton', to: 'Dashboard' },
    { from: 'OpenSettingsButton', to: 'Settings' },
  ],
})

console.log('  Validation Report Summary:')
console.log(`  - Passed: ${report.passed}`)
console.log(`  - Screens Exist: ${report.checks.screensExist}`)
console.log(`  - Components Valid: ${report.checks.componentsValid}`)
console.log(`  - Hierarchy Valid: ${report.checks.hierarchyValid}`)
console.log(`  - Prototype Connections Valid: ${report.checks.prototypeConnectionsValid}`)
console.log(`  - Auto Layout Valid: ${report.checks.autoLayoutValid}`)
console.log(`  - Errors: ${report.errors.length}`)
console.log(`  - Warnings: ${report.warnings.length}`)

assert.strictEqual(report.passed, true, `Validation should pass with 0 errors. Errors: ${report.errors.join('; ')}`)
assert.strictEqual(report.checks.screensExist, true)
assert.strictEqual(report.checks.componentsValid, true)
assert.strictEqual(report.checks.prototypeConnectionsValid, true)
assert.strictEqual(report.checks.autoLayoutValid, true)

// 4. Generate Figma Plugin Code (Phase 10)
console.log('▶ [Phase 10] Generating Figma Plugin Script...')
const pluginCode = generateFigmaPluginCode(appDef)
assert.ok(pluginCode.length > 500, 'Plugin code should be generated')
assert.ok(pluginCode.includes('figma.createPage'), 'Should call figma.createPage')
assert.ok(pluginCode.includes('figma.createComponent'), 'Should call figma.createComponent')
assert.ok(pluginCode.includes('item.node.reactions ='), 'Should configure reactions')
console.log(`  ✓ Generated Figma plugin script (${(pluginCode.length / 1024).toFixed(1)} KB)`)

console.log('\n🎉 ALL TESTS PASSED! React-to-Figma rendering pipeline verified successfully.\n')
