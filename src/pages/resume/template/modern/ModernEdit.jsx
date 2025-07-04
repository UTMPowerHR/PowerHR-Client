import {
    Box,
    Grid,
    Paper,
    Stack,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import * as Card from './component';
import { useSelector, useDispatch } from 'react-redux';
import { setResume } from '../../../../features/applicant/applicantSlice';
import cloneDeep from 'lodash/cloneDeep';
import { useState, useEffect } from 'react';
import renderCard from '../../component/card';
import { reorder, move } from '../../component/dragAndDrop';

const cardList = [
    {
        name: 'summary',
        typeCard: ['string', 'point'],
    },
    {
        name: 'objective',
        typeCard: ['string', 'point'],
    },
    {
        name: 'experience',
        typeCard: ['timeline'],
    },
    {
        name: 'education',
        typeCard: ['timeline'],
    },
    {
        name: 'awards',
        typeCard: ['timeline'],
    },
    {
        name: 'languages',
        typeCard: ['score'],
    },
    {
        name: 'technicalSkills',
        typeCard: ['list', 'score'],
    },
    {
        name: 'softSkills',
        typeCard: ['list'],
    },
    {
        name: 'voluntering',
        typeCard: ['timeline'],
    },
    {
        name: 'references',
        typeCard: ['reference'],
    },
];

export default function ModernEdit() {
    const data = useSelector((state) => state.applicant.resume);
    const titleColor = useSelector((state) => state.applicant.resume.template?.setting?.titleColor || '#000000');
    const contentColor = useSelector((state) => state.applicant.resume.template?.setting?.contentColor || '#000000');
    const dispatch = useDispatch();

    const [open, setOpen] = useState(null);
    const [section, setSection] = useState(null);
    const [type, setType] = useState(null);

    const [availableSection, setAvailableSection] = useState([
        'summary',
        'objective',
        'experience',
        'education',
        'awards',
        'languages',
        'technicalSkills',
        'softSkills',
        'voluntering',
        'references',
    ]);

    useEffect(() => {
        // Remove section that already exist
        if (data) {
            const temp = [
                'summary',
                'objective',
                'experience',
                'education',
                'awards',
                'languages',
                'technicalSkills',
                'softSkills',
                'voluntering',
                'references',
            ];
            data.template.pages.forEach((page) => {
                page.columns.forEach((column) => {
                    column.list.forEach((item) => {
                        const index = temp.indexOf(item.name);
                        if (index !== -1) {
                            temp.splice(index, 1);
                        }
                    });
                });
            });
            setAvailableSection(temp);
            setSection(temp[0] || null);
            setType(cardList.find((item) => item.name === temp[0])?.typeCard[0] || null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    function addSection() {
        const temp = cloneDeep(data);

        const newItem = {
            name: section,
            typeCard: type,
        };

        temp.template.pages[0].columns[open].list.push(newItem);

        dispatch(setResume(temp));

        setOpen(null);
    }

    const size = {
        width: '8.27in',
        minHeight: '11.69in',
    };

    function onDragEnd(result) {
        const { source, destination } = result;

        const temp = cloneDeep(data);

        // dropped outside the list
        if (!destination) {
            return;
        }
        const sInd = +source.droppableId;
        const dInd = +destination.droppableId;

        if (sInd === dInd) {
            const items = reorder(temp.template.pages[0].columns[sInd].list, source.index, destination.index);
            const newState = [...temp.template.pages[0].columns];
            newState[sInd].list = items;
            temp.template.pages[0].columns = newState;
        } else {
            const result = move(
                temp.template.pages[0].columns[sInd].list,
                temp.template.pages[0].columns[dInd].list,
                source,
                destination,
            );
            const newState = [...temp.template.pages[0].columns];
            newState[sInd].list = result[sInd];
            newState[dInd].list = result[dInd];
            temp.template.pages[0].columns = newState;
        }

        dispatch(setResume(temp));
    }

    return (
        <>
            <Paper sx={{ ...size, backgroundColor: 'white' }}>
                <Box sx={{ backgroundColor: '#f5f5f5', p: 2 }}>
                    <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
                        <Stack sx={{ flexGrow: 1 }}>
                            <Typography variant="h4" id="title" sx={{ color: titleColor }}>
                                {data.basicDetail.name}
                            </Typography>
                            <Typography variant="h6" id="content" sx={{ color: titleColor }}>
                                {data.basicDetail.title}
                            </Typography>
                            <Stack direction="row" spacing={2}>
                                <Typography variant="body1" id="content" sx={{ color: contentColor }}>
                                    {data.basicDetail.email}
                                </Typography>
                                <Typography variant="body1" id="content" sx={{ color: contentColor }}>
                                    {data.basicDetail.phone}
                                </Typography>
                                <Typography variant="body1" id="content" sx={{ color: contentColor }}>
                                    {data.basicDetail.location}
                                </Typography>
                            </Stack>

                            <Typography variant="body1" id="content" sx={{ color: contentColor }}>
                                {data.basicDetail.websiteUrl.linkedin}
                            </Typography>
                        </Stack>
                        <Stack>
                            <Box
                                component="img"
                                src={data.basicDetail.imageURL}
                                alt="Profile"
                                sx={{
                                    width: 90,
                                    height: 90,
                                    borderRadius: '50%',
                                }}
                            />
                        </Stack>
                    </Stack>
                </Box>

                <Grid container spacing={2}>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Grid item xs={7}>
                            <Droppable droppableId="0">
                                {(provided) => (
                                    <Box ref={provided.innerRef} {...provided.droppableProps}>
                                        <Stack spacing={2}>
                                            {data.template.pages[0]?.columns[0]?.list.map((item, index) => (
                                                <Draggable key={item.name} draggableId={item.name} index={index}>
                                                    {(provided) => (
                                                        <Box
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <Paper sx={{ p: 2, backgroundColor: 'white' }}>
                                                                {renderCard(Card, item, 0, false, cardList)}
                                                            </Paper>
                                                        </Box>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </Stack>
                                    </Box>
                                )}
                            </Droppable>
                            <Box sx={{ mt: 2, mx: 2 }}>
                                <Button fullWidth variant="contained" onClick={() => setOpen(0)}>
                                    Add Section
                                </Button>
                            </Box>
                        </Grid>

                        <Grid item xs={5}>
                            <Droppable droppableId="1">
                                {(provided) => (
                                    <Box ref={provided.innerRef} {...provided.droppableProps}>
                                        <Stack spacing={2}>
                                            {data.template.pages[0]?.columns[1]?.list.map((item, index) => (
                                                <Draggable key={item.name} draggableId={item.name} index={index}>
                                                    {(provided) => (
                                                        <Box
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <Paper sx={{ p: 2, backgroundColor: 'white' }}>
                                                                {renderCard(Card, item, 1, false, cardList)}
                                                            </Paper>
                                                        </Box>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </Stack>
                                    </Box>
                                )}
                            </Droppable>
                            <Box sx={{ mt: 2, mx: 2 }}>
                                <Button fullWidth variant="contained" onClick={() => setOpen(1)}>
                                    Add Section
                                </Button>
                            </Box>
                        </Grid>
                    </DragDropContext>
                </Grid>
            </Paper>
            <Dialog open={open !== null} onClose={() => setOpen(null)} fullWidth>
                <DialogTitle>Add Section</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ p: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Section</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Section"
                                value={section || availableSection[0]}
                                onChange={(e) => setSection(e.target.value)}
                            >
                                {availableSection.map((item, index) => (
                                    <MenuItem key={index} value={item}>
                                        {item}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Type"
                                value={type || cardList.find((item) => item.name === section)?.typeCard[0]}
                                onChange={(e) => setType(e.target.value)}
                            >
                                {cardList
                                    .find((item) => item.name === section)
                                    ?.typeCard.map((item, index) => (
                                        <MenuItem key={index} value={item}>
                                            {item}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(null)}>Cancel</Button>
                    <Button onClick={addSection}>Add</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
