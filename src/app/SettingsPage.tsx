import * as React from 'react';
import { useState } from 'react';
import { User, Bell, Shield, Globe, CreditCard, LogOut, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast('Settings updated successfully!', 'success');
    }, 1000);
  };

  const tabs = [
    { icon: User, label: 'Profile' },
    { icon: Bell, label: 'Notifications' },
    { icon: Shield, label: 'Security' },
    { icon: Globe, label: 'Agency Profile' },
    { icon: CreditCard, label: 'Billing' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text">Settings</h1>
        <p className="text-text-muted">Manage your account preferences and agency settings.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-64 space-y-2">
          {tabs.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.label ? 'bg-primary/10 text-primary' : 'text-text-muted hover:text-text hover:bg-primary/5'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
          <div className="pt-4 mt-4 border-t border-border">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all">
              <LogOut size={18} />
              Log Out
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-8">
          {activeTab === 'Profile' && (
            <div className="bg-card border border-border p-8 rounded-3xl space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-3xl bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-primary text-4xl font-black">
                  AR
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text">Alex Rivera</h3>
                  <p className="text-sm text-text-muted mb-4">alex@bms-agency.com</p>
                  <div className="flex gap-3">
                    <Button size="sm">Change Avatar</Button>
                    <Button variant="outline" size="sm">Remove</Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="First Name" defaultValue="Alex" />
                <Input label="Last Name" defaultValue="Rivera" />
                <Input label="Email Address" defaultValue="alex@bms-agency.com" />
                <Input label="Phone Number" defaultValue="+1 (555) 000-0000" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Bio</label>
                <textarea 
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-text-muted outline-none focus:border-primary/50 min-h-[120px] resize-none"
                  defaultValue="Creative Director at BMS Engage Agency. Focused on building premium digital experiences."
                />
              </div>

              <div className="pt-4 flex justify-end gap-4">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSave} isLoading={isSaving}>Save Changes</Button>
              </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="bg-card border border-border p-8 rounded-3xl space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-xl font-bold text-text">Email Notifications</h3>
              <div className="space-y-4">
                {[
                  { label: 'Post Published', desc: 'Receive an email when a scheduled post is successfully published.' },
                  { label: 'Weekly Analytics', desc: 'Get a summary of your performance metrics every Monday.' },
                  { label: 'Account Security', desc: 'Alerts about new logins and security changes.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b border-border last:border-0">
                    <div className="max-w-md">
                      <p className="font-bold text-text">{item.label}</p>
                      <p className="text-xs text-text-muted mt-1">{item.desc}</p>
                    </div>
                    <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 flex justify-end">
                <Button onClick={handleSave} isLoading={isSaving}>Save Preferences</Button>
              </div>
            </div>
          )}

          {activeTab === 'Security' && (
            <div className="bg-card border border-border p-8 rounded-3xl space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-xl font-bold text-text">Security Settings</h3>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-text-muted">Change Password</h4>
                  <Input label="Current Password" type="password" placeholder="••••••••" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <Input label="New Password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" />
                      <button 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-[34px] text-text-muted hover:text-text transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <Input label="Confirm New Password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" />
                  </div>
                </div>

                <div className="pt-6 border-t border-border space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-text-muted">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between p-4 bg-background border border-border rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                        <Shield size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-text">Authenticator App</p>
                        <p className="text-xs text-text-muted">Use an app like Google Authenticator or 1Password.</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button onClick={handleSave} isLoading={isSaving}>Update Security</Button>
              </div>
            </div>
          )}

          {(activeTab === 'Agency Profile' || activeTab === 'Billing') && (
            <div className="bg-card border border-border p-12 rounded-3xl text-center space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
                <Globe size={32} />
              </div>
              <h3 className="text-xl font-bold text-text">{activeTab} coming soon</h3>
              <p className="text-sm text-text-muted max-w-xs mx-auto">We're working hard to bring you more management features. Stay tuned!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
