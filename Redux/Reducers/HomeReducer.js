import * as type from "../Constants/HomeActionTypes";

const initialState = {
	year: new Date().getFullYear(),
	toYears: [],
	toYear: "",
	fromYear: new Date().getFullYear() - 5,
	listOfImages: [],
	limitTo: 3,
	data: {
		labels: ["January", "February", "March", "April", "May", "June", "July"],
		datasets: [
			{
				label: "Engagement %",
				fill: false,
				lineTension: 0.1,
				backgroundColor: "rgba(75,192,192,0.4)",
				borderColor: "rgba(75,192,192,1)",
				borderCapStyle: "butt",
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: "miter",
				pointBorderColor: "rgba(75,192,192,1)",
				pointBackgroundColor: "#fff",
				pointBorderWidth: 1,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: "rgba(75,192,192,1)",
				pointHoverBorderColor: "rgba(220,220,220,1)",
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				data: [65, 59, 80, 81, 56, 55, 40],
			},
		],
	},
};

export default function HomeReducer(state = initialState, action) {
	switch (action.type) {
		case type.HOME: {
			// let roles = {...state}
			// roles.Roles = action.payload

			return Object.assign({}, state, action.payload);
		}

		default:
			return state;
	}
}
