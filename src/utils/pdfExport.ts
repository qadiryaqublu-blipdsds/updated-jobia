import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CVData } from '../types';

export function generateCVFileName(fullNameOrData?: string | CVData | any, jobTitle?: string): string {
  let name = 'Namized';
  let title = jobTitle || 'CV';

  if (fullNameOrData && typeof fullNameOrData === 'object') {
    name = fullNameOrData.personalInfo?.fullName || fullNameOrData.fullName || 'Namized';
    title = jobTitle || fullNameOrData.personalInfo?.title || fullNameOrData.title || 'CV';
  } else if (typeof fullNameOrData === 'string') {
    name = fullNameOrData || 'Namized';
  }

  const cleanName = (name || 'Namized')
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_');
  const cleanTitle = (title || 'CV')
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_');
  return `${cleanName}_${cleanTitle}_Jobia.pdf`;
}

export async function downloadCVAsPDF(
  elementId: string,
  optionsOrFileName?: string | { fileName?: string; onProgress?: (status: string) => void }
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found for PDF export.`);
    return false;
  }

  const fileName =
    typeof optionsOrFileName === 'string'
      ? optionsOrFileName
      : optionsOrFileName?.fileName || 'Jobia_CV.pdf';

  if (typeof optionsOrFileName === 'object' && optionsOrFileName?.onProgress) {
    optionsOrFileName.onProgress('Səhifə skan edilir və PDF tərtib olunur...');
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('PDF export failed:', error);
    // Fallback standard print
    window.print();
    return true;
  }
}
