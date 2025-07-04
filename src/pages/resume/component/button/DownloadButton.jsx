import Button from '@mui/material/Button';
import { useGenerateResumeFileMutation } from '@features/applicant/applicantApiSlice';

// eslint-disable-next-line react/prop-types
const DownloadButton = ({ resumeId }) => {
    const [generateResumeFile, { isLoading }] = useGenerateResumeFileMutation();

    console.log('isLoading:', isLoading);

    const handleDownload = async () => {
        try {
            console.log('Generating resume file...');
            // Trigger the API call to generate the file URL
            const response = await generateResumeFile(resumeId).unwrap(); // Use .unwrap() to handle errors properly

            // Extract the file URL from the response
            const fileUrl = response?.fileUrl;

            if (fileUrl) {
                console.log('Downloading resume...');
                window.open(fileUrl, '_blank');
            } else {
                console.error('Failed to generate file URL');
                alert('Failed to generate the resume file. Please try again.');
            }
        } catch (error) {
            console.error('Error downloading resume:', error);
            alert('Failed to download the resume. Please try again.');
        }
    };

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={handleDownload}
            disabled={isLoading} // Disable the button while the file is being generated
        >
            {isLoading ? 'Generating...' : 'Download Resume'}
        </Button>
    );
};

export default DownloadButton;
