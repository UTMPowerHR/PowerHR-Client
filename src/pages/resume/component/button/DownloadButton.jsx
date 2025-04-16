import Button from '@mui/material/Button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const DownloadButton = () => {
    const handleDownload = async () => {
        try {
            const resumeContainer = document.getElementById('resume-container');
            if (!resumeContainer) {
                alert('Resume container not found!');
                return;
            }

            const pdf = new jsPDF({
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait',
            });

            const canvas = await html2canvas(resumeContainer, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: false,
            });

            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Add white background
            pdf.setFillColor(255, 255, 255);
            pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

            // Add content
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, '', 'FAST');
            pdf.save('resume.pdf');
        } catch (error) {
            console.error('PDF generation failed:', error);
            alert('Failed to generate PDF');
        }
    };

    return (
        <Button variant="contained" color="primary" onClick={handleDownload} sx={{ mt: 2 }}>
            Download PDF
        </Button>
    );
};

export default DownloadButton;
