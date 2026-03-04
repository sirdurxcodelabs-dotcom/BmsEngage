export type MediaCategory = 'Flyer' | 'Image' | 'Video' | 'Graphics';
export type MediaStatus = 'Draft' | 'Published' | 'Archived';
export type MediaVisibility = 'Private' | 'Public' | 'Team';

export interface MediaMetadata {
  width?: number;
  height?: number;
  dpi?: number;
  colorModel?: string;
  fileType: string;
  fileSize: string;
  createdDate: string;
  modifiedDate: string;
  exif?: Record<string, any>;
  duration?: string;
  resolution?: string;
  frameRate?: number;
  codec?: string;
  bitrate?: string;
  audioPresence?: boolean;
  mimeType: string;
}

export interface MediaVariant {
  id: string;
  parentAssetId: string;
  version: number;
  title: string;
  url: string;
  metadata: MediaMetadata;
}

export interface MediaAsset {
  id: string;
  category: MediaCategory;
  title: string;
  description: string;
  url: string;
  tags: string[];
  status: MediaStatus;
  visibility: MediaVisibility;
  metadata: MediaMetadata;
  variants: MediaVariant[];
  uploadedBy: string;
}
