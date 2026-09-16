import { useEffect, useState } from 'react'
import {
  buildAppDefinition,
  DashboardScreen,
  LoginScreen,
  SettingsScreen,
} from './core/examples'
import type { PrototypeConnectionInfo, RenderResult } from './core/figma'
import { FigmaRenderer, generateFigmaPluginCode } from './core/figma'
import type { ValidationReport } from './core/validation'
import { validateFigmaDocument } from './core/validation'

export default function App() {
  const [activeTab, setActiveTab] = useState<'preview' | 'ir' | 'figma' | 'validation' | 'plugin'>('preview')
  const [currentScreen, setCurrentScreen] = useState<'Login' | 'Dashboard' | 'Settings'>('Login')
  const [appDef] = useState(() => buildAppDefinition())
  const [pluginCode] = useState(() => generateFigmaPluginCode(buildAppDefinition()))
  const [renderResult, setRenderResult] = useState<RenderResult | null>(null)
  const [validation, setValidation] = useState<ValidationReport | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Run Figma Renderer and Validator
    const renderer = new FigmaRenderer()
    renderer.renderApp(appDef).then((result) => {
      setRenderResult(result)

      const report = validateFigmaDocument(result, {
        expectedScreens: ['Login Screen', 'Dashboard Screen', 'Settings Screen'],
        expectedComponents: ['Button'],
        expectedConnections: [
          { from: 'ContinueButton', to: 'Dashboard' },
          { from: 'OpenSettingsButton', to: 'Settings' },
        ],
      })
      setValidation(report)
    })
  }, [appDef])

  const handleCopy = () => {
    navigator.clipboard.writeText(pluginCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#07090C] text-[#E2E8F0] flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-[#1E293B] bg-[#0A0D14]/80 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1D9BF0] flex items-center justify-center font-bold text-white shadow-lg shadow-[#1D9BF0]/30 text-sm">
            RF
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-white flex items-center gap-2">
              React-to-Figma Rendering System
              <span className="text-[11px] font-medium bg-[#1D9BF0]/15 text-[#38BDF8] px-2 py-0.5 rounded-full border border-[#1D9BF0]/30">
                Phase 0–10 Active
              </span>
            </h1>
            <p className="text-xs text-[#94A3B8]">
              Decoupled UI Model → Native Figma Auto Layout, Components &amp; Prototype Graph
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-[#111622] p-1 rounded-xl border border-[#1E293B]">
          {[
            { id: 'preview', label: '1. Web Target (React)' },
            { id: 'ir', label: '2. UI Intermediate Rep (IR)' },
            { id: 'figma', label: '3. Figma Nodes & Graph' },
            { id: 'validation', label: '4. Automated Validation' },
            { id: 'plugin', label: '5. Figma Plugin Code' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[#1D9BF0] text-white shadow-sm'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        {/* Tab 1: Web Target (React Preview) */}
        {activeTab === 'preview' && (
          <div className="space-y-6">
            <div className="bg-[#0F1420] border border-[#1E293B] rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-white">Target 1: Web React Runtime</h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  The exact same React primitives (<code className="text-[#38BDF8]">&lt;Frame&gt;</code>, <code className="text-[#38BDF8]">&lt;Stack&gt;</code>, <code className="text-[#38BDF8]">&lt;Button&gt;</code>) render here natively via React DOM.
                </p>
              </div>

              {/* Screen Navigator Pills */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#64748B]">Active Screen:</span>
                {(['Login', 'Dashboard', 'Settings'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setCurrentScreen(s)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      currentScreen === s
                        ? 'bg-[#1E293B] border-[#38BDF8] text-white'
                        : 'border-[#1E293B] text-[#94A3B8] hover:border-[#334155]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Device Mockup Frame */}
            <div className="flex justify-center">
              <div className="w-[414px] bg-[#0A0C0F] rounded-[44px] p-3 shadow-2xl border-4 border-[#1E293B] ring-1 ring-white/10 overflow-hidden">
                <div className="w-full h-full rounded-[34px] overflow-hidden flex justify-center">
                  {currentScreen === 'Login' && (
                    <LoginScreen onNavigate={(dest) => setCurrentScreen(dest as typeof currentScreen)} />
                  )}
                  {currentScreen === 'Dashboard' && (
                    <DashboardScreen onNavigate={(dest) => setCurrentScreen(dest as typeof currentScreen)} />
                  )}
                  {currentScreen === 'Settings' && (
                    <SettingsScreen onNavigate={(dest) => setCurrentScreen(dest as typeof currentScreen)} />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Intermediate Representation (IR) */}
        {activeTab === 'ir' && (
          <div className="space-y-4">
            <div className="bg-[#0F1420] border border-[#1E293B] rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-white">Target-Agnostic UI Representation (AST)</h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Clean tree of <code className="text-[#38BDF8]">UINodeIR</code> (Frames, Auto Layout rules, Text, Styles, Interactions) with zero coupling to React DOM or Figma.
              </p>
            </div>

            <div className="bg-[#0A0D14] border border-[#1E293B] rounded-2xl p-5 overflow-auto max-h-[650px]">
              <pre className="text-xs font-mono text-[#38BDF8] leading-relaxed">
                {JSON.stringify(appDef, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 3: Figma Nodes & Prototype Graph */}
        {activeTab === 'figma' && renderResult && (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#0F1420] border border-[#1E293B] rounded-2xl p-4">
                <span className="text-xs text-[#94A3B8]">Total Native Figma Nodes</span>
                <p className="text-2xl font-bold text-white mt-1">{renderResult.stats.totalNodes}</p>
                <span className="text-[11px] text-[#10B981]">100% Native Editable Layers</span>
              </div>
              <div className="bg-[#0F1420] border border-[#1E293B] rounded-2xl p-4">
                <span className="text-xs text-[#94A3B8]">Generated Screens</span>
                <p className="text-2xl font-bold text-[#38BDF8] mt-1">{renderResult.stats.screensCount}</p>
                <span className="text-[11px] text-[#94A3B8]">Login, Dashboard, Settings</span>
              </div>
              <div className="bg-[#0F1420] border border-[#1E293B] rounded-2xl p-4">
                <span className="text-xs text-[#94A3B8]">Figma Components</span>
                <p className="text-2xl font-bold text-[#A855F7] mt-1">{renderResult.stats.componentsCount}</p>
                <span className="text-[11px] text-[#94A3B8]">Reusable Button Component</span>
              </div>
              <div className="bg-[#0F1420] border border-[#1E293B] rounded-2xl p-4">
                <span className="text-xs text-[#94A3B8]">Prototype Connections</span>
                <p className="text-2xl font-bold text-[#F59E0B] mt-1">{renderResult.stats.connectionsCount}</p>
                <span className="text-[11px] text-[#10B981]">All Destinations Resolved</span>
              </div>
            </div>

            {/* Prototype Connection Graph */}
            <div className="bg-[#0F1420] border border-[#1E293B] rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                Resolved Figma Prototype Connections (Phase 7 &amp; 8)
              </h3>
              <p className="text-xs text-[#94A3B8]">
                These interactions are converted into native Figma <code className="text-[#38BDF8]">Reaction</code> objects linked to destination frame IDs with Smart Animate transitions.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {renderResult.connections.map((conn: PrototypeConnectionInfo, i: number) => (
                  <div
                    key={i}
                    className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-3 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[#E2E8F0] font-semibold">{conn.fromNodeName}</span>
                      <span className="text-[#64748B]">
                        --({conn.trigger}:{conn.action})--&gt;
                      </span>
                    </div>
                    <span className="bg-[#1D9BF0]/15 text-[#38BDF8] px-2 py-0.5 rounded border border-[#1D9BF0]/30 font-sans font-medium">
                      {conn.toScreenName}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Screens Hierarchy Explorer */}
            <div className="bg-[#0F1420] border border-[#1E293B] rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white">Generated Screens &amp; Auto Layout Properties</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from(renderResult.screens.values()).map((screen) => (
                  <div key={screen.id} className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">{screen.name}</h4>
                      <span className="text-[10px] bg-[#1E293B] text-[#94A3B8] px-1.5 py-0.5 rounded">
                        {screen.width} × {screen.height}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#94A3B8] space-y-1 font-mono">
                      <div>Layout Mode: <span className="text-[#38BDF8]">{screen.layoutMode}</span></div>
                      <div>Item Spacing: <span className="text-[#38BDF8]">{screen.itemSpacing}px</span></div>
                      <div>Padding: <span className="text-[#38BDF8]">{screen.paddingTop}px, {screen.paddingLeft}px</span></div>
                      <div>Children: <span className="text-[#38BDF8]">{screen.children.length} direct nodes</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Automated Validation */}
        {activeTab === 'validation' && validation && (
          <div className="space-y-6">
            <div className="bg-[#0F1420] border border-[#1E293B] rounded-2xl p-5 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  Automated Figma Document &amp; Prototype Validator
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      validation.passed
                        ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                        : 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30'
                    }`}
                  >
                    {validation.passed ? 'ALL CHECKS PASSED' : 'VALIDATION FAILED'}
                  </span>
                </h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Verifies node existence, hierarchy integrity, Auto Layout settings, component linkages, and prototype destinations.
                </p>
              </div>
            </div>

            {/* Validation Checks Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Expected Screens Generated', ok: validation.checks.screensExist, desc: 'Login, Dashboard, and Settings screens exist' },
                { title: 'Reusable Components Valid', ok: validation.checks.componentsValid, desc: 'Button is registered as native Figma Component' },
                { title: 'Hierarchy Integrity', ok: validation.checks.hierarchyValid, desc: 'Every instance points to a valid component, layers nested correctly' },
                { title: 'Prototype Destination Resolution', ok: validation.checks.prototypeConnectionsValid, desc: 'All reaction destination IDs resolve to real screens' },
                { title: 'Auto Layout Constraints', ok: validation.checks.autoLayoutValid, desc: 'Padding and spacing non-negative, sizing modes valid' },
              ].map((c, i) => (
                <div key={i} className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs mt-0.5 ${
                      c.ok ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#EF4444]/20 text-[#EF4444]'
                    }`}
                  >
                    {c.ok ? '✓' : '✗'}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">{c.title}</h4>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Warnings / Notices */}
            <div className="bg-[#0F1420] border border-[#1E293B] rounded-2xl p-5">
              <h3 className="text-xs font-semibold text-white mb-2">Unsupported Properties &amp; Warning Notices</h3>
              {validation.warnings.length === 0 ? (
                <p className="text-xs text-[#10B981] flex items-center gap-1.5">
                  <span>✓</span> No unsupported properties or warnings detected. Clean translation!
                </p>
              ) : (
                <div className="space-y-2">
                  {validation.warnings.map((w, idx) => (
                    <div key={idx} className="bg-[#1E1B13] border border-[#F59E0B]/30 text-[#FCD34D] p-3 rounded-lg text-xs font-mono">
                      {w}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 5: Figma Plugin Code */}
        {activeTab === 'plugin' && (
          <div className="space-y-4">
            <div className="bg-[#0F1420] border border-[#1E293B] rounded-2xl p-5 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white">Figma Plugin Executable (code.js)</h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Self-contained script matching Figma Plugin API. Saved in <code className="text-[#38BDF8]">scripts/figma-layout-plugin/code.js</code>.
                </p>
              </div>
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-[#1D9BF0] hover:bg-[#0C8CE9] text-white rounded-xl text-xs font-semibold shadow transition-colors"
              >
                {copied ? 'Copied to Clipboard!' : 'Copy Code'}
              </button>
            </div>

            <div className="bg-[#0A0D14] border border-[#1E293B] rounded-2xl p-4 overflow-auto max-h-[600px]">
              <pre className="text-xs font-mono text-[#E2E8F0] leading-relaxed">
                {pluginCode.slice(0, 3000)}...
              </pre>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
