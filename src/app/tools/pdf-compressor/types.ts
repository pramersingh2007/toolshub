export interface PDFFile {
  file: File;
  name: string;
  size: number;
  pageCount?: number;
  url: string;
}

export interface CompressionStats {
  originalSize: number;
  compressedSize: number;
  reductionPercentage: number;
}

export interface CompressionSettings {
  compressionLevel: number;
}
