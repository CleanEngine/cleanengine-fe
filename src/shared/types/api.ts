type FieldErrorDetail = {
	fieldName: string;
	rejectValue: string;
	constraintMessage: string;
};

type ApiError = {
	code: string;
	message: string;
	fieldErrorDetails?: FieldErrorDetail[];
} | null;

export type Response<T> = {
	isSuccess: boolean;
	data: T;
	error: ApiError;
};
