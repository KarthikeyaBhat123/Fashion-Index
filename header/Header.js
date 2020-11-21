import React, { Component } from "react";
import "./Header.scss";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// import { Chart } from "react-charts";
import { Line } from "react-chartjs-2";
import * as zoom from "chartjs-plugin-zoom";
import "react-month-picker-input/dist/react-month-picker-input.css";
import Axios from "axios";
import { Button } from "reactstrap";
import { Home } from "../Redux/Actions/HomeActions";

// This will bring Data from Redux
const mapStateToProps = (state) => {
	return {
		home: state.Home,
	};
};

// This is to send data to redux
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ Home }, dispatch),
});

class Header extends Component {
	constructor(props) {
		super(props);
		const year = new Date().getFullYear();
		this.years = Array.from(new Array(20), (val, index) => index + year - 5);

		// Placing all my data from redux to local state, as this is easier to handle and everytime
		// When we update the state Page will be rendered
		this.state = {
			year: this.props.home.year,
			toYears: Array.from(new Array(20), (val, index) => index + year - 4),
			toYear: year - 4,
			fromYear: this.props.home.fromYear,
			listOfImages: this.props.home.listOfImages,
			limitTo: this.props.home.limitTo,
			data: this.props.home.data,
		};

		// Binding my Functions
		this.selectFromYear = this.selectFromYear.bind(this);
		this.onLoadMore = this.onLoadMore.bind(this);
		this.getEngagement = this.getEngagement.bind(this);
		this.selectToYear = this.selectToYear.bind(this);
	}

	componentDidMount = () => {
		// This is to Get the JSON data for the Graph, which is stored in Public folder

		this.getEngagement(this.state.fromYear, this.state.toYear);

		// This is to fetch Images on load of the page and storing it in state
		Axios.get("images.json").then((data) => {
			this.setState(
				{ listOfImages: data.data },
				// Update Redux as well
				() => {
					let home = this.props.home;
					home.listOfImages = this.state.listOfImages;
					this.props.actions.Home(home);
				}
			);
		});
	};

	getEngagement = (from, to) => {
		// Axios call made to get the JSON data
		Axios.get("Engagement.json").then((data) => {
			let graphData = {
				labels: [],
				data: [],
			};

			// Below is to loop through JSON Data, for Graph, we populate Data needed for X-AXIS and Y-AXIS
			for (let i = from; i <= to; i++) {
				for (const property in data.data[0][i]) {
					// console.log(`${property}: ${object[property]}`);
					graphData.labels.push(`${property} ` + i);
					graphData.data.push(data.data[0][i][`${property}`]);
				}
			}

			// Store the data needed for graph in state variable
			this.setState(
				{
					data: Object.assign(this.state.data, {
						labels: graphData.labels,
						datasets: Object.assign(this.state.data.datasets, {
							data: graphData.data,
							datasets: this.state.data.datasets.map(
								(row, index) =>
									index === 0 &&
									Object.assign(row, {
										data: graphData.data,
									})
							),
						}),
					}),
				},
				// Update Redux as well
				() => {
					let home = this.props.home;
					home.data = this.state.data;
					this.props.actions.Home(home);
				}
			);
		});
	};

	// On Change of From Year this is triggered
	// This stored the data for From year, To Year and
	// Populate Years Dropdown
	selectFromYear = (e) => {
		this.setState(
			{
				fromYear: e.target.value,
				toYear:
					parseInt(e.target.value) >= parseInt(this.state.toYear)
						? parseInt(e.target.value) + 1
						: this.state.toYear,
				toYears: Array.from(
					new Array(20),
					(val, index) => index + parseInt(e.target.value) + 1
				),
			},
			() => {
				this.getEngagement(this.state.fromYear, this.state.toYear);
				// Update Redux as well
				let home = this.props.home;
				home.fromYear = this.state.fromYear;
				home.toYears = this.state.toYears;
				home.toYear = this.state.toYear;
				this.props.actions.Home(home);
			}
		);

		return <div></div>;
	};

	// Store To Year
	selectToYear = (e) => {
		this.setState(
			{ toYear: e.target.value },
			() => {
				this.getEngagement(this.state.fromYear, this.state.toYear);
			},
			// Update Redux as well
			() => {
				let home = this.props.home;
				home.toYear = this.state.toYear;
				this.props.actions.Home(home);
			}
		);
	};

	// This is called when more button is clicked this will update the limit
	onLoadMore() {
		this.setState(
			{
				limitTo: this.state.limitTo + 3,
			},
			// Update Redux as well
			() => {
				let home = this.props.home;
				home.limitTo = this.state.limitTo;
				this.props.actions.Home(home);
			}
		);
	}

	render() {
		// Updating Redux Here
		// this.props.actions.Home(this.state);

		return (
			<center className="parent">
				<div>
					<h1>AI PALETTE FASHION INDEX</h1>

					{/* Dropdown to show From Year */}
					<select onChange={this.selectFromYear}>
						{this.years.map((year, index) => {
							if (year < this.state.year) {
								if (year === parseInt(this.state.fromYear)) {
									return (
										<option key={`year${index}`} selected>
											{this.state.fromYear}
										</option>
									);
								} else {
									return <option key={`year${index}`}>{year}</option>;
								}
							}

							return year;
						})}
					</select>
					{/* Dropdown to show To Year */}
					<select onChange={this.selectToYear}>
						{this.state.toYears.map((year, index) => {
							if (year <= this.state.year) {
								if (year === parseInt(this.state.toYear)) {
									return (
										<option key={`year${index}`} selected>
											{this.state.toYear}
										</option>
									);
								} else {
									return <option key={`year${index}`}>{year}</option>;
								}
							}
							return year;
						})}
					</select>

					<div
						style={{
							width: "50%",
							height: "50%",
						}}
					>
						{/* This is to show the graph, we are using a react package to display this */}
						<Line
							ref="chart"
							data={this.state.data}
							options={{
								title: { display: true, text: "" },
								zoom: {
									enabled: true,
									mode: "xy",
									rangeMin: {
										// Format of min zoom range depends on scale type
										x: null,
										y: 0,
									},
									rangeMax: {
										// Format of max zoom range depends on scale type
										x: null,
										y: 100,
									},

									// Speed of zoom via mouse wheel
									// (percentage of zoom on a wheel event)
									speed: 0.1,

									// Minimal zoom distance required before actually applying zoom
									threshold: 2,

									// On category scale, minimal zoom level before actually applying zoom
									sensitivity: 3,
								},
								pan: {
									enabled: true,
									mode: "x",
								},
							}}
						/>
						{/* <Chart data={data} axes={axes} /> */}
					</div>
				</div>
				{/* this is to get the image which are stored in public folder */}
				<div className="container">
					{this.state.listOfImages
						.slice(0, this.state.limitTo)
						.map((image, index) => (
							<div className="child">
								<p>{image.imageName}</p>
								<img
									style={{
										width: "120px",
										height: "120px",
										// paddingLeft: "50px",
									}}
									key={index}
									src={image.imagePath}
									alt="info"
								></img>

								<p>{image.price}</p>
							</div>
						))}
				</div>
				<Button outline color="primary" onClick={this.onLoadMore}>
					More
				</Button>{" "}
			</center>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
