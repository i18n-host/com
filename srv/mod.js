export * from "mod"
import { set } from "mod"
import { T1Decode as CaptchaD, T2Decode as CodeLiD } from "mod/_.pb.js"
import utf8d from "-/lib/utf8d.js"
import { Tag, body, HtmE, DOC } from "-/dom/_.js"
import { Warn } from "-/dom/Toast.js"
import Captcha from "-/dom/Captcha.js"

export { CaptchaD }

const HEADERS = {},
	CONTENT_TYPE = "content-type",
	U = "u"

export const setUser = (u) => {
	HEADERS[CONTENT_TYPE] = u
	sessionStorage.setItem(U, u)
}
;(() => {
	// 用sessionStorage保证刷新不切换用户
	let U_VAL = sessionStorage.getItem(U)
	if (!U_VAL) {
		sessionStorage.setItem(
			U,
			(U_VAL =
				DOC.cookie
					.split(";")
					.map((i) => i.trimStart())
					.filter((i) => i.startsWith("u="))[0]
					?.slice(2) || "#"),
		)
	}
	HEADERS[CONTENT_TYPE] = U_VAL
})()

let CAPTCHA_PENDING = []

const captchaPendingReset = () => {
	CAPTCHA_PENDING = []
}

export default (url) =>
	set(
		url,
		Warn,
		() => HEADERS,
		(
			// hpc/rust/icall/proto/_.proto
			code,
			msg,
			// [decode, resolve, reject, func_id, args_bin]
			req,
			batchCall,
		) => {
			/*
OK = 0;

JSON = 1;
CODE = 2;
BIN = 3;

CAPTCHA = 10;
NEED_SIGNIN = 11;
NO_PERMISSION = 12;

MISS_FUNC = 100;
ARGS_INVALID = 101;
BATCH_LIMIT = 102;
CALL_ERROR = 103;
MIDDLEWARE_ERROR = 104;
    */

			switch (code) {
				case 10: // CAPTCHA
					CAPTCHA_PENDING.push(req)
					if (msg.length) {
						Captcha(
							(id) => {
								HEADERS.c = id
								const promise = batchCall(CAPTCHA_PENDING)
								delete HEADERS.c
								captchaPendingReset()
								return promise
							},
							() => {
								CAPTCHA_PENDING.forEach((t) => {
									// reject
									t[2]()
								})
								captchaPendingReset()
							},
						).I = CaptchaD(msg)
					}
					return
				case 1: // JSON
					msg = JSON.parse(utf8d(msg))
					break
				case 3: // CODE_LIST
					msg = CodeLiD(msg)
					break
			}
			if (code > 99) {
				msg = utf8d(msg)
				Warn(code + " " + HtmE(msg))
			}
			return [code, msg]
		},
	)
