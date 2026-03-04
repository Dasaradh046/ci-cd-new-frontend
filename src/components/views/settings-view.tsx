/**
 * Settings View Component
 * Enterprise SaaS Design - Clean, Minimal, Professional
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Loader2, Moon, Sun, Monitor, Bell, Lock, Globe, Shield, Smartphone, Download, Trash2, LogOut, Clock, CheckCircle, Key, Languages, Eye, EyeOff, History, Zap, Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAuthStore } from '@/lib/stores';
import { MockDataBadge } from '@/components/shared';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const passwordSchema = z.object({
  current: z.string().min(6),
  new: z.string().min(8).regex(/[A-Z]/, 'Must contain uppercase').regex(/[a-z]/, 'Must contain lowercase').regex(/[0-9]/, 'Must contain number'),
  confirm: z.string(),
}).refine(d => d.new === d.confirm, { message: 'Passwords do not match', path: ['confirm'] });

type PasswordForm = z.infer<typeof passwordSchema>;

const SESSIONS = [
  { id: '1', device: 'Chrome', os: 'MacOS', location: 'San Francisco, CA', lastActive: new Date().toISOString(), isCurrent: true, icon: '🌐' },
  { id: '2', device: 'Safari', os: 'iOS', location: 'San Francisco, CA', lastActive: new Date(Date.now() - 86400000).toISOString(), isCurrent: false, icon: '📱' },
  { id: '3', device: 'Firefox', os: 'Windows', location: 'New York, NY', lastActive: new Date(Date.now() - 432000000).toISOString(), isCurrent: false, icon: '🧭' },
];

const SECURITY_LOG = [
  { id: '1', event: 'Password changed', time: '3 days ago', status: 'success' },
  { id: '2', event: 'New login from MacOS', time: '5 days ago', status: 'info' },
  { id: '3', event: 'Failed login attempt', time: '3 weeks ago', status: 'warning' },
];

export function SettingsView() {
  const { toast } = useToast();
  const user = useAuthStore(s => s.user);
  const isMock = useAuthStore(s => s.isMockData);
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, push: true, sms: false, security: true });
  const [privacy, setPrivacy] = useState({ profileVisible: true, showEmail: false, showActivity: true });
  const [theme, setTheme] = useState('dark');

  const form = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema), defaultValues: { current: '', new: '', confirm: '' } });
  const { register, handleSubmit, formState: { errors }, reset } = form;

  const onPasswordSubmit = async (data: PasswordForm) => { setIsLoading(true); await new Promise(r => setTimeout(r, 1000)); setIsLoading(false); reset(); toast({ title: 'Password updated' }); };
  const handleExport = async () => { setIsLoading(true); await new Promise(r => setTimeout(r, 2000)); setIsLoading(false); toast({ title: 'Export ready' }); };
  const handleDelete = async () => { setIsLoading(true); await new Promise(r => setTimeout(r, 1000)); setIsLoading(false); };
  const handleRevoke = (id: string) => toast({ title: 'Session revoked' });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-semibold tracking-tight">Settings</h1><p className="text-muted-foreground mt-1">Manage your account settings and preferences</p></div>
        {isMock && <MockDataBadge isMock={isMock} />}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full max-w-lg">
          <TabsTrigger value="account" className="gap-2"><Globe className="h-4 w-4" /><span className="hidden sm:inline">Account</span></TabsTrigger>
          <TabsTrigger value="security" className="gap-2"><Lock className="h-4 w-4" /><span className="hidden sm:inline">Security</span></TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2"><Bell className="h-4 w-4" /><span className="hidden sm:inline">Notifications</span></TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2"><Shield className="h-4 w-4" /><span className="hidden sm:inline">Privacy</span></TabsTrigger>
        </TabsList>

        {/* Account */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader className="pb-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-muted"><Sun className="h-5 w-5 text-muted-foreground" /></div><div><CardTitle className="text-base">Appearance</CardTitle><CardDescription>Customize how the app looks</CardDescription></div></div></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">{[{ value: 'light', icon: Sun, label: 'Light' }, { value: 'dark', icon: Moon, label: 'Dark' }, { value: 'system', icon: Monitor, label: 'System' }].map(opt => <button key={opt.value} onClick={() => setTheme(opt.value)} className={cn('flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all', theme === opt.value ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/50 text-muted-foreground')}><opt.icon className="h-4 w-4" /><span className="text-sm font-medium">{opt.label}</span></button>)}</div>
              <Separator />
              <div className="flex items-center justify-between"><div className="flex items-center gap-3"><Languages className="h-5 w-5 text-muted-foreground" /><div><Label>Language</Label><p className="text-xs text-muted-foreground">Select your preferred language</p></div></div><Select defaultValue="en"><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="es">Spanish</SelectItem><SelectItem value="fr">French</SelectItem></SelectContent></Select></div>
              <Separator />
              <div className="flex items-center justify-between"><div className="flex items-center gap-3"><Clock className="h-5 w-5 text-muted-foreground" /><div><Label>Timezone</Label><p className="text-xs text-muted-foreground">Set your local timezone</p></div></div><Select defaultValue="pst"><SelectTrigger className="w-48"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="pst">Pacific Time</SelectItem><SelectItem value="mst">Mountain Time</SelectItem><SelectItem value="cst">Central Time</SelectItem><SelectItem value="est">Eastern Time</SelectItem></SelectContent></Select></div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader className="pb-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-muted"><Key className="h-5 w-5 text-muted-foreground" /></div><div><CardTitle className="text-base">Change Password</CardTitle><CardDescription>Update your password regularly</CardDescription></div></div></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4">
                <div className="space-y-1.5"><Label>Current Password</Label><div className="relative"><Input type={showCurrent ? 'text' : 'password'} {...register('current')} className="pr-10" /><Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowCurrent(!showCurrent)}>{showCurrent ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}</Button></div>{errors.current && <p className="text-xs text-destructive">{errors.current.message}</p>}</div>
                <div className="space-y-1.5"><Label>New Password</Label><div className="relative"><Input type={showNew ? 'text' : 'password'} {...register('new')} className="pr-10" /><Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowNew(!showNew)}>{showNew ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}</Button></div>{errors.new && <p className="text-xs text-destructive">{errors.new.message}</p>}</div>
                <div className="space-y-1.5"><Label>Confirm Password</Label><div className="relative"><Input type={showConfirm ? 'text' : 'password'} {...register('confirm')} className="pr-10" /><Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowConfirm(!showConfirm)}>{showConfirm ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}</Button></div>{errors.confirm && <p className="text-xs text-destructive">{errors.confirm.message}</p>}</div>
                <Button type="submit" disabled={isLoading}>{isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Updating...</> : <><Save className="mr-2 h-4 w-4" />Update Password</>}</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-muted"><Smartphone className="h-5 w-5 text-muted-foreground" /></div><div><CardTitle className="text-base">Active Sessions</CardTitle><CardDescription>Manage your logged-in devices</CardDescription></div></div></CardHeader>
            <CardContent className="space-y-3">
              {SESSIONS.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center text-lg">{s.icon}</div><div><div className="flex items-center gap-2"><span className="font-medium text-sm">{s.device}</span><span className="text-muted-foreground text-xs">• {s.os}</span>{s.isCurrent && <Badge variant="outline" className="text-xs text-success border-success/30">Current</Badge>}</div><p className="text-xs text-muted-foreground">{s.location} • {new Date(s.lastActive).toLocaleDateString()}</p></div></div>
                  {!s.isCurrent && <Button variant="outline" size="sm" onClick={() => handleRevoke(s.id)}><LogOut className="h-4 w-4 mr-2" />Revoke</Button>}
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2"><LogOut className="h-4 w-4 mr-2" />Sign out all other sessions</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-muted"><History className="h-5 w-5 text-muted-foreground" /></div><div><CardTitle className="text-base">Security Activity</CardTitle><CardDescription>Recent security events</CardDescription></div></div></CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="max-h-48">
                <div className="divide-y">{SECURITY_LOG.map(log => <div key={log.id} className="flex items-center gap-3 p-3"><div className={cn('h-2 w-2 rounded-full', log.status === 'success' && 'bg-success', log.status === 'warning' && 'bg-warning', log.status === 'info' && 'bg-info')} /><div><p className="text-sm">{log.event}</p><p className="text-xs text-muted-foreground">{log.time}</p></div></div>)}</div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader className="pb-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-muted"><Bell className="h-5 w-5 text-muted-foreground" /></div><div><CardTitle className="text-base">Notification Preferences</CardTitle><CardDescription>Choose how you want to be notified</CardDescription></div></div></CardHeader>
            <CardContent className="space-y-1">
              {[{ key: 'email', icon: Mail, label: 'Email Notifications', desc: 'Receive notifications via email' }, { key: 'push', icon: Bell, label: 'Push Notifications', desc: 'Browser push notifications' }, { key: 'sms', icon: MessageSquare, label: 'SMS Notifications', desc: 'Receive notifications via SMS' }, { key: 'security', icon: Shield, label: 'Security Alerts', desc: 'Get notified about security events' }].map(item => (
                <div key={item.key} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3"><item.icon className="h-5 w-5 text-muted-foreground" /><div><Label>{item.label}</Label><p className="text-xs text-muted-foreground">{item.desc}</p></div></div>
                  <Switch checked={notifications[item.key as keyof typeof notifications]} onCheckedChange={c => setNotifications({ ...notifications, [item.key]: c })} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader className="pb-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-muted"><Shield className="h-5 w-5 text-muted-foreground" /></div><div><CardTitle className="text-base">Privacy Settings</CardTitle><CardDescription>Control your data visibility</CardDescription></div></div></CardHeader>
            <CardContent className="space-y-1">
              {[{ key: 'profileVisible', label: 'Profile Visibility', desc: 'Make your profile visible to others' }, { key: 'showEmail', label: 'Show Email', desc: 'Display your email on your profile' }, { key: 'showActivity', label: 'Activity Status', desc: 'Display your online status' }].map(item => (
                <div key={item.key} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div><Label>{item.label}</Label><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                  <Switch checked={privacy[item.key as keyof typeof privacy]} onCheckedChange={c => setPrivacy({ ...privacy, [item.key]: c })} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-muted"><Download className="h-5 w-5 text-muted-foreground" /></div><div><CardTitle className="text-base">Data Export</CardTitle><CardDescription>Download a copy of your personal data</CardDescription></div></div></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Request a copy of all your personal data stored in our system.</p>
              <Button onClick={handleExport} disabled={isLoading}>{isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Preparing...</> : <><Download className="mr-2 h-4 w-4" />Export My Data</>}</Button>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader className="pb-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-destructive/10"><Trash2 className="h-5 w-5 text-destructive" /></div><div><CardTitle className="text-base text-destructive">Delete Account</CardTitle><CardDescription>Permanently delete your account and data</CardDescription></div></div></CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20"><p className="text-sm text-muted-foreground">This action is irreversible. All your data will be permanently deleted.</p></div>
              <AlertDialog>
                <AlertDialogTrigger asChild><Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" />Delete My Account</Button></AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete your account and remove all your data.</AlertDialogDescription></AlertDialogHeader>
                  <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDelete}>Delete Account</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
