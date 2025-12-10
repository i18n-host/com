export const DOC = document

/* get tld for domain */
let _TLD

const _cookieSet = (kv, t) => {
	const n = new Date(),
		s = +n
	n.setTime(s + t)
	DOC.cookie = kv + ";path=/;expires=" + n.toUTCString() + ";domain=" + _TLD
}
;(() => {
	let i = 0,
		p = DOC.domain.split("."),
		s = +new Date(),
		k = "_" + s,
		v = k + "=" + s

	while (i < p.length - 1 && !DOC.cookie.includes(v)) {
		_TLD = p.slice(-1 - ++i).join(".")
		_cookieSet(v, 1e3)
	}
})()

export const BODY = DOC.body,
	/// DOC create element
	Tag = DOC.createElement.bind(DOC),
	/// define custom element
	C = (name, opt) => {
		customElements.define("i-" + name, opt)
	},
	/// load style from js
	Style = async (name) => {
		const s = Tag("style")
		s.textContent = (await import("-/css/" + name + ".js")).default
		DOC.head.appendChild(s)
	},
	/// load style from js then create custom element
	S = async (name, opt) => {
		await Style(name)
		C(name, opt)
	},
	/// on event
	On = (elem, dict) => {
		dict = [...Object.entries(dict)]
		let e, func

		for ([e, func] of dict) {
			elem.addEventListener(e, func)
		}

		return () => {
			for ([e, func] of dict) {
				elem.removeEventListener(e, func)
			}
		}
	},
	Div = () => Tag("div"),
	TEXTAREA = Tag("textarea"),
	HtmE = (txt) => {
		TEXTAREA.textContent = txt
		return TEXTAREA.innerHTML
	},
	TLD = _TLD,
	cookieSet = (k, v, expire = 1e11) => _cookieSet(k + "=" + v, expire)

// cookieRm = (k) => _cookieSet(k + "=", 0)

// export { BODY, C, Div, DOC, HtmE, On, S, Style, Tag, Tld, cookieSet, cookieRm }
