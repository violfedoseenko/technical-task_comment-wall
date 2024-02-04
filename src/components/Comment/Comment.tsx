import React from 'react';
import { useSelector } from 'react-redux';
import { IComment } from '../../store/CommentsSlice';
import { IAuthor } from '../../store/AuthorsSlice';
import Likes from '../Likes/Likes';
import { IState } from '../../store/store';
import { timeDifferenceConversion } from '../../lib/timeDifferenceConversion';
import cls from './Comment.module.scss';

interface CommentProps {
    comment: IComment;
    level: number
}

const Comment: React.FC<CommentProps>  = ({
    comment,
    level
}) => {
    const data = useSelector((store: IState) => store.comments.items.data)
    const childComments = data.filter(item => item.parent === comment.id);
    const authors = useSelector((store: IState) => store.authors.items)

    const compareUserInfoById = (userId: number): IAuthor => {
        return authors.find(item => item.id === userId) as IAuthor
    }

    return (
        <section>
            <div className={cls.comment}>
                <img src={compareUserInfoById(comment.author)?.avatar} alt='avatar' className={cls.comment_avatar}/>
                <div className={cls.comment_data}>
                    <div className={cls.comment_data__header}>
                        <div className={cls.comment_metadata}>
                            <div className={cls.user}>{compareUserInfoById(comment.author)?.name}</div>
                            <div className={cls.time}>{timeDifferenceConversion(comment.created)}</div>
                        </div>
                        <Likes 
                            likes = {comment.likes}
                            commentID = {comment.id}
                        />
                    </div>
                    <div className={cls.comment_data__content}>
                        {comment.text}
                    </div>
                </div>
            </div>
            {childComments.map(childComment => (
                    <div 
                        key={childComment.id}
                        className={(level===1) ? cls.nested : ''}
                        // style={{ marginLeft: `${level * 20}px`}} // лесенка
                    >
                        <Comment comment={childComment} level={level+1}/>
                    </div>
                ))}
        </section>
    )
}

export default Comment