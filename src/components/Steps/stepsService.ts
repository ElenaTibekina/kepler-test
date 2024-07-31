import axios from "axios";
import {Results} from "src/components/Steps/types";

export const getSteps = async () => {
    try {
        const response = await axios.get('http://localhost:3001/steps');
        return response.data;
    } catch (error) {
        throw new Error('Error getting steps')
    }
}

export const postResults = async (results: Results) => {
    try {
        const response = await axios.post('http://localhost:3001/results', results);
        return response.data;
    } catch (error) {
        throw new Error('Error posting result')
    }
}