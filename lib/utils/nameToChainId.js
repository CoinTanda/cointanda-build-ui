export function nameToChainId(networkName) {
  switch (networkName) {
    case 'ropsten':
      return 3
    case 'rinkeby':
      return 4
    case 'kovan':
      return 42
    case 'rskmainnet':
      return 30
    case 'rsktestnet':
      return 31
    case 'rskregtest':
      return 33
    case 'localhost':
      return 31337
    default:
      return 1
  }
}
