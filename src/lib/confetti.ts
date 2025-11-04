import confetti from 'canvas-confetti';

export function fireConfetti() {
	try {
		// a couple bursts with different angles & spreads for a pleasing effect
		confetti({
			particleCount: 40,
			spread: 60,
			origin: { x: 0.5, y: 0.16 },
			gravity: 0.9,
			ticks: 200,
		});

		confetti({
			particleCount: 30,
			spread: 100,
			origin: { x: 0.5, y: 0.12 },
			scalar: 0.9,
			gravity: 0.7,
			ticks: 180,
		});
	} catch (e) {
		// no-op if confetti can't run
	}
}

export default fireConfetti;
