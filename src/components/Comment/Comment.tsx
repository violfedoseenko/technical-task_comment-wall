import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { IComment } from '../../store/CommentsSlice'
import { IAuthor } from '../../store/AuthorsSlice'
import {ReactComponent as HeartFull} from '../../assets/icons/heart-full.svg'
import {ReactComponent as HeartEmpty } from '../../assets/icons/heart-empty.svg'
import Likes from '../Likes/Likes'
import cls from './Comment.module.scss'
import { IState } from '../../store/store'
import { timeDifferenceConversion } from '../../lib/timeDifferenceConversion'

interface CommentProps {
    comment: IComment;
    level: number
}

const Comment: React.FC<CommentProps>  = ({
    comment,
    level
}) => {
    const dispatch = useDispatch()
    const data = useSelector((store: IState) => store.comments.items.data)
    const childComments = data.filter(item => item.parent === comment.id);
    const authors = useSelector((store: IState) => store.authors.items)

    const compareUserInfoById = (userId: number): IAuthor => {
        return authors.find(item => item.id === userId) as IAuthor
    }


//   const onClickAdd = () => {
//     const item: TCartItem = {
//       id,
//       title,
//       price,
//       imageUrl,
//       type: typeNames[activeType],
//       size: activeSize,
//       count: 0,
//     }
//     dispatch(addItem(item))
//   }

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