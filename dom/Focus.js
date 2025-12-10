export default (form) => {
	let first, i, v
	for (i of form.getElementsByTagName("input")) {
		if (["text", "password", "email"].includes(i.type)) {
			if (i.disabled) {
				continue
			}
			v = i.value.trim()
			if (!v) {
				i.value = v
				setTimeout(() => i.focus())
				return
			}
			if (!first) {
				first = i
			}
		}
	}
	if (first != null) {
		first.focus()
	}
}
