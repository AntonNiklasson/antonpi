const _storage = {}

export function get(key) {
  const value = _storage[key] || null

  console.log("Cache.Memory@get", { key, value })

  return value
}

export function set(key, value) {
  _storage[key] = value
}
