import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetCompanyProfileQuery, useUpdateCompanyMutation } from '@features/company/companyApiSlice';
import { Grid, Typography, Card, Stack, Avatar, Button, TextField } from '@mui/material';
import Quill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import parse from 'html-react-parser';

const QuillEditorRoot = styled('div')(({ theme }) => ({
    border: 1,
    borderColor: theme.palette.divider,
    borderRadius: theme.shape.borderRadius,
    borderStyle: 'solid',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    '& .quill': {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        overflow: 'hidden',
    },
    '& .ql-snow.ql-toolbar': {
        borderColor: theme.palette.divider,
        borderLeft: 'none',
        borderRight: 'none',
        borderTop: 'none',
        '& .ql-picker-label:hover': {
            color: theme.palette.primary.main,
        },
        '& .ql-picker-label.ql-active': {
            color: theme.palette.primary.main,
        },
        '& .ql-picker-item:hover': {
            color: theme.palette.primary.main,
        },
        '& .ql-picker-item.ql-selected': {
            color: theme.palette.primary.main,
        },
        '& button:hover': {
            color: theme.palette.primary.main,
            '& .ql-stroke': {
                stroke: theme.palette.primary.main,
            },
        },
        '& button:focus': {
            color: theme.palette.primary.main,
            '& .ql-stroke': {
                stroke: theme.palette.primary.main,
            },
        },
        '& button.ql-active': {
            '& .ql-stroke': {
                stroke: theme.palette.primary.main,
            },
        },
        '& .ql-stroke': {
            stroke: theme.palette.text.primary,
        },
        '& .ql-picker': {
            color: theme.palette.text.primary,
        },
        '& .ql-picker-options': {
            backgroundColor: theme.palette.background.paper,
            border: 'none',
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.shadows[10],
            padding: theme.spacing(2),
        },
    },
    '& .ql-snow.ql-container': {
        borderBottom: 'none',
        borderColor: theme.palette.divider,
        borderLeft: 'none',
        borderRight: 'none',
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        height: 'auto',
        overflow: 'hidden',
        '& .ql-editor': {
            color: theme.palette.text.primary,
            flex: 1,
            fontFamily: theme.typography.body1.fontFamily,
            fontSize: theme.typography.body1.fontSize,
            height: 'auto',
            overflowY: 'auto',
            padding: theme.spacing(2),
            '&.ql-blank::before': {
                color: theme.palette.text.secondary,
                fontStyle: 'normal',
                left: theme.spacing(2),
            },
        },
    },
}));

export default function ProfileCompany() {
    //Get company id from parameter in URL
    const [searchParams] = useSearchParams();
    const userCompanyId = useSelector((state) => state.auth.user.company);
    const user = useSelector((state) => state.auth.user);

    const companyId = searchParams.get('id');

    //Get company data
    const { data, isLoading } = useGetCompanyProfileQuery(companyId || userCompanyId);
    const [updateCompany] = useUpdateCompanyMutation();

    const [isEdit, setIsEdit] = useState(false);
    const [alreadyEdit, setAlreadyEdit] = useState(false);

    const [page, setPage] = useState({
        header: {
            title: '',
            content: '',
        },
        body: {
            title: '',
            content: '',
        },
    });

    useEffect(() => {
        if (data?.page) {
            setPage({
                header: {
                    title: data.page?.header.title || '',
                    content: data.page?.header.content || '',
                },
                body: {
                    title: data.page?.body.title || '',
                    content: data.page?.body.content || '',
                },
            });
        }
    }, [data?.page]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const handleEdit = (name, value) => {
        setPage((prev) => ({
            ...prev,
            [name]: value,
        }));
        setAlreadyEdit(true);
    };

    const cancelEdit = () => {
        setPage({
            header: {
                title: data.page?.header.title || '',
                content: data.page?.header.content || '',
            },
            body: {
                title: data.page?.body.title || '',
                content: data.page?.body.content || '',
            },
        });
        setIsEdit(false);
    };

    const saveProfile = async () => {
        //Save data
        await updateCompany({
            _id: data._id,
            page: page,
        }).then(() => {
            setIsEdit(false);
            setAlreadyEdit(false);
        });
    };

    return (
        <>
            <Grid
                container
                spacing={{
                    xs: 3,
                    lg: 4,
                }}
            >
                <Grid item xs={12}>
                    <Stack spacing={2} direction="row" alignItems="center" justifyContent="space-between">
                        <Stack spacing={2} direction="row" alignItems="center">
                            <Avatar component={'a'} href="#" src={data?.logo} variant="rounded" />
                            <Typography variant="h4">{data.name}</Typography>
                        </Stack>

                        {user.role === 'Admin' && user.company === data._id && !isEdit && (
                            <Button variant="contained" color="primary" onClick={() => setIsEdit(true)}>
                                Edit
                            </Button>
                        )}

                        {user.role === 'Admin' && user.company === data._id && isEdit && (
                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={!alreadyEdit}
                                    onClick={saveProfile}
                                >
                                    Save
                                </Button>
                                <Button variant="outlined" onClick={cancelEdit}>
                                    Cancel
                                </Button>
                            </Stack>
                        )}
                    </Stack>
                </Grid>

                <Grid item xs={12}>
                    <Card sx={{ p: 2 }}>
                        {isEdit ? (
                            <>
                                <Stack spacing={2}>
                                    <TextField
                                        fullWidth
                                        label="Header Title"
                                        value={page.header.title}
                                        variant="outlined"
                                        onChange={(e) =>
                                            handleEdit('header', { ...page.header, title: e.target.value })
                                        }
                                    />
                                    <QuillEditorRoot sx={{ height: 400 }}>
                                        <Quill
                                            value={page.header.content}
                                            onChange={(value) =>
                                                handleEdit('header', { ...page.header, content: value })
                                            }
                                        />
                                    </QuillEditorRoot>
                                </Stack>
                            </>
                        ) : (
                            <>
                                <Typography variant="h5">{page.header.title || 'Header Title'}</Typography>
                                {parse(page.header.content || 'No description')}
                            </>
                        )}
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card sx={{ p: 2 }}>
                        {isEdit ? (
                            <Stack spacing={2}>
                                <TextField
                                    fullWidth
                                    label="Body Title"
                                    value={page.body.title}
                                    variant="outlined"
                                    onChange={(e) => handleEdit('body', { ...page.body, title: e.target.value })}
                                />
                                <QuillEditorRoot sx={{ height: 400 }}>
                                    <Quill
                                        value={page.body.content}
                                        onChange={(value) => handleEdit('body', { ...page.body, content: value })}
                                    />
                                </QuillEditorRoot>
                            </Stack>
                        ) : (
                            <>
                                <Typography variant="h5">{page.body.title || 'Body Title'}</Typography>
                                {parse(page.body.content || 'No description')}
                            </>
                        )}
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}
