const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
Math.lerp = function (value1, value2, amount) {
	var delta = value2 - value1;
	return value1 + delta * amount/60;
};

