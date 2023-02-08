import { useState, useCallback } from 'react';

const useFetch = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);


    const fetchData = useCallback(async (url, reqOptions) => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch(url, reqOptions);
            if (!response.ok) {
                switch (response.status) {
                    case 401:
                        throw new Error('Bad fetch response')
                    case 404:
                        return { error: response.status, message: 'Bad fetch response' };
                    case 500: 
                        return { error: response.status, message: 'Bad fetch response' };
                    default:
                        break;
                }
            }
            const json = await response.json();
            return json;
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, []);

    return { fetchData, error, loading };
};
export default useFetch;