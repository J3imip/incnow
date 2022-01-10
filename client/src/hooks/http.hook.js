import {useState} from 'react';
import {toast} from 'react-toastify';

export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = async (url, method='GET', body=null, headers={}) => {
        setLoading(true);
        try {
            if(body) {
                body = JSON.stringify(body);
                headers['Content-Type'] = 'application/json';
            }
            const response = await fetch(url, {method, body, headers});

            const data = await response.json();
            if(!response.ok) {
                setLoading(false);
                toast.error(data.message);
                return;
            }

            setLoading(false);

            return data;
        } catch (error) {
            setLoading(false);
            setError(error.message);
            toast.error(error.message);
        }
    }

    const clearError = () => setError(null);


    return {loading, request, error}
}