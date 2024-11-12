import {
    Card,
    Checkbox,
    Divider,
    IconButton,
    OutlinedInput,
    Stack,
    SvgIcon,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Button,
} from '@mui/material';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Scrollbar } from '@components/scrollbar';
import { useGetEmployeesQuery } from '@features/company/companyApiSlice';
import { setEmployees } from '@features/company/companySlice';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

function TerminateEmployee() {
    const user = useSelector((state) => state.auth.user);
    const employees = useSelector((state) => state.company.employees);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data, isSuccess } = useGetEmployeesQuery(user.company);

    useEffect(() => {
        if (isSuccess) {
            dispatch(setEmployees(data.employees));
        }
    }, [data, dispatch, isSuccess]);

    const handleManageDocument = (id) => {
        navigate(`/company/transferknowledge/${id}`);
    };

    return (
        <Card>
            <Stack direction="row" justifyContent="space-between" alignItems="center" p={2}>
                <Typography variant="h5">Employees</Typography>
                <OutlinedInput
                    placeholder="Search"
                    startAdornment={
                        <SvgIcon fontSize="small" color="action">
                            <SearchMdIcon />
                        </SvgIcon>
                    }
                />
            </Stack>
            <Divider />
            <Scrollbar>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox"><Checkbox /></TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Joined</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees.map((employee) => (
                            <TableRow key={employee._id}>
                                <TableCell padding="checkbox"><Checkbox /></TableCell>
                                <TableCell>{employee.firstName + ' ' + employee.lastName}</TableCell>
                                <TableCell>{employee.email}</TableCell>
                                <TableCell>{employee.hireDate && dayjs(employee.hireDate).format('DD MMM YYYY')}</TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={() => handleManageDocument(employee._id)}
                                    >
                                        Manage Document
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Scrollbar>
        </Card>
    );
}

export default TerminateEmployee;
