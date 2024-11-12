import { useState } from 'react';
import TableEmployee from './components/terminateTableEmployee';
import TableDocument from './components/tableDocument';

function TransferKnowledge() {
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const handleEmployeeSelect = (employee) => {
        setSelectedEmployee(employee);
    };

    return (
        <>
            {selectedEmployee ? (
                <TableDocument employee={selectedEmployee} />
            ) : (
                <TableEmployee onEmployeeSelect={handleEmployeeSelect} />
            )}
        </>
    );
}

export default TransferKnowledge;
