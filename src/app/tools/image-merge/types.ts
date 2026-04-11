export type MergeDirection = 'vertical' | 'horizontal' | 'grid';
export type OutputFormat = 'image/png' | 'image/jpeg' | 'image/webp';
export type Alignment = 'center' | 'start' | 'end';

export interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
}

export interface MergeOptions {
  direction: MergeDirection;
  columns: number;
  gap: number;
  bgColor: string;
  alignment: Alignment;
  format: OutputFormat;
  quality: number;
  scale: number;
}
