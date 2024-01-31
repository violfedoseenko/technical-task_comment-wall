export const timeDifferenceConversion = (commentTime:string): string => {
	const eventDate = new Date(commentTime);
	const now = new Date();
	const diff = now.getTime() - eventDate.getTime(); // разница в миллисекундах

	// Определение относительного времени
	const seconds = diff / 1000
	const minutes = seconds / 60
	const hours = minutes / 60
	//   const days = hours / 24

	if (seconds < 60) {
		return "менее минуты назад";
	} else if (minutes < 60) {
		return `${Math.round(minutes)} минут(ы) назад`
	} else if (hours < 24) {
		return `${Math.round(hours)} час(ов) назад`
	}

	// Форматирование конкретного времени
	const formatter = new Intl.DateTimeFormat('ru', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false
	});

	return formatter.format(eventDate);
}
