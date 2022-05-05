export class Toast {
	constructor(
        private _id: number,
        public title: string,
        public type: string,
        public text: string,
	) {}

	public get id() : number {
		return this._id;
	}
}
