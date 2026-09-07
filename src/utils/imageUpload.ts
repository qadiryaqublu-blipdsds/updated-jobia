/**
 * Converts a File or Blob into a base64 Data URL.
 */
export interface ImageUploadOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxFileSizeMB?: number;
}

export async function fileToDataUrl(file: File | Blob, options?: ImageUploadOptions): Promise<string> {
  if (options?.maxFileSizeMB && file.size > options.maxFileSizeMB * 1024 * 1024) {
    throw new Error(`Faylın həcmi ${options.maxFileSizeMB}MB-dan çox olmamalıdır.`);
  }

  const raw = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Fayl oxuna bilmədi.'));
      }
    };
    reader.onerror = () => reject(reader.error || new Error('Fayl oxunma xətası'));
    reader.readAsDataURL(file);
  });

  if (options?.maxWidth || options?.maxHeight) {
    return compressImage(file as File, options.maxWidth || 800, options.maxHeight || 800, options.quality || 0.85);
  }

  return raw;
}

/**
 * Generates an SVG or Dicebear avatar based on a seed string.
 */
export function generateSeedAvatar(seed: string, style: string = 'initials'): string {
  const safeSeed = encodeURIComponent(seed || 'jobia');
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${safeSeed}&backgroundColor=2563eb,0284c7,3b82f6&textColor=ffffff`;
}

/**
 * Compresses an image file by scaling to max width/height and quality.
 */
export async function compressImage(
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.85
): Promise<string> {
  const dataUrl = await fileToDataUrl(file);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } else {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}
