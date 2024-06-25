import { useCallback, useState } from 'react';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import { Button, Tooltip, SvgIcon } from '@mui/material';
import AddForm from './add-dialog';

const AddButton = () => {
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpen = useCallback(() => {
        setOpenDialog(true);
    }, []);

    const handleClose = useCallback(() => {
        setOpenDialog(false);
    }, []);

    return (
        <>
            <Tooltip title="Search">
                <Button
                    startIcon={
                        <SvgIcon>
                            <PlusIcon />
                        </SvgIcon>
                    }
                    variant="contained"
                    onClick={handleOpen}
                >
                    Add
                </Button>
            </Tooltip>
            <AddForm onClose={handleClose} open={openDialog} />
        </>
    );
};

export default AddButton;
