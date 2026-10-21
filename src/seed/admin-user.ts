import { getPayload } from 'payload'
import config from '../payload.config'

async function run() {
  const payload = await getPayload({ config })
  const email = 'admin@loopbysu.com'
  const password = 'admin@123'
  const { docs } = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
  if (docs.length) {
    await payload.update({ collection: 'users', id: docs[0].id, data: { password } })
    payload.logger.info(`Updated password for ${email}`)
  } else {
    await payload.create({ collection: 'users', data: { email, password, name: 'Studio Admin' } })
    payload.logger.info(`Created ${email}`)
  }
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
