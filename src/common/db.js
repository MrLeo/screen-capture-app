// lowdb的基本操作
// https://molunerfinn.com/electron-vue-3/#lowdb的基本操作
// https://github.com/typicode/lowdb

import Datastore from 'lowdb'
import LodashId from 'lodash-id'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fs from 'fs-extra'
import { remote, app } from 'electron'

const APP = process.type === 'renderer' ? remote.app : app
const STORE_PATH = APP.getPath('userData')

if (process.type !== 'renderer') {
  if (!fs.pathExistsSync(STORE_PATH)) {
    fs.mkdirpSync(STORE_PATH)
  }
}

const adapter = new FileSync(path.join(STORE_PATH, '/data.json'))

const db = Datastore(adapter)
db._.mixin(LodashId)

if (!db.has('userInfo').value()) {
  db.set('userInfo', {}).write()
}

export default db

export const readDb = () => db.read()
