import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'react-query';
import {Result} from "../types";
import {getSteps, postResults} from "../stepsService";

const useSteps = () => {
    const { data: steps, error, isLoading } = useQuery('steps', getSteps);
    const [currentStep, setCurrentStep] = useState<number | null>(null);
    const [results, setResults] = useState<Result | {}>({});
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

    const mutation = useMutation({
        mutationFn: postResults,
        onSuccess: () => {
            setIsSubmitted(true);
            setResults({});
        },
        onError: (err) => {
            console.error('Error submitting results:', err);
            alert('Failed to submit form');
        },
    });

    useEffect(() => {
        if (steps && steps.length > 0) {
            setCurrentStep(steps[0]['step number']);
        }
    }, [steps]);

    const handleResultsChange = (stepName, answer) => {
        setResults((prevResults) => ({
            id: Date.now(),
            ...prevResults,
            [stepName]: answer,
        }));
    };

    const handleSubmit = () => {
        mutation.mutate(results);
    };

    const handleNext = () => {
        if (currentStep < steps[steps.length - 1]['step number']) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit();
        }
    };

    const handlePrev = () => {
        if (currentStep > steps[0]['step number']) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleChange = (e) => {
        const currentStepObj = steps.find(step => step['step number'] === currentStep);
        handleResultsChange(currentStepObj.name, e.target.value);
    };

    const handleCheckboxChange = (checkedValues) => {
        const currentStepObj = steps.find(step => step['step number'] === currentStep);
        handleResultsChange(currentStepObj.name, checkedValues);
    };

    return {
        steps,
        error,
        isLoading,
        currentStep,
        results,
        isSubmitted,
        setResults,
        setCurrentStep,
        setIsSubmitted,
        handleNext,
        handlePrev,
        handleChange,
        handleCheckboxChange,
        handleSubmit,
    };
};

export default useSteps;
