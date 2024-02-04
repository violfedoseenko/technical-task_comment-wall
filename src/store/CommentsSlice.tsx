import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import getCommentsRequest from '../api/comments/getCommentsRequest';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';


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

export type FetchCommentsPayload = {
	pagination: IPagination,
	data: IComment[]
}

export interface CommentsSliceState {
    items: ICommentsResponse<IComment[]>
    status: Status
	error: string | undefined
}

interface ChangeLikePayload {
	commentID: number;
	actionType: ActionType;
}

export enum ActionType {
	ADD_LIKE = 'add',
	DELETE_LIKE = 'delete'
}

interface IError {
	message: string;
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
  error: undefined
}

async function retryRequest (
		config: AxiosRequestConfig, 
		retries: number = 3, 
		delay: number = 500
	): Promise<AxiosResponse<FetchCommentsPayload>> {
    try {
        return await axios(config);
    } catch (error) {
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
            return retryRequest(config, retries - 1, delay);
        }

        throw error;
    }
};

async function getCommentsWithRetry(page: number) {
    try {
        return await getCommentsRequest(page);
    } catch (error) {
        // В случае ошибки, создаем конфигурацию запроса для повторной попытки
        const config = {
            url: `/api/comments`,
            method: 'get',
            params: { page }
        };
        // Повторяем запрос с помощью retryRequest
        const response = await retryRequest(config);
        return response.data;
    }
}

export const fetchComments = createAsyncThunk<FetchCommentsPayload, number, { rejectValue: IError }> (
    'comments/fetchComments',
    async (page: number, { rejectWithValue }) => {
        try { 
			const res = await getCommentsWithRetry(page)
			return res
		} catch (error: any) {
			console.log('error', error)
            return rejectWithValue({ message: error.message });
        }
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
			state.error = undefined
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
		builder.addCase(fetchComments.rejected, (state: CommentsSliceState, action: PayloadAction<IError | undefined>) => {
			state.status = Status.ERROR
			state.error = action.payload ? action.payload.message : 'Unknown error'
		})
	},
})

export const { changeLikeForComment } = commentsSlice.actions
export default commentsSlice.reducer

