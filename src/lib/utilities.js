export const dist = (x1, x2, y1, y2) => {
	var xd = x2 - x1;
	var yd = y2 - y1;
	return Math.sqrt(xd * xd + yd * yd);
};
