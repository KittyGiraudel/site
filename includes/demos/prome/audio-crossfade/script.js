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
	let pendingHowl = null;
	let wasPlaying = false;
	let currentBiomeId = DEFAULT_BIOME_ID;
	let isCrossfading = false;
	let isLoading = false;
	let crossfadeTimeoutId = null;

	function getBiome(id) {
		return biomeById.get(id);
	}

	function isControlDisabled(control) {
		return control.getAttribute("aria-disabled") === "true";
	}

	function setControlDisabled(control, disabled) {
		control.setAttribute("aria-disabled", String(disabled));
	}

	function setControlsLocked(locked) {
		setControlDisabled(playButton, locked);
		for (const button of biomeButtons) {
			setControlDisabled(button, locked);
		}
	}

	function formatNowPlaying(biome, isPlaying) {
		const track = `“${biome.soundtrack}”`;
		const from = `the ${biome.label} biome`;

		if (isLoading) return `Loading ${track} from ${from}…`;
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

	function cancelPendingLoad() {
		if (!pendingHowl) return;
		pendingHowl.unload();
		pendingHowl = null;
	}

	function setLoading(next) {
		isLoading = next;
		root.dataset.loading = String(next);

		for (const button of biomeButtons) {
			button.setAttribute("aria-busy", String(next));
		}

		if (!isCrossfading) setControlsLocked(next);
		updateUi();
	}

	function setCrossfading(next) {
		isCrossfading = next;
		root.dataset.crossfading = String(next);
		setControlsLocked(next || isLoading);
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

	function startCrossfade(previousHowl, nextHowl) {
		previousHowl.fade(VOLUME, 0, FADE_DURATION_MS);
		window.setTimeout(() => previousHowl.unload(), FADE_DURATION_MS);

		// Already queued via play() during the user gesture; only fade volume up.
		if (!nextHowl.playing()) {
			nextHowl.volume(0);
			nextHowl.play();
		}
		nextHowl.fade(0, VOLUME, FADE_DURATION_MS);

		howl = nextHowl;
		scheduleCrossfadeEnd();
	}

	function whenLoaded(sound, onReady, onError) {
		if (sound.state() === "loaded") {
			onReady();
			return;
		}

		sound.once("load", onReady);
		sound.once("loaderror", onError);
	}

	function loadTrack(biome, { crossfadeFrom = null } = {}) {
		cancelPendingLoad();

		const sound = buildHowl(biome.url);
		pendingHowl = sound;
		setLoading(true);

		// play() must run in the same turn as the click, not in the load callback,
		// or browsers block playback when loading finishes later.
		if (crossfadeFrom) {
			sound.volume(0);
			sound.play();
		} else {
			sound.play();
		}

		whenLoaded(
			sound,
			() => {
				if (pendingHowl !== sound) return;
				pendingHowl = null;
				setLoading(false);

				if (crossfadeFrom) {
					startCrossfade(crossfadeFrom, sound);
					return;
				}

				if (!sound.playing()) sound.play();
				howl = sound;
				updateUi();
			},
			() => {
				if (pendingHowl !== sound) return;
				pendingHowl = null;
				setLoading(false);

				if (crossfadeFrom) {
					howl = crossfadeFrom;
				}

				nowPlayingEl.textContent = `Could not load “${biome.soundtrack}”.`;
				updateUi();
			},
		);
	}

	function handleBiomeChange(nextBiomeId) {
		if (nextBiomeId === currentBiomeId || isCrossfading || isLoading) return;

		const previousHowl = howl;
		const shouldCrossfade = wasPlaying && previousHowl;
		currentBiomeId = nextBiomeId;
		updateUi();

		if (shouldCrossfade) {
			const biome = getBiome(nextBiomeId);
			if (!biome) return;
			loadTrack(biome, { crossfadeFrom: previousHowl });
			return;
		}

		cancelPendingLoad();
		if (previousHowl) {
			previousHowl.unload();
			howl = null;
			wasPlaying = false;
		}
	}

	function togglePlay() {
		if (isCrossfading || isLoading || isControlDisabled(playButton)) return;

		if (!howl) {
			const biome = getBiome(currentBiomeId);
			if (!biome) return;
			loadTrack(biome);
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
		cancelPendingLoad();
		if (howl) {
			fadeOutAndUnload(howl);
			howl = null;
		}
	});

	updateUi();
	content.hidden = false;
})();
