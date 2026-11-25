import { useState, useEffect } from 'react';
import supabase from "./config/supabaseClient"


const useFetch = (table, id = null) => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(()=> {
        const abortConst = new AbortController();

        setTimeout(()=> {
            let query = supabase.from(table).select().abortSignal(abortConst.signal);
            if(id) {
                query = query.eq('id', id).single();
            }
            query
                .then(({data,error}) => {
                    if(error) {
                        throw Error('could not fetch the data for that resource');
                    }
                    setData(data);
                    setIsPending(false);
                    setError(null);
                })
                .catch(err => {
                    if(abortConst.signal.aborted) {
                        console.log('fetch aborted')
                    } else {
                    setIsPending(false);
                    setError(err.message);
                    }
                });
        }, 1000);

        return () => abortConst.abort();
    }, [table, id]);

    return { data, isPending, error};
}

export default useFetch;