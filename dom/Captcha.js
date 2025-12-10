import "-/com/captcha.js"
import X from "-/dom/X.js"
import { Tag, On } from "-/dom/_.js"

export default (Y, close) => {
	const b = X(),
		captcha = Tag("i-captcha"),
		unbindClose = On(captcha, {
			close,
		})

	captcha.Y = async (id) => {
		unbindClose()
		await Y(id)
		setTimeout(b.close.bind(b), 1e3)
	}
	b.lastChild.append(captcha)
	return captcha
}
