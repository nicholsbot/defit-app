'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Settings,
  Database,
  Key,
  Bell,
  Shield,
  Palette,
  Globe,
  Save,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';

export default function SettingsPage() {
  const [showSecrets, setShowSecrets] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <Settings className="w-7 h-7 text-slate-400" />
            Settings
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Configure SuperClaw behavior and integrations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition-colors">
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button 
            onClick={handleSave}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              saved 
                ? 'bg-green-600 text-white' 
                : 'bg-orange-600 hover:bg-orange-500 text-white'
            )}
          >
            {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Database Connection */}
        <SettingsSection
          icon={Database}
          title="Database Connection"
          description="Neon Postgres configuration"
        >
          <div className="space-y-4">
            <SettingsField label="Connection String" hint="POSTGRES_URL environment variable">
              <div className="flex gap-2">
                <input
                  type={showSecrets ? 'text' : 'password'}
                  value="postgresql://neondb_owner:***@ep-wandering-hall-ait7jmnu-pooler.c-4.us-east-1.aws.neon.tech/neondb"
                  readOnly
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono"
                />
                <button 
                  onClick={() => setShowSecrets(!showSecrets)}
                  className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </SettingsField>
            <div className="flex items-center gap-2 text-xs text-green-400">
              <CheckCircle className="w-3.5 h-3.5" />
              Connected to Neon Postgres
            </div>
          </div>
        </SettingsSection>

        {/* API Keys */}
        <SettingsSection
          icon={Key}
          title="API Keys"
          description="External service credentials"
        >
          <div className="space-y-4">
            <SettingsField label="Neon API Key" hint="For ephemeral database creation">
              <input
                type="password"
                value="napi_***************************"
                readOnly
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono"
              />
            </SettingsField>
            <SettingsField label="Vercel Token" hint="Deployment and hosting">
              <input
                type="password"
                value="AnXAW***********************"
                readOnly
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono"
              />
            </SettingsField>
          </div>
        </SettingsSection>

        {/* Swarm Configuration */}
        <SettingsSection
          icon={Globe}
          title="Swarm Configuration"
          description="Agent orchestration settings"
        >
          <div className="grid grid-cols-2 gap-4">
            <SettingsField label="Max Concurrent Agents">
              <input
                type="number"
                defaultValue={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm"
              />
            </SettingsField>
            <SettingsField label="Task Timeout (seconds)">
              <input
                type="number"
                defaultValue={300}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm"
              />
            </SettingsField>
            <SettingsField label="Default Model">
              <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm">
                <option>claude-sonnet-4-20250514</option>
                <option>claude-opus-4-20250514</option>
                <option>gpt-4o</option>
                <option>dolphin-llama3:8b (local)</option>
              </select>
            </SettingsField>
            <SettingsField label="Retry Attempts">
              <input
                type="number"
                defaultValue={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm"
              />
            </SettingsField>
          </div>
        </SettingsSection>

        {/* SONA Settings */}
        <SettingsSection
          icon={Shield}
          title="SONA Configuration"
          description="Self-optimization parameters"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
              <div>
                <div className="text-sm font-medium">Auto-optimization</div>
                <div className="text-xs text-slate-500">Automatically tune skills based on feedback</div>
              </div>
              <ToggleSwitch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
              <div>
                <div className="text-sm font-medium">Feedback logging</div>
                <div className="text-xs text-slate-500">Log all approval/rejection decisions</div>
              </div>
              <ToggleSwitch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
              <div>
                <div className="text-sm font-medium">A/B testing</div>
                <div className="text-xs text-slate-500">Test skill variations automatically</div>
              </div>
              <ToggleSwitch />
            </div>
            <SettingsField label="Learning Rate">
              <input
                type="range"
                min="0"
                max="100"
                defaultValue={50}
                className="w-full"
              />
            </SettingsField>
          </div>
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection
          icon={Bell}
          title="Notifications"
          description="Alert preferences"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
              <div>
                <div className="text-sm font-medium">Pending approvals</div>
                <div className="text-xs text-slate-500">Notify when items need review</div>
              </div>
              <ToggleSwitch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
              <div>
                <div className="text-sm font-medium">Swarm errors</div>
                <div className="text-xs text-slate-500">Alert on agent failures</div>
              </div>
              <ToggleSwitch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
              <div>
                <div className="text-sm font-medium">Daily digest</div>
                <div className="text-xs text-slate-500">Summary of activity</div>
              </div>
              <ToggleSwitch />
            </div>
          </div>
        </SettingsSection>
      </div>

      {/* Danger Zone */}
      <div className="border border-red-900/50 rounded-xl p-4 bg-red-950/10">
        <h3 className="text-sm font-semibold text-red-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Danger Zone
        </h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          Irreversible actions. Proceed with caution.
        </p>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
            Clear Queue
          </button>
          <button className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
            Reset SONA
          </button>
          <button className="px-4 py-2 text-sm bg-red-900/50 hover:bg-red-900 text-red-300 rounded-lg transition-colors">
            Delete All Data
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsSection({ icon: Icon, title, description, children }: { 
  icon: any; 
  title: string; 
  description: string; 
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800/50 bg-slate-900/30">
        <div className="p-2 rounded-lg bg-slate-800">
          <Icon className="w-4 h-4 text-slate-400" />
        </div>
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}

function SettingsField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">
        {label}
        {hint && <span className="text-slate-600 font-normal ml-2">({hint})</span>}
      </label>
      {children}
    </div>
  );
}

function ToggleSwitch({ defaultChecked }: { defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked || false);
  
  return (
    <button
      onClick={() => setChecked(!checked)}
      className={cn(
        'relative w-10 h-5 rounded-full transition-colors',
        checked ? 'bg-orange-500' : 'bg-slate-700'
      )}
    >
      <span className={cn(
        'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform',
        checked && 'translate-x-5'
      )} />
    </button>
  );
}
