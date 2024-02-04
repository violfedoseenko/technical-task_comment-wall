import {ReactComponent as HeartEmpty } from '../../assets/icons/heart-empty.svg';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { IState, useAppDispatch } from '../../store/store';
import Comment from '../Comment/Comment';
import { IComment, Status, fetchComments } from '../../store/CommentsSlice';
import { Button } from '../Button/Button';
import cls from './CommentsWall.module.scss';

interface ICommentsWallProps {
    comments: IComment[];
}

const CommentsWall: React.FC<ICommentsWallProps> = ({comments}) => {
    const dispatch = useAppDispatch()
    const { page, total_pages } = useSelector((store: IState) => store.comments.items.pagination)
    const commentsStatus = useSelector((store: IState) => store.comments.status)
    const [scrollPosition, setScrollPosition] = useState<number>(0);

    let topLevelComments = comments.filter(comment => comment.parent === null);

    useEffect(() => {
        // Восстановление позиции скролла
        window.scrollTo(0, scrollPosition);
    }, [ scrollPosition]); 


    const getTotalLikes = (arr: IComment[]): number=> {
        return arr.reduce((acc: number, val: IComment) => acc + val.likes, 0)
    }

    const onLoadComments = useCallback(async (): Promise<void> => {
        setScrollPosition(window.scrollY);

        await dispatch(fetchComments(page + 1))
    }, [dispatch, page]);

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
                    children={(commentsStatus === Status.LOADING) ? 'Идет загрузка' : 'Загрузить еще'}
                />
            </div>

        </div>
        
    );

}

export default CommentsWall