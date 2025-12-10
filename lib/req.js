export const req = async (url, option) => {
	const s = await fetch(url, option)
	if (s.status != 200) {
		throw s
	}
	return s
}

export const fJson = async (url, option) => (await req(url, option)).json()
