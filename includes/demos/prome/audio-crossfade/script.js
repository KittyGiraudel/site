(function initPromeAudioDemo() {
	const root = document.getElementById("prome-audio-demo");
	const content = document.getElementById("prome-audio-demo-content");
	if (!root || !content || typeof Howl === "undefined") return;

	const FADE_DURATION_MS = 5_000;
	const VOLUME = 0.8;
	const DEFAULT_BIOME_ID = "shadowWoods";

	const biomeById = new Map(PROME_AUDIO_BIOMES.map((biome) => [biome.id, biome]));
	const playButton = root.querySelector("[data-action='toggle-play']");
	const biomePicker = root.querySelector(".biome-picker");
	const biomeButtons = [...root.querySelectorAll(".biome-button[data-biome]")];
	const nowPlayingEl = root.querySelector("[data-now-playing]");

	let howl = null;
	let wasPlaying = false;
	let currentBiomeId = DEFAULT_BIOME_ID;
	let isCrossfading = false;
	let crossfadeTimeoutId = null;
	let hasPreloaded = false;

	function getBiome(id) {
		return biomeById.get(id);
	}

	function isControlDisabled(control) {
		return control.getAttribute("aria-disabled") === "true";
	}

	function setControlDisabled(control, disabled) {
		control.setAttribute("aria-disabled", String(disabled));
	}

	function formatNowPlaying(biome, isPlaying) {
		const track = `“${biome.soundtrack}”`;
		const from = `the ${biome.label} biome`;

		if (isCrossfading) return `Crossfading to ${track} from ${from}…`;
		if (isPlaying) return `Now playing ${track} from ${from}.`;
		return `${track} from ${from}.`;
	}

	function buildHowl(src) {
		return new Howl({
			src: [src],
			format: ["mp3"],
			html5: true,
			loop: true,
			volume: VOLUME,
			onplay: () => {
				wasPlaying = true;
				updateUi();
			},
			onpause: () => {
				wasPlaying = false;
				updateUi();
			},
		});
	}

	function preloadOtherTracks() {
		if (hasPreloaded) return;
		hasPreloaded = true;

		for (const biome of PROME_AUDIO_BIOMES) {
			if (biome.id === currentBiomeId) continue;
			fetch(biome.url, { mode: "cors" }).catch(() => {});
		}
	}

	function setCrossfading(next) {
		isCrossfading = next;
		root.dataset.crossfading = String(next);

		setControlDisabled(playButton, next);
		for (const button of biomeButtons) {
			setControlDisabled(button, next);
			button.setAttribute("aria-busy", String(next));
		}

		updateUi();
	}

	function clearCrossfadeTimer() {
		if (crossfadeTimeoutId !== null) {
			clearTimeout(crossfadeTimeoutId);
			crossfadeTimeoutId = null;
		}
	}

	function scheduleCrossfadeEnd() {
		clearCrossfadeTimer();
		setCrossfading(true);
		crossfadeTimeoutId = window.setTimeout(() => {
			setCrossfading(false);
			crossfadeTimeoutId = null;
		}, FADE_DURATION_MS);
	}

	function fadeOutAndUnload(sound) {
		if (!sound) return;
		sound.fade(VOLUME, 0, FADE_DURATION_MS);
		window.setTimeout(() => sound.unload(), FADE_DURATION_MS);
	}

	function updateUi() {
		const biome = getBiome(currentBiomeId);
		const isPlaying = Boolean(howl?.playing());

		root.dataset.biome = currentBiomeId;

		if (biome) {
			nowPlayingEl.textContent = formatNowPlaying(biome, isPlaying);
		}

		playButton.setAttribute("aria-pressed", String(isPlaying));
		playButton.setAttribute(
			"aria-label",
			isPlaying ? "Pause soundtrack" : "Play soundtrack",
		);

		for (const button of biomeButtons) {
			const selected = button.dataset.biome === currentBiomeId;
			button.setAttribute("aria-pressed", String(selected));
		}
	}

	function handleBiomeChange(nextBiomeId) {
		if (nextBiomeId === currentBiomeId || isCrossfading) return;

		const previousHowl = howl;
		const shouldCrossfade = wasPlaying && previousHowl;
		currentBiomeId = nextBiomeId;
		updateUi();

		if (shouldCrossfade) {
			fadeOutAndUnload(previousHowl);
			scheduleCrossfadeEnd();

			const biome = getBiome(nextBiomeId);
			if (!biome) {
				howl = null;
				return;
			}

			const sound = buildHowl(biome.url);
			sound.play();
			howl = sound;
			return;
		}

		if (previousHowl) {
			previousHowl.unload();
			howl = null;
		}
	}

	function togglePlay() {
		if (isCrossfading || isControlDisabled(playButton)) return;

		if (!howl) {
			const biome = getBiome(currentBiomeId);
			if (!biome) return;

			preloadOtherTracks();
			const sound = buildHowl(biome.url);
			sound.play();
			howl = sound;
			updateUi();
			return;
		}

		if (howl.playing()) howl.pause();
		else howl.play();
	}

	biomePicker.addEventListener("click", (event) => {
		const button = event.target.closest(".biome-button[data-biome]");
		if (!button || isControlDisabled(button)) return;
		handleBiomeChange(button.dataset.biome);
	});

	playButton.addEventListener("click", togglePlay);

	root.addEventListener("prome-audio-demo:destroy", () => {
		clearCrossfadeTimer();
		if (howl) {
			fadeOutAndUnload(howl);
			howl = null;
		}
	});

	updateUi();
	content.hidden = false;
})();
