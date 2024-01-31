import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import getAuthorsRequest from '../api/authors/getAuthorsRequest';

export enum Status {
	LOADING = 'loading',
	SUCCESS = 'success',
	ERROR = 'error',
}

export interface IAuthor {
	id: number,
	name: string,
	avatar: string,
}

export interface AuthorsSliceState {
	items: IAuthor[],
	status: Status,
}

const initialState: AuthorsSliceState = {
	items: [],
	status: Status.LOADING,
}

export const fetchAuthors = createAsyncThunk<IAuthor[], void > (
	'authors/fetchAuthors',
	async () => {
		const data  = await getAuthorsRequest()
		return data
	}
)

export const authorsSlice = createSlice({
	name: 'authors',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(fetchAuthors.pending, (state: AuthorsSliceState) => {
			state.status = Status.LOADING
			state.items = []
		})
		builder.addCase(fetchAuthors.fulfilled, (state: AuthorsSliceState, action: PayloadAction<IAuthor[]>) => {
			state.items = action.payload
			state.status = Status.SUCCESS
		})
		builder.addCase(fetchAuthors.rejected, (state: AuthorsSliceState) => {
			state.items = []
			state.status = Status.ERROR
		})
	},
})

export default authorsSlice.reducer

