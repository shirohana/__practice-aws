function resolveAttributeValueType (attr) {
  if (typeof attr === 'boolean') {
    return 'BOOL'
  } else if (typeof attr === 'number') {
    return 'N'
  } else if (typeof attr === 'string') {
    return 'S'
  } else if (attr === null) {
    return 'NULL'
  } else if (Array.isArray(attr)) {
    const types = attr.map(item => resolveAttributeValueType(item))
    if (types.every(type => type === 'N')) {
      return 'NS'
    } else if (types.every(type => type === 'S')) {
      return 'SS'
    } else if (types.evert(type => type === 'B')) {
      return 'BS'
    } else {
      return 'L'
    }
  } else if (attr instanceof Buffer) {
    return 'B'
  } else {
    return 'M'
  }
}

function resolveAttributeValue (attr) {
  const type = resolveAttributeValueType(attr)
  switch (type) {
    case 'B': return { 'B': attr.toString('base64') }
    case 'BOOL': return { 'BOOL': Boolean(attr) }
    case 'BS': return { 'BS': attr.map(b => b.toString('base64')) }
    case 'L': return { 'L': attr.map(resolveAttributeValue) }
    case 'M': return { 'M': resolveAttributeItem(attr) }
    case 'N': return { 'N': `${attr}` }
    case 'NS': return { 'NS': attr.map(n => `${n}`) }
    case 'NULL': return { 'NULL': true }
    case 'S': return { 'S': attr }
    case 'SS': return { 'SS': attr }
  }
}

function resolveAttributeItem (obj) {
  const result = {}
  Object.keys(obj).forEach((key) => {
    const value = resolveAttributeValue(obj[key])
    if (value) {
      result[key] = value
    }
  })
  return result
}

module.exports = {
  resolveAttributeValueType,
  resolveAttributeValue,
  resolveAttributeItem
}
