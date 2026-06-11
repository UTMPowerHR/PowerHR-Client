import { Button, Typography, Stack, Paper } from '@mui/material';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { APPS_API_BASE_URL } from '../../../constants/env';

function RetrieveRehireData({ completedCount, onMonthLoaded }) {
    const { token, user } = useSelector((state) => state.auth);
    const currentMonth = dayjs().format('MMM YYYY');
    const [workforceData, setWorkforceData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);

    const fetchRehireData = async () => {
        try {
            const response = await fetch(`${APPS_API_BASE_URL}/retrieve-workforce-data?type=rehire`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-User-Email': user?.email || '',
                },
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setWorkforceData(data.workforce_data || []);
        } catch (error) {
            console.error('Failed to fetch rehire data:', error);
            setWorkforceData([]);
        }
    };

    useEffect(() => {
        fetchRehireData();
    }, []);

    const entry = workforceData.find((e) => e.month === selectedMonth);
    const requiredRehirings = entry ? entry.count_this_month : 0;
    const isCurrentMonth = selectedMonth === currentMonth;

    useEffect(() => {
        if (onMonthLoaded) onMonthLoaded(selectedMonth, requiredRehirings);
    }, [selectedMonth, workforceData]);

    const remaining = Math.max(requiredRehirings - completedCount, 0);

    const counterBoxes = [
        { label: 'Required',  value: requiredRehirings, color: '#1976d2' },
        { label: 'Rehired',   value: isCurrentMonth ? completedCount : 0, color: '#31d436' },
        { label: 'Remaining', value: isCurrentMonth ? remaining : requiredRehirings, color: (isCurrentMonth ? remaining : requiredRehirings) > 0 ? '#d32f2f' : '#31d436' },
    ];

    return (
        <Stack spacing={2} p={2}>
            {/* Single header row: status left, controls right */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                {/* Left: status + optional warning */}
                <Stack spacing={0.5}>
                    <Typography variant="h6" color={requiredRehirings > 0 ? 'error' : '#31d436'}>
                        {requiredRehirings > 0
                            ? `Rehiring Required: ${requiredRehirings} workers in ${selectedMonth}`
                            : `No Rehiring Required in ${selectedMonth}`}
                    </Typography>
                    {!isCurrentMonth && (
                        <Typography variant="caption" color="warning.main">
                            Viewing {selectedMonth} — actions only available for current month ({currentMonth})
                        </Typography>
                    )}
                </Stack>

                {/* Right: month picker + optional back button + retrieve */}
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    {!isCurrentMonth && (
                        <Button size="small" variant="outlined" onClick={() => setSelectedMonth(currentMonth)}>
                            Current Month
                        </Button>
                    )}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            views={['year', 'month']}
                            openTo="month"
                            label="Filter by Month"
                            value={dayjs(selectedMonth, 'MMM YYYY')}
                            onChange={(newValue) => {
                                if (newValue && newValue.isValid()) {
                                    setSelectedMonth(newValue.format('MMM YYYY'));
                                }
                            }}
                            slotProps={{ textField: { size: 'small', sx: { width: 170 } } }}
                        />
                    </LocalizationProvider>
                    <Button variant="contained" color="primary" onClick={fetchRehireData}>
                        Retrieve Rehire Data
                    </Button>
                </Stack>
            </Stack>

            {/* Counter boxes — only show when there is a requirement */}
            {requiredRehirings > 0 && (
                <Stack direction="row" spacing={2}>
                    {counterBoxes.map((box) => (
                        <Paper
                            key={box.label}
                            elevation={3}
                            sx={{
                                flex: 1,
                                py: 2,
                                textAlign: 'center',
                                borderTop: `4px solid ${box.color}`,
                                borderRadius: 2,
                                background: '#1a2035',
                            }}
                        >
                            <Typography variant="h3" fontWeight="bold" color={box.color}>
                                {box.value}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mt={0.5}>
                                {box.label}
                            </Typography>
                        </Paper>
                    ))}
                </Stack>
            )}
        </Stack>
    );
}

export default RetrieveRehireData;
