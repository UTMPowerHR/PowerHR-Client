'use client';

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
import { reorder } from '../../component/dragAndDrop';

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

export default function BasicEdit() {
    const data = useSelector((state) => state.applicant.resume);
    const titleColor = useSelector((state) => state.applicant.resume.template?.settings?.titleColor || '#2c3e50');
    const contentColor = useSelector((state) => state.applicant.resume.template?.settings?.contentColor || '#34495e');
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
        p: 5,
    };

    function onDragEnd(result) {
        const { source, destination } = result;

        const temp = cloneDeep(data);

        // dropped outside the list
        if (!destination) return;

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        const items = reorder(temp.template.pages[0].columns[0].list, source.index, destination.index);
        const newState = [...temp.template.pages[0].columns];
        newState[0].list = items;
        temp.template.pages[0].columns = newState;

        dispatch(setResume(temp));
    }

    return (
        <>
            <Paper sx={{ ...size, backgroundColor: 'white' }}>
                <Stack spacing={0}>
                    <Typography variant="h4" sx={{ color: titleColor }}>
                        {data.basicDetail.name}
                    </Typography>
                    <Typography variant="h6" sx={{ color: titleColor }}>
                        {data.basicDetail.title}
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Typography variant="body1" sx={{ color: contentColor }}>
                            {data.basicDetail.email}
                        </Typography>
                        {data.basicDetail.phone !== '' && (
                            <Typography variant="body1" sx={{ color: contentColor }}>
                                |
                            </Typography>
                        )}
                        <Typography variant="body1" sx={{ color: contentColor }}>
                            {data.basicDetail.phone}
                        </Typography>
                        {data.basicDetail.location !== '' && (
                            <Typography variant="body1" sx={{ color: contentColor }}>
                                |
                            </Typography>
                        )}
                        <Typography variant="body1" sx={{ color: contentColor }}>
                            {data.basicDetail.location}
                        </Typography>
                    </Stack>
                    <Typography variant="body1" sx={{ color: contentColor }}>
                        {data.basicDetail.websiteUrl.linkedin}
                    </Typography>
                </Stack>

                <Grid container spacing={2}>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Grid item xs={12}>
                            <Droppable droppableId="0">
                                {(provided) => (
                                    <Box ref={provided.innerRef} {...provided.droppableProps}>
                                        <Stack spacing={1} sx={{ mt: 2 }}>
                                            {data.template.pages[0]?.columns[0]?.list.map((item, index) => (
                                                <Draggable key={item.name} draggableId={item.name} index={index}>
                                                    {(provided) => (
                                                        <Box
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <Paper sx={{ backgroundColor: 'white' }}>
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
