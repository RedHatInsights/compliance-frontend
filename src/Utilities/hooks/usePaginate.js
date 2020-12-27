import { useState } from 'react';

const pageToLimitAndOffset = ({ page, perPage }) => ({
    limit: perPage,
    offset: ((page - 1) * perPage)
});

const usePaginate = () => {
    const initialState = {
        perPage: 10,
        page: 1
    };
    const [state, setPage] = useState(initialState);
    const params = pageToLimitAndOffset(state);

    return [
        state,
        setPage,
        params
    ];
};

export default usePaginate;
