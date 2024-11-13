import {
    Card,
    Checkbox,
    Divider,
    InputAdornment,
    OutlinedInput,
    Stack,
    SvgIcon,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import { useState } from 'react';
import { Scrollbar } from '@components/scrollbar';
import dayjs from 'dayjs';

function rehireRecommendation() {

    const [recommendedEmployees, setRecommendedEmployees] = useState([]); // State for recommended 

    return (
        <>
            {/* Recommended Rehires Table */}
            <Divider sx={{ mt: 4 }} />
            <Stack spacing={2} sx={{ mt: 2, p: 2 }}>
                <Typography variant="h6">Recommended to Rehire</Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={recommendedEmployees.length === 0}
                    >
                        {`Workers to Rehire: ${recommendedEmployees.length}`}
                    </Button>
                </Stack>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Joined</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {recommendedEmployees.map((employee) => (
                            <TableRow key={employee._id}>
                                <TableCell>{`${employee.firstName} ${employee.lastName}`}</TableCell>
                                <TableCell>{employee.email}</TableCell>
                                <TableCell>{employee.jobTitle}</TableCell>
                                <TableCell>{dayjs(employee.hireDate).format('DD MMM YYYY')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Stack>
        </>
    );
}

export default rehireRecommendation;