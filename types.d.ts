export type Indexable = {
	[key: string]: any;
};

export type Message =
	| {
			default?:
				| string
				| ((id: string, type: string, value: any) => string);
			required?: string | ((id: string, value: any) => string);
			maxLength?: string | ((id: string, value: any) => string);
			minLength?: string | ((id: string, value: any) => string);
	  }
	| string
	| ((id: string, type: string, value: any) => string);
//TODO renaming
export type Validations = {
	required?: boolean;
	maxLength?: number;
	minLength?: number;
	message?: Message;
} & Indexable;
export type ValidationConfig = Validations & {
	ids: string[];
	idsConfig?: { [id: string]: Validations };
};

export type ValidationResultEntry = {
	valid: boolean;
	value: any;
	message: string;
};
export type ValidationResult = {
	[id: string]: ValidationResultEntry;
	valid: boolean;
};
