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
	error: string | undefined
}

const initialState: AuthorsSliceState = {
	items: [],
	status: Status.LOADING,
	error: undefined
}

interface IError {
	message: string;
}

export const fetchAuthors = createAsyncThunk<IAuthor[], void, { rejectValue: IError } > (
	'authors/fetchAuthors',
	async (_, { rejectWithValue }) => {
		try {
			const data  = await getAuthorsRequest()
			return data
		} catch (error: any) {
            return rejectWithValue({ message: error.message });
        }
	}
)

export const authorsSlice = createSlice({
	name: 'authors',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(fetchAuthors.pending, (state: AuthorsSliceState) => {
			state.error = undefined
			state.status = Status.LOADING
			state.items = []
		})
		builder.addCase(fetchAuthors.fulfilled, (state: AuthorsSliceState, action: PayloadAction<IAuthor[]>) => {
			state.items = action.payload
			state.status = Status.SUCCESS
		})
		builder.addCase(fetchAuthors.rejected, (state: AuthorsSliceState, action: PayloadAction<IError | undefined>) => {
			state.items = []
			state.status = Status.ERROR
			state.error = action.payload ? action.payload.message : 'Unknown error'
		})
	},
})

export default authorsSlice.reducer

