import {ReactComponent as HeartFull} from '../../assets/icons/heart-full.svg';
import {ReactComponent as HeartEmpty } from '../../assets/icons/heart-empty.svg';
import { useEffect, useState } from 'react';
import { IAuthor, fetchAuthors } from '../../store/AuthorsSlice'
import { useSelector } from 'react-redux'
import { IState, useAppDispatch } from '../../store/store'
import cls from './CommentsWall.module.scss';
import Comment from '../Comment/Comment';

import testImg from "../../assets/avatars/yoda.jpeg"
import { IComment, fetchComments } from '../../store/CommentsSlice';
import Loader from '../Loader/Loader';
import ErrorNotice from '../ErrorNotice/ErrorNotice';
import { Button } from '../Button/Button';

interface ICommentsWallProps {
    comments: IComment[];
}

const CommentsWall: React.FC<ICommentsWallProps> = ({comments}) => {
    const dispatch = useAppDispatch()
    const { page, total_pages } = useSelector((store: IState) => store.comments.items.pagination)
    // const commentsStatus = useSelector((store: IState) => store.comments.status)
    // const authorsStatus = useSelector((store: IState) => store.authors.status)
    const [scrollPosition, setScrollPosition] = useState<number>(0);

    let topLevelComments = comments.filter(comment => comment.parent === null);
    let currentScrollPosition

    // useEffect(()=> {
    //     dispatch(fetchAuthors())
    //     dispatch(fetchComments(page))
    // }, [])

    // const restoreScrollPosition = (scrollPosition) => {
    //     // setTimeout для убеждения, что DOM уже обновился
    //     setTimeout(() => {
    //         window.scrollTo(0, scrollPosition);
    //     }, 0);

    useEffect(() => {
        // Восстановление позиции скролла
        window.scrollTo(0, scrollPosition);
    }, [comments, scrollPosition]); 


    const getTotalLikes = (arr: IComment[]): number=> {
        return arr.reduce((acc: number, val: IComment) => acc + val.likes, 0)
    }

    const onLoadComments = async (): Promise<void> => {
        setScrollPosition(window.scrollY);

        await dispatch(fetchComments(page + 1))
    }

    // if (commentsStatus === 'loading' || authorsStatus === 'loading') {
    //     return <Loader />
    // }

    return (

        <div className={cls.container}>

            <div className={cls.header}>
                <div className={cls.header_totalComments}>{`${comments.length} комментариев`}</div>

                <div className={cls.header_totalLikes}>
                    <HeartEmpty className={cls.icon}/>
                    <span>{`${getTotalLikes(comments)} лайков`}</span>
                </div>
            </div>
            
            <div className={cls.comments}>
                {topLevelComments.map((comment: IComment) => 
                // Отрисовка каждого комментария верхнего уровня
                    <Comment key={comment.id} comment={comment} level={0}/>
                )}
            </div>

            <div className={cls.button_container}>
                <Button 
                    onClick={onLoadComments}
                    disabled={(total_pages && page >= total_pages) ? true : false}
                    children='Загрузить еще'
                />
            </div>

        </div>
        
    );

}

export default CommentsWall