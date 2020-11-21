import * as HomeActionTypes from "../Constants/HomeActionTypes";

export const Home = (data) => ({
	type: HomeActionTypes.HOME,
	payload: data,
});

export default Home;
