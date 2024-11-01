// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}

		interface ITestCase {
			id: number;
			parameters: {
				input: Array<Parameter>;
				output: Array<Parameter>;
			};
			publicVisible: boolean;
		}

		interface IParameter {
			type: string;
			value: string;
			argNumber: number;
			isInput: boolean;
		}
	}
}

export {};
