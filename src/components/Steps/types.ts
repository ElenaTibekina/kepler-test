export type Question = {
    type: 'input' | 'numeric' | 'single-choice' | 'multi-choice';
    placeholder?: string;
    options?: string[];
};

export type Step = {
    stepNumber: number;
    title: string;
    name: string;
    question: Question;
};

export type Result = {
    id: number;
    name?: string;
    age?: string;
    stressLevel?: string;
    stressFactors?: string[];
    activitiesToManageStress?: string[];
    frequency?: string;
};

export type Results = Result[]