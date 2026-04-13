import JSZip from 'jszip';

export const downloadZip = async (images: { pageNum: number, dataUrl: string }[], filename: string) => {
  const zip = new JSZip();
  
  images.forEach((img) => {
    // The dataUrl format is "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
    // We only need the base64 part for JSZip
    const base64Data = img.dataUrl.split(',')[1];
    zip.file(`page-${img.pageNum}.jpg`, base64Data, { base64: true });
  });
  
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
