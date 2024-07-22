import { useCallback, useMemo, useState } from 'react';
import CheckIcon from '@untitled-ui/icons-react/build/esm/Check';
import { Avatar, Step, StepContent, StepLabel, Stepper, SvgIcon, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import JobCategory from './jobCategory';
import JobDetails from './jobDetail';
import JobDescription from './jobDescription';
import JobRequirement from './jobRequirement';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreatePostingMutation, useGetPostingMutation, useUpdatePostingMutation } from '@features/job/jobApiSlice';
import { useSelector } from 'react-redux';
import PATHS from '@constants/routes/paths';
import { useEffect } from 'react';
import { setAllCreate } from '@features/job/jobSlice';
import { useDispatch } from 'react-redux';

function StepIcon(props) {
    const { active, completed, icon } = props;

    const highlight = active || completed;

    return (
        <Avatar
            sx={{
                height: 40,
                width: 40,
                ...(highlight && {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                }),
            }}
            variant="rounded"
        >
            {completed ? (
                <SvgIcon>
                    <CheckIcon />
                </SvgIcon>
            ) : (
                icon
            )}
        </Avatar>
    );
}

StepIcon.propTypes = {
    active: PropTypes.bool,
    completed: PropTypes.bool,
    icon: PropTypes.node,
};

function JobForm() {
    const { id } = useParams('id');

    const [activeStep, setActiveStep] = useState(0);
    const user = useSelector((state) => state.auth.user);
    const create = useSelector((state) => state.job.create);
    const [createPostingMutation] = useCreatePostingMutation();
    const [getPostingMutation] = useGetPostingMutation();
    const [updatePostingMutation] = useUpdatePostingMutation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleNext = useCallback(() => {
        setActiveStep((prevState) => prevState + 1);
    }, []);

    const handleBack = useCallback(() => {
        setActiveStep((prevState) => prevState - 1);
    }, []);

    useEffect(() => {
        const fetch = async () => {
            try {
                if (id !== undefined) {
                    const data = await getPostingMutation(id).unwrap();
                    dispatch(
                        setAllCreate({
                            title: data.job.title,
                            category: data.job.employmentType,
                            tags: data.tags,
                            description: data.description,
                            qualification: data.qualification,
                            experience: [data.experience.min, data.experience.max],
                            salaryRange: [data.salaryRange.min, data.salaryRange.max],
                            languages: data.languages,
                            softSkills: data.softSkills,
                            technicalSkills: data.technicalSkills,
                            gender: data.gender,
                            environment: data.job.environment,
                            industry: data.job.industry,
                            quota: data.quota,
                            jobId: data.job._id,
                        }),
                    );
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetch();
    }, [dispatch, getPostingMutation, id]);

    const handleSubmit = useCallback(async () => {
        try {
            if (id === undefined) {
                await createPostingMutation({
                    create,
                    userId: user._id,
                    companyId: user.company,
                }).unwrap();
                navigate(PATHS.JOB.LIST);
            } else {
                await updatePostingMutation({
                    id,
                    create,
                    jobId: create.jobId,
                }).unwrap();
                navigate(PATHS.JOB.LIST);
            }
        } catch (error) {
            console.log(error);
        }
    }, [create, createPostingMutation, id, navigate, updatePostingMutation, user._id, user.company]);

    const steps = useMemo(
        () => [
            {
                label: 'Job Category',
                content: <JobCategory onNext={handleNext} />,
            },
            {
                label: 'Job Details',
                content: <JobDetails onBack={handleBack} onNext={handleNext} />,
            },
            {
                label: 'Job Requirements',
                content: <JobRequirement onBack={handleBack} onNext={handleNext} />,
            },
            {
                label: 'Job Description',
                content: <JobDescription onBack={handleBack} onNext={handleSubmit} edit={id !== undefined} />,
            },
        ],
        [handleBack, handleNext, handleSubmit, id],
    );

    return (
        <Stepper
            activeStep={activeStep}
            orientation="vertical"
            sx={{
                '& .MuiStepConnector-line': {
                    borderLeftColor: 'divider',
                    borderLeftWidth: 2,
                    ml: 1,
                },
            }}
        >
            {steps.map((step, index) => {
                const isCurrentStep = activeStep === index;

                return (
                    <Step key={step.label}>
                        <StepLabel StepIconComponent={StepIcon}>
                            <Typography sx={{ ml: 2 }} variant="overline">
                                {step.label}
                            </Typography>
                        </StepLabel>
                        <StepContent
                            sx={{
                                borderLeftColor: 'divider',
                                borderLeftWidth: 2,
                                ml: '20px',
                                ...(isCurrentStep && {
                                    py: 4,
                                }),
                            }}
                        >
                            {step.content}
                        </StepContent>
                    </Step>
                );
            })}
        </Stepper>
    );
}

export default JobForm;
