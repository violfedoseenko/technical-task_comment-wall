import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import getCommentsRequest from '../api/comments/getCommentsRequest';


export enum Status {
    LOADING = 'loading',
    SUCCESS = 'success',
    ERROR = 'error',
}

export interface IComment {
	id: number,
	created: string,
	text: string,
	author: number,
	parent: number | null,
	likes: number,
}

interface IPagination {
	page: number;
	size: number | undefined;
	total_pages: number | undefined;
}

interface ICommentsResponse<T> {
    pagination: IPagination;
    data: T;
}

type FetchCommentsPayload = {
	pagination: IPagination,
	data: IComment[]
}

export interface CommentsSliceState {
    items: ICommentsResponse<IComment[]>
    status: Status
}

interface ChangeLikePayload {
  commentID: number;
  actionType: ActionType;
}

export enum ActionType {
  ADD_LIKE = 'add',
  DELETE_LIKE = 'delete'
}

const initialState: CommentsSliceState = {
  items: {
		pagination: {
			page: 1,
			size: 6,
        	total_pages: undefined,
		},
		data: []
  },

  status: Status.LOADING,
}

export const fetchComments = createAsyncThunk(
    'comments/fetchComments',
    async (page: number) => {
		console.log("page", page)
        const res = await getCommentsRequest(page)
		console.log("res", res)
		return res
    }
)

export const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
		changeLikeForComment(state: CommentsSliceState, action: PayloadAction<ChangeLikePayload>) {
			const comment = state.items.data.find(item => item.id === action.payload.commentID) as IComment;
      		if (action.payload.actionType === 'add') {
        		comment.likes += 1;
			} else comment.likes -= 1;
		}
    },
	extraReducers: (builder) => {
		builder.addCase(fetchComments.pending, (state: CommentsSliceState) => {
			state.status = Status.LOADING
		})
		builder.addCase(fetchComments.fulfilled, (state: CommentsSliceState, action: PayloadAction<FetchCommentsPayload>) => {
			state.items.data = [...state.items.data, ...action.payload.data]
			console.log('action.payload', action.payload)
			state.items.pagination.total_pages = action.payload.pagination.total_pages
			state.items.pagination.size = action.payload.pagination.size
			state.items.pagination.page = action.payload.pagination.page
			state.status = Status.SUCCESS
		})
		builder.addCase(fetchComments.rejected, (state: CommentsSliceState) => {
			// state.items.data = []
			state.status = Status.ERROR
		})
	},
})

export const { changeLikeForComment } = commentsSlice.actions
export default commentsSlice.reducer

