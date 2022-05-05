export class Task {
	constructor(
		readonly _id: string,
		readonly title: string,
		readonly text: string,
		readonly status: string | null,
		readonly projectId: string,
		readonly iterationId: string | null,
		readonly storyPoint: number | null,
		readonly assignee: any,
		
		public startTime: Date,
		public endTime: Date | null,
		public timeSpent: number | null,
	) {}

	public get id() : string {
		return this._id;
	}
}
