import React, { ReactElement, useEffect } from 'react';
import CommentsWall from './components/CommentsWall/CommentsWall';
import { useSelector } from 'react-redux';
import { IState, useAppDispatch } from './store/store';
import Loader from './components/Loader/Loader';
import ErrorNotice from './components/ErrorNotice/ErrorNotice';
import "./App.scss";
import { fetchAuthors } from './store/AuthorsSlice';
import { fetchComments } from './store/CommentsSlice';

const App: React.FC = (): ReactElement => {
    const data = useSelector((store: IState) => store.comments.items.data)
    const commentsStatus = useSelector((store: IState) => store.comments.status)
    const authorsStatus = useSelector((store: IState) => store.authors.status)
    const { page, total_pages } = useSelector((store: IState) => store.comments.items.pagination)
    const dispatch = useAppDispatch()

    useEffect(()=> {
        dispatch(fetchAuthors())
        dispatch(fetchComments(page))
    }, [])

    if (commentsStatus === 'loading' || authorsStatus === 'loading') {
        return <Loader />
    }

    return (
        <div className="App">
            {(commentsStatus === 'success' && authorsStatus === 'success')
                ?   <CommentsWall comments={data}/>
                :   <ErrorNotice/>}
        </div>
    );
}

export default App;
function dispatch(arg0: any) {
    throw new Error('Function not implemented.');
}

