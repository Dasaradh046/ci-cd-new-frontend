/**
 * Files View Component
 * Enterprise SaaS Design - Clean, Minimal, Professional
 */

'use client';

import { useState, useCallback, useRef, useMemo } from 'react';
import { FileText, Upload, Download, Trash2, Search, File, Image, FileCode, FileSpreadsheet, Eye, MoreHorizontal, Grid3X3, List, X, CheckSquare, Square, FileArchive, FileVideo, FileAudio, CloudUpload, ExternalLink, Music, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useFetchWithFallback, useDebounce } from '@/lib/hooks';
import { getFiles, formatFileSize, deleteFile } from '@/lib/api';
import { TableSkeleton, MockDataBadge } from '@/components/shared';
import type { FileItem } from '@/lib/models';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type ViewMode = 'grid' | 'list';
type SortField = 'name' | 'size' | 'uploadedAt';

interface UploadingFile { file: File; progress: number; status: 'uploading' | 'success' | 'error'; }

const MOCK_FILES: FileItem[] = [
  { id: '1', name: 'project-proposal.pdf', type: 'application/pdf', size: 2457600, uploadedAt: '2024-03-01T10:30:00Z', isPublic: true, url: '/files/project-proposal.pdf', thumbnail: null },
  { id: '2', name: 'design-mockups.png', type: 'image/png', size: 1572864, uploadedAt: '2024-03-02T14:15:00Z', isPublic: false, url: '/files/design-mockups.png', thumbnail: '/placeholder.jpg' },
  { id: '3', name: 'financial-report.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: 524288, uploadedAt: '2024-03-02T09:00:00Z', isPublic: false, url: '/files/financial-report.xlsx', thumbnail: null },
  { id: '4', name: 'api-config.yaml', type: 'application/x-yaml', size: 12288, uploadedAt: '2024-03-03T16:45:00Z', isPublic: true, url: '/files/api-config.yaml', thumbnail: null },
  { id: '5', name: 'presentation.pptx', type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', size: 3145728, uploadedAt: '2024-03-03T11:20:00Z', isPublic: true, url: '/files/presentation.pptx', thumbnail: null },
  { id: '6', name: 'team-photo.jpg', type: 'image/jpeg', size: 2097152, uploadedAt: '2024-03-04T08:00:00Z', isPublic: true, url: '/files/team-photo.jpg', thumbnail: '/placeholder.jpg' },
  { id: '7', name: 'source-code.zip', type: 'application/zip', size: 10485760, uploadedAt: '2024-03-04T13:30:00Z', isPublic: false, url: '/files/source-code.zip', thumbnail: null },
  { id: '8', name: 'meeting-recording.mp4', type: 'video/mp4', size: 52428800, uploadedAt: '2024-03-04T15:00:00Z', isPublic: false, url: '/files/meeting-recording.mp4', thumbnail: null },
  { id: '9', name: 'product-logo.svg', type: 'image/svg+xml', size: 8192, uploadedAt: '2024-03-04T16:00:00Z', isPublic: true, url: '/files/product-logo.svg', thumbnail: null },
  { id: '10', name: 'podcast-intro.mp3', type: 'audio/mpeg', size: 5242880, uploadedAt: '2024-03-04T17:00:00Z', isPublic: true, url: '/files/podcast-intro.mp3', thumbnail: null },
];

export function FilesView() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('uploadedAt');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);
  const { data, isLoading, isMock, refetch } = useFetchWithFallback(() => getFiles(1, 50), MOCK_FILES);
  const files = data?.data || [];

  const filteredFiles = useMemo(() => {
    let result = files.filter((f: FileItem) => f.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
    result.sort((a: FileItem, b: FileItem) => sortField === 'name' ? a.name.localeCompare(b.name) : sortField === 'size' ? a.size - b.size : new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    return result;
  }, [files, debouncedSearch, sortField]);

  const stats = useMemo(() => ({ total: files.length, size: files.reduce((s: number, f: FileItem) => s + f.size, 0) }), [files]);

  const processFiles = (filesToUpload: File[]) => {
    const uploading: UploadingFile[] = filesToUpload.map(file => ({ file, progress: 0, status: 'uploading' as const }));
    setUploadingFiles(uploading);
    uploading.forEach((uf, idx) => { let progress = 0; const interval = setInterval(() => { progress += Math.random() * 30; if (progress >= 100) { clearInterval(interval); setUploadingFiles(prev => prev.map((f, i) => i === idx ? { ...f, progress: 100, status: 'success' } : f)); } else setUploadingFiles(prev => prev.map((f, i) => i === idx ? { ...f, progress } : f)); }, 200); });
    setTimeout(() => { setUploadingFiles([]); refetch(); toast({ title: 'Upload complete', description: `${filesToUpload.length} file(s) uploaded` }); }, 3000);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); processFiles(Array.from(e.dataTransfer.files)); }, [processFiles]);

  const toggleSelect = (id: string) => {
    setSelectedFiles(prev => {
      const s = new Set(prev);
      if (s.has(id)) { s.delete(id); } else { s.add(id); }
      return s;
    });
  };
  const toggleSelectAll = () => {
    setSelectedFiles(selectedFiles.size === filteredFiles.length ? new Set() : new Set(filteredFiles.map((f: FileItem) => f.id)));
  };

  const handleDelete = async () => { if (!fileToDelete) return; setIsProcessing(true); toast({ title: 'File deleted' }); setDeleteDialogOpen(false); setFileToDelete(null); setIsProcessing(false); };
  const handleDownload = (file: FileItem) => toast({ title: 'Download started', description: file.name });
  const handleMultiDownload = () => { toast({ title: 'Creating ZIP archive', description: `${selectedFiles.size} files` }); setSelectedFiles(new Set()); };

  const getFileIcon = (type: string, size = 'lg') => {
    const cls = size === 'lg' ? 'h-10 w-10' : 'h-5 w-5';
    if (type.startsWith('image/')) return <Image className={cn(cls, 'text-purple-500')} />;
    if (type.startsWith('video/')) return <FileVideo className={cn(cls, 'text-rose-500')} />;
    if (type.startsWith('audio/')) return <FileAudio className={cn(cls, 'text-amber-500')} />;
    if (type.includes('pdf')) return <FileText className={cn(cls, 'text-red-500')} />;
    if (type.includes('zip') || type.includes('rar')) return <FileArchive className={cn(cls, 'text-amber-600')} />;
    if (type.includes('sheet')) return <FileSpreadsheet className={cn(cls, 'text-success')} />;
    if (type.includes('yaml') || type.includes('json')) return <FileCode className={cn(cls, 'text-cyan-500')} />;
    return <File className={cn(cls, 'text-muted-foreground')} />;
  };

  const getFileTypeLabel = (type: string) => { if (type.startsWith('image/')) return 'Image'; if (type.startsWith('video/')) return 'Video'; if (type.startsWith('audio/')) return 'Audio'; if (type.includes('pdf')) return 'PDF'; if (type.includes('zip')) return 'Archive'; return type.split('/')[1]?.toUpperCase() || 'File'; };

  if (isLoading) return <TableSkeleton rows={5} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-semibold tracking-tight">Files</h1><p className="text-muted-foreground mt-1">Manage your uploaded files</p></div>
        <div className="flex items-center gap-3">{isMock && <MockDataBadge isMock={isMock} />}<Button onClick={() => fileInputRef.current?.click()}><Upload className="h-4 w-4 mr-2" />Upload</Button></div>
      </div>

      {/* Upload Area */}
      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={e => e.target.files && processFiles(Array.from(e.target.files))} />
      <div onClick={() => fileInputRef.current?.click()} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={cn('border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all', isDragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30')}>
        <div className={cn('h-12 w-12 rounded-xl mx-auto mb-3 flex items-center justify-center transition-colors', isDragging ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
          {isDragging ? <CloudUpload className="h-6 w-6 animate-bounce" /> : <Upload className="h-6 w-6" />}
        </div>
        <p className="font-medium">{isDragging ? 'Drop files here' : 'Drag and drop files or click to browse'}</p>
        <p className="text-sm text-muted-foreground mt-1">{stats.total} files • {formatFileSize(stats.size)}</p>
        {uploadingFiles.length > 0 && <div className="mt-4 space-y-2 max-w-sm mx-auto">{uploadingFiles.map((uf, i) => <div key={i} className="bg-card rounded-lg p-3 border"><div className="flex items-center gap-2 mb-2"><div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /><span className="text-sm truncate flex-1">{uf.file.name}</span><span className="text-xs text-muted-foreground">{formatFileSize(uf.file.size)}</span></div><Progress value={uf.progress} className="h-1.5" /></div>)}</div>}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search files..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" /></div>
        <Tabs value={viewMode} onValueChange={v => setViewMode(v as ViewMode)}><TabsList><TabsTrigger value="grid" className="px-3"><Grid3X3 className="h-4 w-4" /></TabsTrigger><TabsTrigger value="list" className="px-3"><List className="h-4 w-4" /></TabsTrigger></TabsList></Tabs>
      </div>

      {/* Selection Actions */}
      {selectedFiles.size > 0 && (
        <div className="flex items-center gap-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2"><CheckSquare className="h-4 w-4 text-primary" /><span className="font-medium text-sm">{selectedFiles.size} selected</span></div>
          <Separator orientation="vertical" className="h-5" />
          <Button variant="outline" size="sm" onClick={handleMultiDownload}><FileArchive className="h-4 w-4 mr-2" />Download ZIP</Button>
          <Button variant="destructive" size="sm" onClick={() => {}}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
          <div className="flex-1" /><Button variant="ghost" size="sm" onClick={() => setSelectedFiles(new Set())}>Clear</Button>
        </div>
      )}

      {/* Files */}
      {filteredFiles.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFiles.map((file: FileItem) => (
              <Card key={file.id} className={cn('group overflow-hidden transition-all cursor-pointer hover:shadow-md', selectedFiles.has(file.id) && 'ring-2 ring-primary')} onClick={() => setPreviewFile(file)}>
                <div className="relative h-28 bg-muted/50 flex items-center justify-center">
                  {file.type.startsWith('image/') ? <img src={file.thumbnail || '/placeholder.jpg'} alt={file.name || 'File preview'} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> : getFileIcon(file.type)}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 gap-2">
                    <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full bg-white/90 hover:bg-white" onClick={e => { e.stopPropagation(); setPreviewFile(file); }}><Eye className="h-4 w-4" /></Button>
                    <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full bg-white/90 hover:bg-white" onClick={e => { e.stopPropagation(); handleDownload(file); }}><Download className="h-4 w-4" /></Button>
                  </div>
                  <div className="absolute top-2 left-2 z-10" onClick={e => e.stopPropagation()}><Checkbox checked={selectedFiles.has(file.id)} onCheckedChange={() => toggleSelect(file.id)} className="bg-background/80" /></div>
                  {file.isPublic && <Badge className="absolute top-2 right-2 bg-success/90 text-success-foreground text-xs">Public</Badge>}
                </div>
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate" title={file.name}>{file.name}</p>
                      <div className="flex items-center gap-2 mt-1"><Badge variant="secondary" className="text-xs">{getFileTypeLabel(file.type)}</Badge><span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span></div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={e => e.stopPropagation()}><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setPreviewFile(file)}><Eye className="h-4 w-4 mr-2" />Preview</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(file)}><Download className="h-4 w-4 mr-2" />Download</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => { setFileToDelete(file); setDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="overflow-hidden">
            <div className="flex items-center gap-4 p-3 bg-muted/30 border-b text-sm font-medium">
              <Checkbox checked={selectedFiles.size === filteredFiles.length && filteredFiles.length > 0} onCheckedChange={toggleSelectAll} />
              <span className="flex-1">Name</span>
              <span className="w-20 text-center hidden sm:block">Type</span>
              <span className="w-20 text-right hidden md:block">Size</span>
              <span className="w-20 text-right hidden lg:block">Modified</span>
              <span className="w-8" />
            </div>
            <ScrollArea className="max-h-[500px]">
              <div className="divide-y">
                {filteredFiles.map((file: FileItem) => (
                  <div key={file.id} className={cn('flex items-center gap-4 p-3 hover:bg-muted/30 transition-colors cursor-pointer', selectedFiles.has(file.id) && 'bg-primary/5')} onClick={() => setPreviewFile(file)}>
                    <Checkbox checked={selectedFiles.has(file.id)} onCheckedChange={() => toggleSelect(file.id)} onClick={e => e.stopPropagation()} />
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">{getFileIcon(file.type, 'sm')}</div>
                      <div className="min-w-0"><p className="font-medium truncate">{file.name}</p><p className="text-xs text-muted-foreground sm:hidden">{formatFileSize(file.size)}</p></div>
                    </div>
                    <span className="w-20 text-center text-sm text-muted-foreground hidden sm:block truncate">{getFileTypeLabel(file.type)}</span>
                    <span className="w-20 text-right text-sm text-muted-foreground hidden md:block">{formatFileSize(file.size)}</span>
                    <span className="w-20 text-right text-sm text-muted-foreground hidden lg:block">{new Date(file.uploadedAt).toLocaleDateString()}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => e.stopPropagation()}><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setPreviewFile(file)}><Eye className="h-4 w-4 mr-2" />Preview</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(file)}><Download className="h-4 w-4 mr-2" />Download</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => { setFileToDelete(file); setDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        )
      ) : (
        <Card><CardContent className="py-16 text-center"><FileText className="h-10 w-10 mx-auto text-muted-foreground/50 mb-4" /><p className="text-muted-foreground">No files found</p><Button onClick={() => fileInputRef.current?.click()} className="mt-4"><Upload className="h-4 w-4 mr-2" />Upload Files</Button></CardContent></Card>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] p-0">
          <DialogHeader className="p-4 border-b"><DialogTitle className="flex items-center gap-3">{previewFile && <>{getFileIcon(previewFile.type, 'sm')}<div><span>{previewFile.name}</span><p className="text-sm font-normal text-muted-foreground">{formatFileSize(previewFile.size)} • {getFileTypeLabel(previewFile.type)}</p></div></>}</DialogTitle></DialogHeader>
          <div className="p-4">{previewFile?.type.startsWith('image/') ? <div className="bg-muted rounded-lg p-8 flex items-center justify-center min-h-[200px]"><img src={previewFile.thumbnail || '/placeholder.jpg'} alt={previewFile.name || 'File preview'} className="max-w-full max-h-[50vh] object-contain" /></div> : previewFile?.type.startsWith('video/') ? <div className="bg-black rounded-lg h-[50vh] flex items-center justify-center"><Play className="h-16 w-16 text-white/50" /></div> : previewFile?.type.startsWith('audio/') ? <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg h-[30vh] flex flex-col items-center justify-center"><Music className="h-16 w-16 text-amber-500 mb-4" /><p className="font-medium">{previewFile.name}</p></div> : <div className="bg-muted rounded-lg p-8 text-center">{previewFile && getFileIcon(previewFile.type)}<p className="mt-4 font-medium">{previewFile?.name}</p><p className="text-sm text-muted-foreground mt-1">Preview not available</p></div>}</div>
          <div className="flex items-center justify-between p-4 border-t bg-muted/30"><p className="text-sm text-muted-foreground">Uploaded {previewFile && new Date(previewFile.uploadedAt).toLocaleDateString()}</p><div className="flex gap-2"><Button variant="outline" onClick={() => setPreviewFile(null)}>Close</Button>{previewFile && <Button onClick={() => { handleDownload(previewFile); setPreviewFile(null); }}><Download className="h-4 w-4 mr-2" />Download</Button>}</div></div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete File</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete &quot;{fileToDelete?.name}&quot;? This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDelete} disabled={isProcessing}>{isProcessing ? 'Deleting...' : 'Delete'}</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
