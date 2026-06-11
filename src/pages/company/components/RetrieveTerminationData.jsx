import { Button, Typography, Stack, Paper } from '@mui/material';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { APPS_API_BASE_URL } from '../../../constants/env';

function RetrieveTerminationData({ completedCount, onMonthLoaded }) {
    const { token, user } = useSelector((state) => state.auth);
    const currentMonth = dayjs().format('MMM YYYY');
    const [workforceData, setWorkforceData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);

    const fetchTerminationData = async () => {
        try {
            const response = await fetch(`${APPS_API_BASE_URL}/retrieve-workforce-data?type=termination`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-User-Email': user?.email || '',
                },
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setWorkforceData(data.workforce_data || []);
        } catch (error) {
            console.error('Failed to fetch termination data:', error);
            setWorkforceData([]);
        }
    };

    useEffect(() => {
        fetchTerminationData();
    }, []);

    const entry = workforceData.find((e) => e.month === selectedMonth);
    const requiredTerminations = entry ? entry.count_this_month : 0;
    const isCurrentMonth = selectedMonth === currentMonth;
    const isPastMonth = dayjs(selectedMonth, 'MMM YYYY').startOf('month').isBefore(dayjs().startOf('month'));
    const isFutureMonth = dayjs(selectedMonth, 'MMM YYYY').startOf('month').isAfter(dayjs().startOf('month'));

    useEffect(() => {
        if (onMonthLoaded) onMonthLoaded(selectedMonth, requiredTerminations);
    }, [selectedMonth, workforceData]);

    const remaining = Math.max(requiredTerminations - completedCount, 0);

    // Current month: Required / Terminated / Remaining
    // Future month: Required only (no completed actions yet)
    // Past month: no counter (historical view)
    const counterBoxes = isCurrentMonth
        ? [
            { label: 'Required',   value: requiredTerminations, color: '#1976d2' },
            { label: 'Terminated', value: completedCount,        color: '#31d436' },
            { label: 'Remaining',  value: remaining,             color: remaining > 0 ? '#d32f2f' : '#31d436' },
        ]
        : isFutureMonth
        ? [
            { label: 'Required',   value: requiredTerminations, color: '#1976d2' },
        ]
        : [];

    const statusText = isPastMonth
        ? `Historical view — employees terminated in ${selectedMonth}`
        : requiredTerminations > 0
            ? `Termination Required: ${requiredTerminations} workers in ${selectedMonth}`
            : `No Termination Required in ${selectedMonth}`;

    const statusColor = isPastMonth ? 'text.secondary' : requiredTerminations > 0 ? 'error' : '#31d436';

    return (
        <Stack spacing={2} p={2}>
            {/* Single header row: status left, controls right */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                {/* Left: status + optional warning */}
                <Stack spacing={0.5}>
                    <Typography variant="h6" color={statusColor}>
                        {statusText}
                    </Typography>
                    {!isCurrentMonth && !isPastMonth && (
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
                    <Button variant="contained" color="primary" onClick={fetchTerminationData}>
                        Retrieve Termination Data
                    </Button>
                </Stack>
            </Stack>

            {/* Counter boxes — hidden for past months, shown for current/future when required > 0 */}
            {!isPastMonth && counterBoxes.length > 0 && (
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

export default RetrieveTerminationData;
