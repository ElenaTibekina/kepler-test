import {Button, Input, Radio, Checkbox, Alert} from "antd";
import { useEffect, useState } from "react";
import { Step } from "./types";
import useSteps from './hooks/useSteps';

import styles from './Steps.module.css'

export const Steps = () => {
    const {
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
    } = useSteps();

    const [isNextDisabled, setIsNextDisabled] = useState<boolean>(true);

    useEffect(() => {
        validateStep();
    }, [currentStep, results]);

    const validateStep = () => {
        const currentStepObj = steps?.find((step: Step) => step['step number'] === currentStep);
        if (!currentStepObj) {
            setIsNextDisabled(true);
            return;
        }

        const result = results[currentStepObj.name];
        if (currentStepObj.question.type !== 'multi-choice') {
            setIsNextDisabled(!result);
        }
        else {
            setIsNextDisabled(!result || result.length === 0);
        }
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading steps: {error.message}</p>;
    if (currentStep === null) return <p>Initializing...</p>;

    const totalSteps = steps.length;
    const currentStepObj = steps.find(step => step['step number'] === currentStep);
    const currentStepIndex = steps.findIndex(step => step['step number'] === currentStep) + 1;

    return (
        <div className={styles.stepsContainer}>
            {steps?.length > 0 ? (
                <div>
                    {isSubmitted && (
                        <Alert closable message="Form submitted successfully! Thank you!" type="success" />
                    )}
                    {isSubmitted && error && (
                        <Alert closable message="Something went wrong, try again." type="error" />
                    )}
                    <div className={styles.stepsHeader}>
                        <h2>Let's measure your stress</h2>
                        <Button
                            type="primary"
                            onClick={() => {
                                setResults({});
                                setCurrentStep(steps[0]['step number']);
                                setIsSubmitted(false);
                            }}
                        >
                            Reset Form
                        </Button>
                    </div>
                    {currentStepObj.question.type === 'input' && (
                        <div className={styles.stepsInput}>
                            <p className={styles.inputTitle}>{currentStepObj.title}</p>
                            <Input
                                required
                                autoFocus
                                onKeyPress={(e) => e.key === 'Enter' && !isNextDisabled ? handleNext() : null}
                                type="text"
                                placeholder={currentStepObj.question.placeholder}
                                value={results[currentStepObj.name] || ''}
                                onChange={handleChange}
                            />
                        </div>
                    )}
                    {currentStepObj.question.type === 'numeric' && (
                        <div className={styles.numericInput}>
                            <p className={styles.inputTitle}>{currentStepObj.title}</p>
                            <Input
                                required
                                autoFocus
                                onKeyPress={(e) => e.key === 'Enter' && !isNextDisabled ? handleNext() : null}
                                type="number"
                                placeholder={currentStepObj.question.placeholder}
                                value={results[currentStepObj.name] || ''}
                                onChange={handleChange}
                                min="0"
                                max="100"
                            />
                        </div>
                    )}
                    {currentStepObj.question.type === 'single-choice' && (
                        <>
                            <p className={styles.inputTitle}>{currentStepObj.title}</p>
                            <Radio.Group
                                onChange={handleChange}
                                value={results[currentStepObj.name]}
                                disabled={isSubmitted}
                                name={currentStepObj.name}
                                className={styles.stepsInput}
                            >
                                {currentStepObj.question.options.map((option, index) => (
                                    <Radio key={index} value={option}>
                                        {option}
                                    </Radio>
                                ))}
                            </Radio.Group>
                        </>
                    )}
                    {currentStepObj.question.type === 'multi-choice' && (
                        <>
                            <p className={styles.inputTitle}>{currentStepObj.title}</p>
                            <Checkbox.Group
                                options={currentStepObj.question.options}
                                value={results[currentStepObj.name] || []}
                                onChange={(checkedValues) => handleCheckboxChange(checkedValues)}
                                className={styles.stepsInput}
                            />
                        </>
                    )}
                    <div className={styles.stepsCounter}>
                        <p>Step: {currentStepIndex}/{totalSteps}</p>
                    </div>
                    <div className={styles.buttonsContainer}>
                        <Button type="default" onClick={handlePrev} disabled={currentStep === steps[0]['step number'] || isSubmitted}>Previous</Button>
                        <Button type="default" onClick={handleNext} disabled={isNextDisabled || isSubmitted}>
                            {currentStep < steps[steps.length - 1]['step number'] ? 'Next' : 'Submit'}
                        </Button>
                    </div>
                </div>
            ) : (
                <Alert message="No steps available" type="error" />
            )}
        </div>
    );
}

