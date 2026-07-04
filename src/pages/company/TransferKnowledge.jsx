import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import TableDocument from './components/tableDocument';
import { setEmployees } from '@features/company/companySlice';
import { useDispatch, useSelector } from 'react-redux';
import { useGetCompanyProfileQuery, useGetEmployeesQuery } from '@features/company/companyApiSlice';

function TransferKnowledge() {
    const { employeeId } = useParams();  // Get employeeId from the URL
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const user = useSelector((state) => state.auth.user);
    const employees = useSelector((state) => state.company.employees);
    const dispatch = useDispatch();
    const { data, isSuccess } = useGetEmployeesQuery(user.company);

    useEffect(() => {
        if (isSuccess) {
            dispatch(setEmployees(data.employees));
        }
    }, [data, dispatch, isSuccess]);

    useEffect(() => {
        if (employeeId && employees?.length > 0) {
            const employee = employees.find((employee) => employee._id == employeeId);
            setSelectedEmployee({ id: employee._id, name: employee.firstName + " " + employee.lastName, 
                                  email: employee.email,
                                  terminationDate: employee.terminationDate,
                                  department: employee.department,
                                }); // Replace with actual data fetching logic
        }
    }, [employeeId, employees]);
    
    return (
        <>

            {selectedEmployee ? (
                <TableDocument selectedEmployee={selectedEmployee} />
            ) : (
                <> </>
            )}
        </>
    );
}

export default TransferKnowledge;
