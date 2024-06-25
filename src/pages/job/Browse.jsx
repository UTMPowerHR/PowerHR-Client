import { Grid, Stack } from '@mui/material';
import JobListSearch from './components/job-list-search';
import { useGetAllPostingsQuery, useGetIdPostingByApplicantQuery } from '@features/job/jobApiSlice';
import { setCompanies, setPostings } from '@features/job/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import CompanyCard from './components/companyCard';

export default function Browse() {
    const { data, isLoading } = useGetAllPostingsQuery();
    const dispatch = useDispatch();

    const userId = useSelector((state) => state.auth.user._id);

    const { data: listIdPosting, isLoading: postingLoading } = useGetIdPostingByApplicantQuery(userId);

    useEffect(() => {
        if (data) {
            dispatch(setCompanies(data));
        }
    }, [data, dispatch]);

    useEffect(() => {
        if (listIdPosting) {
            const list = listIdPosting?.map((application) => application.posting);
            dispatch(setPostings(list));
        }
    }, [listIdPosting, dispatch]);

    if (isLoading || postingLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Grid
                container
                spacing={{
                    xs: 3,
                    lg: 4,
                }}
            >
                <Grid item xs={12}>
                    <Stack spacing={4}>
                        <JobListSearch />
                        {data?.map((company, index) => (
                            <CompanyCard index={index} key={index} />
                        ))}
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
}
