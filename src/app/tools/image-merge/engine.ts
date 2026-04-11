import { ImageItem, MergeOptions } from './types';

export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export const calculateLayout = (images: ImageItem[], options: MergeOptions) => {
  let totalWidth = 0;
  let totalHeight = 0;
  const layoutData: { img: ImageItem; x: number; y: number }[] = [];

  const { direction, columns, gap } = options;

  if (images.length === 0) return { totalWidth, totalHeight, layoutData };

  if (direction === 'vertical') {
    totalWidth = Math.max(...images.map((img) => img.width));
    let currentY = 0;
    
    images.forEach((img) => {
      let x = 0;
      if (options.alignment === 'center') {
        x = (totalWidth - img.width) / 2;
      } else if (options.alignment === 'end') {
        x = totalWidth - img.width;
      }
      layoutData.push({ img, x, y: currentY });
      currentY += img.height + gap;
    });
    totalHeight = currentY > 0 ? currentY - gap : 0;
  } else if (direction === 'horizontal') {
    totalHeight = Math.max(...images.map((img) => img.height));
    let currentX = 0;

    images.forEach((img) => {
      let y = 0;
      if (options.alignment === 'center') {
        y = (totalHeight - img.height) / 2;
      } else if (options.alignment === 'end') {
        y = totalHeight - img.height;
      }
      layoutData.push({ img, x: currentX, y });
      currentX += img.width + gap;
    });
    totalWidth = currentX > 0 ? currentX - gap : 0;
  } else if (direction === 'grid') {
    const cols = Math.max(1, columns);
    const rows = Math.ceil(images.length / cols);
    
    const maxCellWidth = Math.max(...images.map(img => img.width));
    const maxCellHeight = Math.max(...images.map(img => img.height));
    const cellSize = Math.max(maxCellWidth, maxCellHeight);
    
    totalWidth = cols * cellSize + (cols - 1) * gap;
    totalHeight = rows * cellSize + (rows - 1) * gap;

    images.forEach((img, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      const cellX = col * (cellSize + gap);
      const cellY = row * (cellSize + gap);
      
      let x = cellX;
      let y = cellY;
      
      if (options.alignment === 'center') {
        x = cellX + (cellSize - img.width) / 2;
        y = cellY + (cellSize - img.height) / 2;
      } else if (options.alignment === 'end') {
        x = cellX + (cellSize - img.width);
        y = cellY + (cellSize - img.height);
      }
      
      layoutData.push({ img, x, y });
    });
  }

  return { totalWidth, totalHeight, layoutData };
};

export const renderMergedImage = async (
  canvas: HTMLCanvasElement,
  images: ImageItem[],
  options: MergeOptions
) => {
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;

  const { totalWidth, totalHeight, layoutData } = calculateLayout(images, options);
  
  const scale = options.scale;
  
  canvas.width = totalWidth * scale;
  canvas.height = totalHeight * scale;

  // Background
  ctx.fillStyle = options.bgColor || '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Smooth drawing for better quality
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Draw images
  for (const item of layoutData) {
    const loadedImg = await loadImage(item.img.previewUrl);
    ctx.drawImage(
      loadedImg,
      item.x * scale,
      item.y * scale,
      item.img.width * scale,
      item.img.height * scale
    );
  }
};