import React, { ReactElement, useEffect } from 'react';
import CommentsWall from './components/CommentsWall/CommentsWall';
import { useSelector } from 'react-redux'
import { IState, useAppDispatch } from './store/store';
import Loader from './components/Loader/Loader';
import ErrorNotice from './components/ErrorNotice/ErrorNotice';
import { fetchAuthors } from './store/AuthorsSlice';
import { Status, fetchComments } from './store/CommentsSlice';
import "./App.scss";


const App: React.FC = (): ReactElement => {

    const data = useSelector((store: IState) => store.comments.items.data)
    const commentsStatus = useSelector((store: IState) => store.comments.status)
    const commentsError = useSelector((store: IState) => store.comments.error)
    const authorsStatus = useSelector((store: IState) => store.authors.status)
    const authorsError = useSelector((store: IState) => store.authors.error)
    const { page } = useSelector((store: IState) => store.comments.items.pagination)
    const dispatch = useAppDispatch()

    useEffect(()=> {
        dispatch(fetchAuthors())
        dispatch(fetchComments(page))
    }, [])

    if (commentsError || authorsError) {
        return (
            <div className="App">
                <ErrorNotice/>
            </div>
        )
    }

    return (
        <div className="App">
            { ((commentsStatus === Status.LOADING || authorsStatus === Status.LOADING) && data.length === 0 )
                ?   <Loader />
                :   <CommentsWall comments={data}/>
            }
        </div>
    )
}

export default App;
