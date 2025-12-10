#!/usr/bin/env bun
import u8merge from "@3-/u8/u8merge.js"

/**
 * 解析数据块
 * 格式: [4字节长度前缀][数据内容]
 */
const parseChunks = (buffer) => {
	const chunks = []
	let offset = 0
	const dataView = new DataView(buffer)

	while (offset + 4 <= buffer.byteLength) {
		// 读取长度前缀 (小端序)
		const length = dataView.getUint32(offset, true) // true表示小端序
		offset += 4

		// 确保有足够的数据
		if (offset + length <= buffer.byteLength) {
			// 提取数据
			const data = new Uint8Array(buffer.slice(offset, offset + length))
			chunks.push(new TextDecoder().decode(data))
			offset += length
		} else {
			// 数据不完整，等待更多数据
			break
		}
	}

	// 返回解析的数据块和剩余的buffer
	return [chunks, buffer.slice(offset)]
}

/**
 * 主函数 - 获取并处理流式响应
 */
async function* fetchStream(url) {
	const response = await fetch(url)

	if (!response.ok) {
		throw new Error(response.status + " " + (await response.text()))
	}

	// 获取响应的可读流
	const reader = response.body.getReader()
	let buffer = new ArrayBuffer(0)

	// 读取数据流
	while (true) {
		const { done, value } = await reader.read()

		if (done) {
			break
		}

		// 将新数据添加到缓冲区
		buffer = u8merge(new Uint8Array(buffer), new Uint8Array(value)).buffer

		// 解析数据块
		const [chunks, remainingBuffer] = parseChunks(buffer)
		buffer = remainingBuffer

		// 输出解析的数据块
		yield* chunks
	}
}

const SERVER_URL = "http://127.0.0.1:3000/stream"
for await (const i of fetchStream(SERVER_URL)) {
	console.log(i)
}
