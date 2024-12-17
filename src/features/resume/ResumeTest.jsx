import React, { useState } from 'react';
import {
    useCreateResumeMutation,
    useGetResumeByUserQuery,
    useGetAllResumesQuery,
    useUpdateResumeMutation,
    useDeleteResumeMutation,
} from './resumeApiSlice';

const ResumeTest = () => {
    const [userId, setUserId] = useState('');
    const [resumeId, setResumeId] = useState('');
    const [resumeData, setResumeData] = useState({
        _id: '',
        basicDetail: { name: 'Test User', email: 'test@example.com' },
    });

    // Mutations and Queries
    const [createResume] = useCreateResumeMutation();
    const { data: userResume, error: userResumeError } = useGetResumeByUserQuery(userId, { skip: !userId });
    const { data: allResumes } = useGetAllResumesQuery();
    const [updateResume] = useUpdateResumeMutation();
    const [deleteResume] = useDeleteResumeMutation();

    // Handlers
    const handleCreate = async () => {
        const response = await createResume({ user: '12345' }); // Replace with a valid user ID
        console.log('Create Resume:', response);
        alert('Resume Created');
    };

    const handleFetchByUser = () => {
        if (!userId) alert('Enter a valid User ID to fetch the resume.');
    };

    const handleUpdate = async () => {
        const response = await updateResume({ ...resumeData });
        console.log('Update Resume:', response);
        alert('Resume Updated');
    };

    const handleDelete = async () => {
        if (!resumeId) {
            alert('Enter a valid Resume ID to delete.');
            return;
        }
        const response = await deleteResume(resumeId);
        console.log('Delete Resume:', response);
        alert('Resume Deleted');
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Resume API Test</h1>

            {/* Create Resume */}
            <div>
                <h2>Create Resume</h2>
                <button onClick={handleCreate}>Create Resume</button>
            </div>

            {/* Get Resume By User */}
            <div>
                <h2>Get Resume by User ID</h2>
                <input
                    type="text"
                    placeholder="Enter User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <button onClick={handleFetchByUser}>Fetch Resume</button>
                {userResumeError && <p>Error fetching resume</p>}
                {userResume && <pre>{JSON.stringify(userResume, null, 2)}</pre>}
            </div>

            {/* Get All Resumes */}
            <div>
                <h2>Get All Resumes</h2>
                {allResumes ? (
                    <pre>{JSON.stringify(allResumes, null, 2)}</pre>
                ) : (
                    <p>No resumes found or still fetching...</p>
                )}
            </div>

            {/* Update Resume */}
            <div>
                <h2>Update Resume</h2>
                <input
                    type="text"
                    placeholder="Enter Resume ID"
                    value={resumeData._id}
                    onChange={(e) => setResumeData({ ...resumeData, _id: e.target.value })}
                />
                <button onClick={handleUpdate}>Update Resume</button>
            </div>

            {/* Delete Resume */}
            <div>
                <h2>Delete Resume</h2>
                <input
                    type="text"
                    placeholder="Enter Resume ID"
                    value={resumeId}
                    onChange={(e) => setResumeId(e.target.value)}
                />
                <button onClick={handleDelete}>Delete Resume</button>
            </div>
        </div>
    );
};

export default ResumeTest;
