import debounce from "./debounce.js"

/**
 * errCatch
 * (
 *   code,
 *   response_bin,
 *   [decode, resolve, reject, func_id, args_bin]
 * )=>{
 * }
 */

export default (CallLiEncode, BinLiDecode) => {
	let url, log, Headers, errCatch

	const req = async (body, resolve) => {
			let retry = 0,
				status,
				bin

			const headers = Headers()
			for (;;) {
				try {
					const r = await fetch(url, {
						credentials: "include",
						method: "PUT",
						headers,
						body,
					})
					status = r.status
					if (status == 200) {
						return resolve(await r.arrayBuffer())
					}
					throw [status, await r.text()]
				} catch (err) {
					log(err)
					await new Promise((done) => setTimeout(done, 3e3))
				}
			}
		},
		batch_li = [],
		_batch = () => {
			const len = batch_li.length,
				t = batch_li.splice(0, len)
			return req(
				CallLiEncode([t.map((i) => i[3]), t.map((i) => i[4])]),
				(v) => {
					const [code_li, result_li] = BinLiDecode(v)
					code_li.forEach((code, pos) => {
						const tpos = t[pos],
							[decode, resolve, reject] = tpos,
							bin = result_li[pos]
						if (code) {
							const r = errCatch(code, bin, tpos, (li) => {
								batch_li.push(...li)
								_batch()
							})
							if (r) reject(r)
						} else {
							resolve(decode(bin))
						}
					})
				},
			)
		},
		batch = debounce(9, _batch),
		call = (func_id, decode, args_bin) => {
			const { promise, resolve, reject } = Promise.withResolvers()
			batch_li.push([decode, resolve, reject, func_id, args_bin])
			batch()
			return promise
		}

	return [
		// init
		(...args) => {
			;[url, log, Headers, errCatch] = args
		},
		// call without args
		(func_id, decode) => () => call(func_id, decode),
		call,
	]
}
