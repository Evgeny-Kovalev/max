export class Iteration {
	constructor(
        private _id: string,
        private _projectId: string,
        private _startTime: Date,
        private _finishTime: Date,
	) {}

	public get id() : string {
		return this._id;
	}

	public get projectId() : string {
		return this._projectId;
	}

	public get startTime() : Date {
		return this._startTime;
	}

	public get finishTime() : Date {
		return this._finishTime;
	}
}
