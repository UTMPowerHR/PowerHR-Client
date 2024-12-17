import { useState, useEffect } from 'react';
import TableDocument from './components/tableDocument';
import { useDispatch, useSelector } from 'react-redux';

function FinalSettlement() {
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const user = useSelector((state) => state.auth.user);

  
    return (
        <>

        </>
    );
}

export default FinalSettlement;
