export class TimesheetItem {
	constructor(
		readonly user: {
			name: string,
			email: string,
			icon: string,
		},
		readonly dates: { value: string, hours: string|null }[]

	) {}

}
