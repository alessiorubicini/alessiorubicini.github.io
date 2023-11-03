const currentDate = new Date();
const isChristmasSeason = currentDate.getMonth() === 10 || currentDate.getMonth() === 11;
if (isChristmasSeason) {
	var winterContainer = document.querySelector('.winter');
	for (var i = 0; i < 25; i++) {
		var snowflake = document.createElement('div');
		snowflake.classList.add('snowflake');
		winterContainer.appendChild(snowflake);
	}
}
