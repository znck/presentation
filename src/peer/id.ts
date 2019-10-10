import uuid from "uuid/v4";

const DEVICE_FIXED_ID_KEY = "deviceId";

function getOrCreateID(key: string)  {
  let id = localStorage.getItem(key)

  if (!id) {
    id = uuid()

    localStorage.setItem(key, id)
  }

  return id
}

const device = uuid()

export const ID = {
  get device() {
    return device
  },
  get deviceFixed() {
    return getOrCreateID(DEVICE_FIXED_ID_KEY)
  },
}
