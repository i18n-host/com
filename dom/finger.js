export default await (async () => {
	let architecture, gpu, platformVersion, model
	const {
			screen: { width, height },
			devicePixelRatio,
		} = window,
		{
			// cpu 核心数
			hardwareConcurrency: cpu_num,
			userAgentData: ua,
		} = navigator

	try {
		;({ platformVersion, model, architecture } =
			await navigator.userAgentData.getHighEntropyValues([
				"platformVersion",
				"architecture",
				"model",
			]))
		platformVersion = platformVersion
			.split(".")
			.slice(0, 2)
			.map((i) => +i)
	} catch {}
	try {
		const gl = document.createElement("canvas").getContext("webgl")
		gpu = gl.getParameter(
			gl.getExtension("WEBGL_debug_renderer_info").UNMASKED_RENDERER_WEBGL,
		)
	} catch {}
	return [
		Math.round(new Date().getTimezoneOffset() / 15),
		Math.round(10 * devicePixelRatio) || 0,
		width,
		height,
		architecture || "",
		model || "",
		cpu_num || 0,
		gpu || "",
		...(platformVersion || [0, 0]),
	]
})()
