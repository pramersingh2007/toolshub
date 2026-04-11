export interface ProcessingImage {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
  status: 'Waiting' | 'AI Removing' | 'Processing' | 'Done' | 'Error';
  processedBlob?: Blob | null;
  processedUrl?: string | null;
  error?: string;
}

export interface ProcessingSettings {
  removeBg: boolean;
  bgColor: string;
  padding: number;
  format: 'image/jpeg' | 'image/png' | 'image/webp';
  quality: number;
}
