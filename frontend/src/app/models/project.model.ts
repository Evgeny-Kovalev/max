import { Iteration } from './itaration.model';

export class Project {
	iterations: Iteration[] | null = null;

	constructor(
        private _id: string,
        public title: string,
        public description: string,
		public users: any[],
	) {}

	public get id() : string {
		return this._id;
	}
}
