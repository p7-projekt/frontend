import { describe, it, expect, vi } from 'vitest';
import {
	getExerciseIds,
	getProgrammingLanguages,
	displayValidationErrors
} from '$src/routes/create-session/create_session';

describe('getExerciseIds', () => {
	it('should return an arrays of exercise ids when given valid JSON string with exercises', () => {
		const exercise_list = JSON.stringify([
			{ id: 1, content: 'Haskell Arrays' },
			{ id: 2, content: 'Linked List' }
		]);

		const result = getExerciseIds(exercise_list);
		expect(result).toEqual([1, 2]);
	});
	it('should return an arrays of exercise ids when given valid JSON string with exercises', () => {
		const exercise_list = JSON.stringify([
			{ id: 6, content: 'LOL' },
			{ id: 5, content: 'mommy' },
			{ id: 7, content: 'Jack' }
		]);

		const result = getExerciseIds(exercise_list);
		expect(result).toEqual([6, 5, 7]);
	});

	it('should throw an error for invalid data in exercise_list', () => {
		const exercise_list = JSON.stringify([
			{ id: 6, content: 'LOL' },
			{},
			{ id: 7, content: 'Jack' }
		]);
		const result = getExerciseIds(exercise_list);
		expect(result).toEqual([6, undefined, 7]);
	});

	it('should return an empty array when given an empty JSON array string', () => {
		const exercise_list = JSON.stringify([]);
		const result = getExerciseIds(exercise_list);
		expect(result).toEqual([]);
	});

	it('should return an empty array when given null', () => {
		const result = getExerciseIds(null);
		expect(result).toEqual([]);
	});

	it('should return an empty array when given not array', () => {
		const result = getExerciseIds(JSON.stringify({ id: 4, content: 'lol' }));
		expect(result).toEqual([]);
	});

	it('should return an empty array and log an error when given invalid JSON', () => {
		const exercise_list = '{invalid json}';
		const result = getExerciseIds(exercise_list);

		expect(result).toEqual([]);
	});
});

describe('getProgrammingLanguages', () => {
	it('should return an arrays of programming languages when given valid JSON string with programming languages', () => {
		const languages_chosen = JSON.stringify(['Haskell', 'Python']);

		const result = getProgrammingLanguages(languages_chosen);
		expect(result).toEqual(['Haskell', 'Python']);
	});
	it('should return an arrays of programming languages when given valid JSON string with a single programming language', () => {
		const languages_chosen = JSON.stringify(['Python']);

		const result = getProgrammingLanguages(languages_chosen);
		expect(result).toEqual(['Python']);
	});

	it('should return an empty array when invalid data in programming languages are null', () => {
		const result = getProgrammingLanguages(null);
		expect(result).toEqual([]);
	});

	it('should throw error and return an empty array when chosen programming languages are invalid', () => {
		const language_chosen = 'not valid json';
		const result = getProgrammingLanguages(language_chosen);
		expect(result).toEqual([]);
	});
});

describe('displayValidationErrors', () => {
	it('should return all errors as false if the error paths do not match', () => {
		const form = {
			errors: [{ path: ['non_existing_path'], message: 'This is an unknown error path' }]
		};

		const result = displayValidationErrors(form);

		expect(result).toEqual({
			errorInTitle: { message: '' },
			errorInAddedExercises: { message: '' },
			errorInExpiration: { message: '' },
			errorInLanguages: { message: '' }
		});
	});

	it('should return correct errors when some error paths are present', () => {
		const form = {
			errors: [
				{ path: ['title'], message: 'The title must consist of at least one character' },
				{
					path: ['programming_language'],
					message: 'You must pick at least one programming language!'
				}
			]
		};

		const result = displayValidationErrors(form);

		expect(result).toEqual({
			errorInTitle: { message: 'The title must consist of at least one character' },
			errorInAddedExercises: { message: '' },
			errorInExpiration: { message: '' },
			errorInLanguages: { message: 'You must pick at least one programming language!' }
		});
	});

	it('should return correct errors when all error paths are present', () => {
		const form = {
			errors: [
				{ path: ['title'], message: 'The title must consist of at least one character' },
				{ path: ['added_exercise_ids'], message: 'You must select at least one exercise!' },
				{ path: ['expires_in_hours'], message: 'You must pick an expiration time!' },
				{
					path: ['programming_language'],
					message: 'You must pick at least one programming language!'
				}
			]
		};

		const result = displayValidationErrors(form);

		expect(result).toEqual({
			errorInTitle: { message: 'The title must consist of at least one character' },
			errorInAddedExercises: { message: 'You must select at least one exercise!' },
			errorInExpiration: { message: 'You must pick an expiration time!' },
			errorInLanguages: { message: 'You must pick at least one programming language!' }
		});
	});

	it('should return all errors with empty messages when no error paths are present', () => {
		const form = { errors: [] };

		const result = displayValidationErrors(form);

		expect(result).toEqual({
			errorInTitle: { message: '' },
			errorInAddedExercises: { message: '' },
			errorInExpiration: { message: '' },
			errorInLanguages: { message: '' }
		});
	});

	it('should return all errors with empty messages when no error paths are present', () => {
		const form = { errors: [] };

		const result = displayValidationErrors(form);

		expect(result).toEqual({
			errorInTitle: { message: '' },
			errorInAddedExercises: { message: '' },
			errorInExpiration: { message: '' },
			errorInLanguages: { message: '' }
		});
	});
});
