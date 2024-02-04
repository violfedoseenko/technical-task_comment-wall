import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import {ReactComponent as HeartFull} from '../../assets/icons/heart-full.svg';
import {ReactComponent as HeartEmpty } from '../../assets/icons/heart-empty.svg';
import cls from './Likes.module.scss'
import { ActionType, changeLikeForComment } from '../../store/CommentsSlice';


interface LikesProps {
	likes: number,
	commentID: number
}

const Likes: React.FC<LikesProps> = (
	{ likes, commentID }
	) => {
	const [ myLike, setMyLike ] = useState<number>(likes)
	const [ heart, setHeart ] = useState<boolean>(false)

	const dispatch = useDispatch()

	const addLike = (): void => {
		setMyLike( prev => prev + 1)
		setHeart(true)
		dispatch(changeLikeForComment({commentID: commentID, actionType: ActionType.ADD_LIKE}))
	}

	const deleteLike = (): void => {
		setMyLike( prev => prev - 1)
		setHeart(false)
		dispatch(changeLikeForComment({commentID: commentID, actionType: ActionType.DELETE_LIKE}))
	}

    return (
        <div className={cls.likes_block}>
			<div className={cls.heart_img}>
				{(heart)
					?	<HeartFull 
							className={cls.like}
							onClick={deleteLike}
						/>
					: 	<HeartEmpty 
							className={cls.like}
							onClick={addLike}
						/>
				}
			</div>
			<div className={cls.likes}>{ myLike }</div>
        </div>
    )
}

export default Likes