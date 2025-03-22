const addrProps = ['street1', 'street2', 'city', 'state', 'zip']

export const useAddressEmpty = () => (addr) => {
  console.debug('addr: ', addr)
  return isEmpty(uniq(Object.values(addr))[0])
}

export const useSameAddress = () => (addr1, addr2) => {
  let sameAddr = true

  forOwn(addr1, (value, key) => {
    sameAddr = sameAddr && addrProps.findIndex(() => value) >= 0 && addr2[key] === value
  })
  return sameAddr
}
