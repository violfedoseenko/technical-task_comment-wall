import { configureStore } from '@reduxjs/toolkit'
import { CommentsSliceState, commentsSlice } from './CommentsSlice'
import { AuthorsSliceState, authorsSlice } from './AuthorsSlice'
import { useDispatch } from 'react-redux'


export interface IState {
    comments: CommentsSliceState,
	authors: AuthorsSliceState
}

export function createReduxStore(initialState?: IState) {
	return configureStore<IState>({
		reducer: {
			comments: commentsSlice.reducer,
			authors: authorsSlice.reducer
		},
	})
}

export const store = createReduxStore()

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()