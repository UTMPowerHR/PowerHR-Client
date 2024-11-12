import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import TableDocument from './components/tableDocument';

function TransferKnowledge() {
    const { employeeId } = useParams();  // Get employeeId from the URL
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    console.log(employeeId);
    useEffect(() => {
        if (employeeId) {
            // Mock fetching employee data based on employeeId
            console.log(`Fetching data for employee with ID: ${employeeId}`);
            // Simulate setting the employee
            setSelectedEmployee({ id: employeeId, name: 'John Doe' }); // Replace with actual data fetching logic
        }
    }, [employeeId]);

    return (
        <>

            {selectedEmployee ? (
                <TableDocument selectedEmployeeId={selectedEmployee.id} />
            ) : (
                <p>Loading employee data...</p> // Loading state until employee data is available
            )}
        </>
    );
}

export default TransferKnowledge;
