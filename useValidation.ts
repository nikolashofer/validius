import { useState } from 'react';
import {
	Indexable,
	Message,
	ValidationConfig,
	ValidationResult,
	ValidationResultEntry,
} from './types';

const required = (required: any, value: any): boolean => {
	if (required === true) {
		if (value) return true;
		return false;
	}
	return true;
};

const maxLength = (maxLength: any, value: any): boolean =>
	value?.length <= maxLength;

const minLength = (minLength: any, value: any): boolean =>
	value?.length >= minLength;

const VALIDATIONS: Indexable = { required, maxLength, minLength };

const getMessage = (
	id: string,
	type: string,
	value: any,
	message?: Message
): string => {
	if (!message) return '';
	if (typeof message === 'function') return message(id, type, value);
	if (typeof message === 'string') return message;
	if (typeof (message as Indexable)[type] === 'function')
		return (message as Indexable)[type](id, value);
	if (typeof (message as Indexable)[type] === 'string')
		return (message as Indexable)[type];
	if (typeof message.default === 'function')
		return message.default(id, type, value);
	return message.default || '';
};

export const useValidation = (
	validationConfig: ValidationConfig
): [ValidationResult, () => void] => {
	const { ids, idsConfig } = validationConfig;
	const [validationResult, setValidationResult] = useState<ValidationResult>(
		ids?.reduce(
			(idAcc, id: string) => ({
				...idAcc,
				[id]: { valid: true, value: undefined },
			}),
			{ valid: true }
		) as ValidationResult
	);
	const validate = () => {
		ids?.forEach((id: string) => {
			let message = '';
			const value = (
				document.getElementById(id) as HTMLInputElement | null
			)?.value; //TODO include other elements
			const valid = Object.entries(validationConfig).reduce(
				(validAcc, [type, config]) => {
					if (!VALIDATIONS[type] || !validAcc) return validAcc;
					const valid = VALIDATIONS[type](
						idsConfig?.[id]?.[type] !== undefined
							? idsConfig?.[id]?.[type]
							: config,
						value
					);
					if (!valid) {
						message = getMessage(
							id,
							type,
							value,
							idsConfig?.[id]?.message || validationConfig.message
						);
					}
					return (validAcc = validAcc && valid);
				},
				true
			);
			setValidationResult((validationResult: ValidationResult) => ({
				...validationResult,
				[id]: { valid, value, message },
			}));
		});
		setValidationResult((validationResult: ValidationResult) => ({
			...validationResult,
			valid: !Object.values(validationResult).some(
				value => (value as ValidationResultEntry).valid === false
			),
		}));
	};
	return [validationResult, validate];
};
