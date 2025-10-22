import IORedis from 'ioredis'

let redis: IORedis

declare global {

  var __redis: IORedis | undefined
}

// Kỹ thuật này giúp giữ lại kết nối Redis khi hot-reload trong môi trường dev
if (process.env.NODE_ENV === 'production') {
  redis = new IORedis(process.env.REDIS_URL as string)
} else {
  if (!global.__redis)
    global.__redis = new IORedis(process.env.REDIS_URL as string)

  redis = global.__redis
}

export default redis
