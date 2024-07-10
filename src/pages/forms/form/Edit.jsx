import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Fab, Grid, IconButton, Stack, SvgIcon, TextField, Typography } from '@mui/material';
import { DotsVertical } from '@untitled-ui/icons-react';
import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useGetFormByIdWithSnapshotQuery, useUpdateFormMutation } from '@features/form/formApiSlice';
import { addQuestion, setCurrentQuestion, setForm, setQuestions } from '@features/form/formSlice';
import DeleteDialog from './components/delete-dialog';
import QuestionCard from './components/questionCard';
import SettingDialog from './components/setting-dialog';

function EditForm() {
    // Get the form id from the URL
    const { id } = useParams();

    // Fetch the form data from the API
    const { data, isSuccess, isLoading } = useGetFormByIdWithSnapshotQuery(id, { refetchOnMountOrArgChange: true });
    const [updateFormMutation] = useUpdateFormMutation();

    // Dispatch actions to update the Redux store
    const dispatch = useDispatch();

    // Get the form data from the Redux store
    const form = useSelector((state) => state.form.form);
    const deleteQuestions = useSelector((state) => state.form.deleteQuestions);
    const questions = useSelector((state) => state.form.form.questions);
    const currentQuestion = useSelector((state) => state.form.currentQuestion);
    const saved = useSelector((state) => state.form.saved);

    // Local state for the dialog
    const [open, setOpen] = useState(false);
    const [openSetting, setOpenSetting] = useState(false);

    // Update the form data in the Redux store when the API call is successful
    useEffect(() => {
        if (isSuccess) {
            dispatch(setForm(data.form));
        }
    }, [data, dispatch, isSuccess]);

    //Functions
    const handleSave = async () => {
        try {
            const unSaveForm = { ...form };
            unSaveForm.questions = [...questions, ...deleteQuestions];
            await updateFormMutation({ form: unSaveForm });
        } catch (error) {
            console.log(error);
        }
    };

    const onClose = () => {
        setOpen(false);
    };

    const onSettingClose = () => {
        setOpenSetting(false);
    };

    const handleConfirmDelete = () => {
        setOpen(true);
    };

    const reorder = async (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    const handleOnDragEnd = async ({ source, destination }) => {
        if (!destination) return;

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        const newListQuestions = await reorder(questions, source.index, destination.index);

        dispatch(setQuestions(newListQuestions));
    };

    const handleOnClick = (id) => {
        if (currentQuestion !== id) {
            dispatch(setCurrentQuestion(id));
        }
    };

    const handleAddQuestion = () => {
        dispatch(addQuestion());
    };

    const handleOnChange = (e) => {
        dispatch(setForm({ ...form, [e.target.name]: e.target.value }));
    };

    if (isLoading) {
        return <Typography variant="h4">Loading...</Typography>;
    }

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
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Stack direction="row" justifyContent="space-between" spacing={4}>
                                <Stack spacing={1}>
                                    <TextField
                                        fullWidth
                                        label="Name"
                                        value={form.name ? form.name : ''}
                                        variant="standard"
                                        name="name"
                                        onChange={handleOnChange}
                                        inputProps={{
                                            style: {
                                                fontSize: 40,
                                                lineHeight: '50px',
                                            },
                                        }}
                                    />
                                </Stack>
                                <Stack spacing={1} direction="row" sx={{ alignItems: 'center' }}>
                                    <IconButton onClick={() => setOpenSetting(true)}>
                                        <SvgIcon>
                                            <DotsVertical />
                                        </SvgIcon>
                                    </IconButton>
                                    <Button variant="contained" color="success" onClick={handleSave} disabled={saved}>
                                        Save
                                    </Button>
                                    <Button variant="outlined" color="error" onClick={handleConfirmDelete}>
                                        Delete
                                    </Button>
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                value={form.description ? form.description : ''}
                                variant="standard"
                                name="description"
                                onChange={handleOnChange}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Box>
                            <Droppable droppableId="droppable">
                                {(provided) => (
                                    <Box ref={provided.innerRef}>
                                        {questions?.map((question, index) => (
                                            <Draggable key={question._id} draggableId={question._id} index={index}>
                                                {(provided, snapshot) => (
                                                    <Box
                                                        ref={provided.innerRef}
                                                        style={{ ...provided.draggableProps.style }}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        sx={{
                                                            outline: 'none',
                                                            py: 1.5,
                                                        }}
                                                    >
                                                        <QuestionCard
                                                            id={question._id}
                                                            key={question._id}
                                                            dragging={snapshot.isDragging}
                                                            onClick={() => handleOnClick(question._id)}
                                                        />
                                                    </Box>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </Box>
                                )}
                            </Droppable>

                            <Box
                                sx={{ '& > :not(style)': { m: 1 } }}
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Fab
                                    variant="extended"
                                    onClick={() => {
                                        handleAddQuestion();
                                    }}
                                >
                                    <AddIcon sx={{ mr: 1 }} />
                                    Add Question
                                </Fab>
                            </Box>
                        </Box>
                    </DragDropContext>
                </Grid>
            </Grid>
            <SettingDialog onSettingClose={onSettingClose} openSetting={openSetting} />
            <DeleteDialog onClose={onClose} open={open} id={id} />
        </>
    );
}

export default EditForm;
