import { SecApiClient } from "../src/index.js"

const client = new SecApiClient({
  apiKey: process.env.SECAPI_API_KEY ?? process.env.OMNI_DATASTREAM_API_KEY,
  baseUrl: process.env.SECAPI_BASE_URL ?? process.env.SECAPI_API_BASE_URL ?? process.env.OMNI_DATASTREAM_BASE_URL ?? "https://api.secapi.ai",
})

const info = await client.mcpInfo()
const response = await client.mcp({
  jsonrpc: "2.0",
  id: "example-1",
  method: "tools/call",
  params: {
    name: "entities.resolve",
    arguments: {
      ticker: "AAPL",
    },
  },
})

console.log(JSON.stringify({ info, response }, null, 2))
