'use client';

import { useEffect, useState } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import { useGetResumeQuery, useSaveResumeMutation } from '@features/applicant/applicantApiSlice';
import { setResume, changeTemplate } from '@features/applicant/applicantSlice';
import { useSelector, useDispatch } from 'react-redux';
import FormDrawer from './component/form';
import {
    Paper,
    Container,
    Stack,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Typography,
} from '@mui/material';
import DownloadButton from './component/button/DownloadButton';
import ColorButton from './component/button/ColorButton';
import * as Modern from './template/modern'; // Import Modern template components
import * as Basic from './template/basic'; // Import Basic template components

const listTemplate = [
    {
        name: 'Modern',
        value: 'modern',
        description: 'Modern template',
        column: 2,
    },
    {
        name: 'Basic',
        value: 'basic',
        description: 'Basic template',
        column: 1,
    },
];

export default function ResumeBuilder() {
    const id = useSelector((state) => state.auth.user._id);
    // const id = '6761159f6ed217f265b244e2';
    const { data: resumeData, isLoading } = useGetResumeQuery(id);
    const [saveResume, { isLoading: saveLoading }] = useSaveResumeMutation();
    const dispatch = useDispatch();
    const formData = useSelector((state) => state.applicant.resume);
    const template = useSelector((state) => state.applicant.resume.template.name);

    const [edit, setEdit] = useState(false);
    const [backup, setBackup] = useState({});
    const [preview, setPreview] = useState(false);
    const [templateOpen, setTemplateOpen] = useState(false);
    const [templateSelect, setTemplateSelect] = useState('modern');

    useEffect(() => {
        if (resumeData) {
            // console.log('Resume data received:', resumeData);

            // Ensure template has proper structure
            const processedResumeData = {
                ...resumeData,
                template: {
                    name: resumeData.template?.name || 'modern',
                    column: resumeData.template?.column || 2,
                    settings: {
                        titleColor: resumeData.template?.settings?.titleColor || '#2c3e50',
                        contentColor: resumeData.template?.settings?.contentColor || '#34495e',
                        backgroundColor1: resumeData.template?.settings?.backgroundColor1 || '#ffffff',
                        backgroundColor2: resumeData.template?.settings?.backgroundColor2 || '#f8f9fa',
                        backgroundColor3: resumeData.template?.settings?.backgroundColor3 || '#e9ecef',
                    },
                    pages:
                        resumeData.template?.pages?.length > 0
                            ? resumeData.template.pages
                            : [
                                  {
                                      columns: [
                                          {
                                              list: [
                                                  { name: 'summary', typeCard: 'string' },
                                                  { name: 'experience', typeCard: 'timeline' },
                                                  { name: 'education', typeCard: 'timeline' },
                                              ],
                                          },
                                          {
                                              list: [
                                                  { name: 'technicalSkills', typeCard: 'score' },
                                                  { name: 'softSkills', typeCard: 'list' },
                                                  { name: 'languages', typeCard: 'score' },
                                              ],
                                          },
                                      ],
                                  },
                              ],
                },
            };

            dispatch(setResume(cloneDeep(processedResumeData)));
            setBackup(cloneDeep(processedResumeData));
            setTemplateSelect(processedResumeData.template.name);
        }
    }, [resumeData, dispatch]);

    function handlePreview() {
        setPreview(!preview);
    }

    // old style
    async function handleSaveData() {
        await saveResume(formData)
            .unwrap()
            .then(() => {
                setEdit(false);
                setBackup(formData);
            });
    }

    // new style
    const handleResetData = () => {
        dispatch(setResume(cloneDeep(backup)));
    };

    const handleTemplateChange = () => {
        dispatch(
            changeTemplate({
                name: templateSelect,
                column: listTemplate.find((item) => item.value === templateSelect).column,
            }),
        );
        setTemplateOpen(false);
    };

    const handleTemplateCancel = () => {
        setTemplateOpen(false);
        setTemplateSelect(template);
    };

    useEffect(() => {
        setEdit(isEqual(formData, backup));
    }, [formData, backup]);

    if (isLoading) {
        return <h1>loading...</h1>;
    }

    return (
        <>
            {/* / template */}
            <FormDrawer />
            <Container maxWidth="xl">
                <Paper sx={{ width: '8.27in', mb: 5 }}>
                    <Stack spacing={2} sx={{ p: 2 }} direction="row" justifyContent="space-between" alignItems="center">
                        <Stack spacing={1} direction="row" alignItems="center">
                            <ColorButton />
                        </Stack>
                        <Stack spacing={1} direction="row" alignItems="center">
                            <Button variant="contained" color="primary" onClick={() => setTemplateOpen(true)}>
                                Change Template
                            </Button>
                            <Button variant="contained" color="primary" onClick={handlePreview}>
                                {preview ? 'Edit' : 'Preview'}
                            </Button>
                            <Button onClick={handleSaveData} variant="contained" disabled={edit || saveLoading}>
                                {saveLoading ? 'Saving...' : 'Save'}
                            </Button>
                            <Button onClick={handleResetData} variant="contained" disabled={edit || saveLoading}>
                                Reset
                            </Button>
                            <DownloadButton resumeId={formData._id} />
                        </Stack>
                    </Stack>
                </Paper>
                {/* Add template */}
                {/* Render template based on the selected template */}
                {template === 'modern' && !preview && <Modern.ModernEdit />}
                {template === 'modern' && preview && <Modern.ModernPreview />}
                {template === 'basic' && !preview && <Basic.BasicEdit />}
                {template === 'basic' && preview && <Basic.BasicPreview />}
            </Container>

            {/* Dialog for template selection */}
            <Dialog open={templateOpen} onClose={() => setTemplateOpen(false)} fullWidth>
                <DialogTitle>Select Template</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="template-select-label">Template</InputLabel>
                        <Select
                            labelId="template-select-label"
                            id="template-select"
                            value={templateSelect}
                            label="Template"
                            onChange={(e) => {
                                setTemplateSelect(e.target.value);
                            }}
                        >
                            {listTemplate.map((item) => (
                                <MenuItem key={item.value} value={item.value}>
                                    <Stack>
                                        <Typography variant="subtitle1">{item.name}</Typography>
                                        <Typography variant="caption">{item.description}</Typography>
                                    </Stack>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleTemplateCancel()}>Cancel</Button>
                    <Button
                        onClick={() => {
                            handleTemplateChange();
                        }}
                    >
                        Change
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
