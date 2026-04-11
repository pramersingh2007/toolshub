import JSZip from 'jszip';

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const downloadAll = async (
  files: { blob: Blob; originalName: string }[],
  format: string
) => {
  if (files.length === 1) {
    downloadBlob(files[0].blob, getFilename(files[0].originalName, format));
    return;
  }

  const zip = new JSZip();
  files.forEach((file) => {
    zip.file(getFilename(file.originalName, format), file.blob);
  });

  const content = await zip.generateAsync({ type: 'blob' });
  downloadBlob(content, 'processed_images.zip');
};

const getFilename = (originalName: string, format: string): string => {
  const ext = format === 'image/jpeg' ? '.jpg' : format === 'image/png' ? '.png' : '.webp';
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  return `${nameWithoutExt}_processed${ext}`;
};
