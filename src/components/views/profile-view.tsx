/**
 * Profile View Component
 * Enterprise SaaS Design - Clean, Minimal, Professional
 */

'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, Save, Loader2, Mail, Calendar, Shield, Clock, MapPin, Link as LinkIcon, Twitter, Github, Linkedin, Edit3, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuthStore } from '@/lib/stores';
import { ProfileSkeleton, MockDataBadge } from '@/components/shared';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().optional().or(z.literal('')),
  twitter: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

const ACTIVITY = [
  { id: '1', action: 'Updated profile picture', time: '2 hours ago', icon: Camera },
  { id: '2', action: 'Changed password', time: '3 days ago', icon: Shield },
  { id: '3', action: 'Logged in from new device', time: '5 days ago', icon: Clock },
  { id: '4', action: 'Uploaded 3 files', time: '1 week ago', icon: MapPin },
];

export function ProfileView() {
  const { toast } = useToast();
  const user = useAuthStore(s => s.user);
  const isMock = useAuthStore(s => s.isMockData);
  const fileRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '', email: user?.email || '', bio: '', location: 'San Francisco, CA', website: '', twitter: '', github: '', linkedin: '' },
  });
  const { register, handleSubmit, formState: { errors }, watch, reset } = form;

  const onSubmit = async (data: ProfileForm) => { setIsLoading(true); await new Promise(r => setTimeout(r, 1000)); setIsLoading(false); setIsEditing(false); toast({ title: 'Profile updated' }); };
  const handleAvatarChange = () => fileRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files?.[0]) toast({ title: 'Avatar uploaded' }); };
  const handleCancel = () => { reset(); setIsEditing(false); };

  if (!user) return <ProfileSkeleton />;
  const completion = [user.name, user.email, user.avatar].filter(Boolean).length / 3 * 100;
  const bioLen = (watch('bio') || '').length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-semibold tracking-tight">Profile</h1><p className="text-muted-foreground mt-1">Manage your account information</p></div>
        {isMock && <MockDataBadge isMock={isMock} />}
      </div>

      {/* Profile Card */}
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20" />
        <CardContent className="relative pt-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-10">
            <div className="relative group">
              <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              <Button size="icon" className="absolute bottom-0 right-0 h-7 w-7 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity" onClick={handleAvatarChange}><Camera className="h-3.5 w-3.5" /></Button>
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div><h2 className="text-xl font-semibold">{user.name}</h2><div className="flex items-center gap-2 mt-1"><Badge variant="outline">{user.role.displayName}</Badge><Badge variant="outline" className={user.status === 'active' ? 'text-success border-success/30' : 'text-warning border-warning/30'}>{user.status}</Badge></div></div>
                <Button variant={isEditing ? 'default' : 'outline'} onClick={() => isEditing ? handleCancel() : setIsEditing(true)} className="sm:ml-auto">{isEditing ? <><X className="h-4 w-4 mr-2" />Cancel</> : <><Edit3 className="h-4 w-4 mr-2" />Edit Profile</>}</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Personal Information</CardTitle><CardDescription>Update your personal details</CardDescription></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5"><Label>Full Name</Label><Input {...register('name')} disabled={!isEditing} className={!isEditing ? 'bg-muted/50' : ''} />{errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}</div>
                  <div className="space-y-1.5"><Label>Email</Label><div className="relative"><Input {...register('email')} disabled className="bg-muted/50 pl-9" /><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /></div></div>
                </div>
                <div className="space-y-1.5">
                  <Label>Bio</Label>
                  <Textarea {...register('bio')} disabled={!isEditing} placeholder="Tell us about yourself..." rows={3} className={cn('resize-none', !isEditing && 'bg-muted/50')} />
                  <div className="flex justify-between">{errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}<span className="text-xs text-muted-foreground ml-auto">{bioLen}/500</span></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5"><Label>Location</Label><div className="relative"><Input {...register('location')} disabled={!isEditing} placeholder="City, Country" className={!isEditing ? 'bg-muted/50 pl-9' : 'pl-9'} /><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /></div></div>
                  <div className="space-y-1.5"><Label>Website</Label><div className="relative"><Input {...register('website')} disabled={!isEditing} placeholder="https://example.com" className={!isEditing ? 'bg-muted/50 pl-9' : 'pl-9'} /><LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /></div></div>
                </div>
                {isEditing && <div className="flex gap-3 pt-2"><Button type="submit" disabled={isLoading}>{isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : <><Save className="mr-2 h-4 w-4" />Save</>}</Button><Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button></div>}
              </form>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Social Links</CardTitle><CardDescription>Connect your social accounts</CardDescription></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5"><Label>Twitter</Label><div className="relative"><Input {...register('twitter')} disabled={!isEditing} placeholder="Username" className={!isEditing ? 'bg-muted/50 pl-9' : 'pl-9'} /><Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /></div></div>
                <div className="space-y-1.5"><Label>GitHub</Label><div className="relative"><Input {...register('github')} disabled={!isEditing} placeholder="Username" className={!isEditing ? 'bg-muted/50 pl-9' : 'pl-9'} /><Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /></div></div>
                <div className="space-y-1.5"><Label>LinkedIn</Label><div className="relative"><Input {...register('linkedin')} disabled={!isEditing} placeholder="Username" className={!isEditing ? 'bg-muted/50 pl-9' : 'pl-9'} /><Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /></div></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Completion */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Profile Completion</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Progress value={completion} className="h-2" />
              <p className="text-xs text-muted-foreground">{completion < 100 ? 'Complete your profile to unlock all features' : 'Your profile is complete!'}</p>
              <div className="space-y-1.5">{[{ label: 'Profile picture', done: !!user.avatar }, { label: 'Name & email', done: !!(user.name && user.email) }, { label: 'Bio', done: false }, { label: 'Social links', done: false }].map((item, i) => <div key={i} className="flex items-center gap-2"><div className={cn('h-4 w-4 rounded-full flex items-center justify-center', item.done ? 'bg-success' : 'bg-muted')}>{item.done && <Check className="h-2.5 w-2.5 text-success-foreground" />}</div><span className={cn('text-xs', item.done ? '' : 'text-muted-foreground')}>{item.label}</span></div>)}</div>
            </CardContent>
          </Card>

          {/* Account Details */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Account Details</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3"><div className="p-1.5 rounded bg-muted"><Shield className="h-4 w-4 text-muted-foreground" /></div><div><p className="text-xs text-muted-foreground">Role</p><Badge variant="outline" className="mt-0.5">{user.role.displayName}</Badge></div></div>
              <div className="flex items-center gap-3"><div className="p-1.5 rounded bg-muted"><Mail className="h-4 w-4 text-muted-foreground" /></div><div><p className="text-xs text-muted-foreground">Email</p><p className="text-sm font-medium">{user.email}</p></div></div>
              <div className="flex items-center gap-3"><div className="p-1.5 rounded bg-muted"><Calendar className="h-4 w-4 text-muted-foreground" /></div><div><p className="text-xs text-muted-foreground">Member Since</p><p className="text-sm font-medium">{new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p></div></div>
            </CardContent>
          </Card>

          {/* Activity */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">{ACTIVITY.map(a => <div key={a.id} className="flex items-center gap-3 p-3"><div className="p-1.5 rounded bg-muted"><a.icon className="h-4 w-4 text-muted-foreground" /></div><div><p className="text-sm">{a.action}</p><p className="text-xs text-muted-foreground">{a.time}</p></div></div>)}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
