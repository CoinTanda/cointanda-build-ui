// import CompoundPrizePoolBuilderMainnet from '@pooltogether/pooltogether-contracts/deployments/mainnet/CompoundPrizePoolBuilder.json'
// import CompoundPrizePoolBuilderRopsten from '@pooltogether/pooltogether-contracts/deployments/ropsten/CompoundPrizePoolBuilder.json'
// import CompoundPrizePoolBuilderRinkeby from '@pooltogether/pooltogether-contracts/deployments/rinkeby/CompoundPrizePoolBuilder.json'

// import StakePrizePoolBuilderMainnet from '@pooltogether/pooltogether-contracts/deployments/mainnet/StakePrizePoolBuilder.json'
// import StakePrizePoolBuilderRopsten from '@pooltogether/pooltogether-contracts/deployments/ropsten/StakePrizePoolBuilder.json'
// import StakePrizePoolBuilderRinkeby from '@pooltogether/pooltogether-contracts/deployments/rinkeby/StakePrizePoolBuilder.json'

// import SingleRandomWinnerBuilderMainnet from '@pooltogether/pooltogether-contracts/deployments/mainnet/SingleRandomWinnerBuilder.json'
// import SingleRandomWinnerBuilderRopsten from '@pooltogether/pooltogether-contracts/deployments/ropsten/SingleRandomWinnerBuilder.json'
// import SingleRandomWinnerBuilderRinkeby from '@pooltogether/pooltogether-contracts/deployments/rinkeby/SingleRandomWinnerBuilder.json'

// import RNGBlockhashMainnet from '@pooltogether/pooltogether-rng-contracts/deployments/mainnet/RNGBlockhash.json'
// import RNGBlockhashRopsten from '@pooltogether/pooltogether-rng-contracts/deployments/ropsten/RNGBlockhash.json'
// import RNGBlockhashRinkeby from '@pooltogether/pooltogether-rng-contracts/deployments/rinkeby/RNGBlockhash.json'

// import RNGChainlinkMainnet from '@pooltogether/pooltogether-rng-contracts/deployments/mainnet/RNGChainlink.json'
// import RNGChainlinkRinkeby from '@pooltogether/pooltogether-rng-contracts/deployments/rinkeby/RNGChainlink.json'

export const TICKET_DECIMALS = '18'

export const DEFAULT_TOKEN_PRECISION = 18

export const PRIZE_POOL_TYPE = Object.freeze({
  compound: 'compound',
  sovryn: 'sovryn',
  stake: 'stake'
})

export const PRIZE_POOL_VALUE = Object.freeze({
  silver: 'silver',
  gold: 'gold',
  black: 'black'
})

export const SUPPORTED_NETWORKS = [31, 31337, 1234]

export const CONTRACT_ADDRESSES = {
  31: {
    //cDai: '0xb386c06b1240e51f98e70e4b7d216b270b12425e',
    cUsdt: '0xfd09f3349fdab173d162cd0e4669b591ed5a78fb',
    cRif: '0x2b47f1b810faf99d911228a87c9c6d0d61514b9d',
    //cRbtc: '0xa04bb527be81bb92b59059a45206101b2d11200d',
    iDoc: '0x74e00a8ceddc752074aad367785bfae7034ed89f',
    iUsdt: '0xd1F225beae98cCC51c468d1E92d0331C4F93E566',
    iBPro: "0x6226b4b3f29ecb5f9eec3ec3391488173418dd5d",
    COMPOUND_PRIZE_POOL_BUILDER: '0x281648f0a49741083B6133bf0AB82e01B9ec0E90',
    SOVRYN_PRIZE_POOL_BUILDER: '0x50550A5F64d83fAE0fd6A225AE3308CD4501e0C5',
    SINGLE_RANDOM_WINNER_BUILDER: '0x56d2dae908f1bd62a5432a17a6fa91d5b9b68685',
    RNG_SERVICE: {
      blockhash: '0x4204c5a6962e65C3b3f61a078DD6Fe89Db02A578'
    }
  },
  // 1: {
  //   cDai: '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643',
  //   cUsdc: '0x39AA39c021dfbaE8faC545936693aC917d5E7563',
  //   cUsdt: '0xf650C3d88D12dB855b8bf7D11Be6C55A4e07dCC9',
  //   cBat: '0x6C8c6b02E7b2BE14d4fA6022Dfd6d75921D90E4E',
  //   cWbtc: '0xC11b1268C1A384e55C48c2391d8d480264A3A7F4',
  //   cZrx: '0xB3319f5D18Bc0D84dD1b4825Dcde5d5f7266d407',
  //   COMPOUND_PRIZE_POOL_BUILDER: CompoundPrizePoolBuilderMainnet.address,
  //   STAKE_PRIZE_POOL_BUILDER: StakePrizePoolBuilderMainnet.address,
  //   SINGLE_RANDOM_WINNER_BUILDER: SingleRandomWinnerBuilderMainnet.address,
  //   RNG_SERVICE: {
  //     blockhash: RNGBlockhashMainnet.address,
  //     chainlink: RNGChainlinkMainnet.address
  //   }
  // },
  // 3: {
  //   cDai: '0xdb5Ed4605C11822811a39F94314fDb8F0fb59A2C',
  //   cUsdc: '0x8aF93cae804cC220D1A608d4FA54D1b6ca5EB361',
  //   cUsdt: '0x135669c2dcBd63F639582b313883F101a4497F76',
  //   cBat: '0x9E95c0b2412cE50C37a121622308e7a6177F819D',
  //   cWbtc: '0x58145Bc5407D63dAF226e4870beeb744C588f149',
  //   cZrx: '0x00e02a5200CE3D5b5743F5369Deb897946C88121',
  //   COMPOUND_PRIZE_POOL_BUILDER: CompoundPrizePoolBuilderRopsten.address,
  //   STAKE_PRIZE_POOL_BUILDER: StakePrizePoolBuilderRopsten.address,
  //   SINGLE_RANDOM_WINNER_BUILDER: SingleRandomWinnerBuilderRopsten.address,
  //   RNG_SERVICE: {
  //     blockhash: RNGBlockhashRopsten.address
  //   }
  // },
  // 4: {
  //   cDai: '0x6D7F0754FFeb405d23C51CE938289d4835bE3b14',
  //   cUsdc: '0x5B281A6DdA0B271e91ae35DE655Ad301C976edb1',
  //   cUsdt: '0x2fB298BDbeF468638AD6653FF8376575ea41e768',
  //   cBat: '0xEBf1A11532b93a529b5bC942B4bAA98647913002',
  //   cWbtc: '0x0014F450B8Ae7708593F4A46F8fa6E5D50620F96',
  //   cZrx: '0x52201ff1720134bBbBB2f6BC97Bf3715490EC19B',
  //   COMPOUND_PRIZE_POOL_BUILDER: CompoundPrizePoolBuilderRinkeby.address,
  //   STAKE_PRIZE_POOL_BUILDER: StakePrizePoolBuilderRinkeby.address,
  //   SINGLE_RANDOM_WINNER_BUILDER: SingleRandomWinnerBuilderRinkeby.address,
  //   RNG_SERVICE: {
  //     blockhash: RNGBlockhashRinkeby.address,
  //     chainlink: RNGChainlinkRinkeby.address
  //   }
  // },
  // 31337: {
  //   cDai: '0x1A1FEe7EeD918BD762173e4dc5EfDB8a78C924A8',
  //   cUsdc: '0x1A1FEe7EeD918BD762173e4dc5EfDB8a78C924A8',
  //   cUsdt: '0x1A1FEe7EeD918BD762173e4dc5EfDB8a78C924A8',
  //   cBat: '0x1A1FEe7EeD918BD762173e4dc5EfDB8a78C924A8',
  //   cWbtc: '0x1A1FEe7EeD918BD762173e4dc5EfDB8a78C924A8',
  //   cZrx: '0x1A1FEe7EeD918BD762173e4dc5EfDB8a78C924A8',
  //   COMPOUND_PRIZE_POOL_BUILDER: '0x5bcb88A0d20426e451332eE6C4324b0e663c50E0',
  //   STAKE_PRIZE_POOL_BUILDER: '',
  //   SINGLE_RANDOM_WINNER_BUILDER: '0x7e35Eaf7e8FBd7887ad538D4A38Df5BbD073814a',
  //   RNG_SERVICE: {
  //     blockhash: '0x3619DbE27d7c1e7E91aA738697Ae7Bc5FC3eACA5',
  //     chainlink: '0x3619DbE27d7c1e7E91aA738697Ae7Bc5FC3eACA5'
  //   }
  // }
}

export const DEFAULT_INPUT_CLASSES =
  'w-full text-inverse bg-transparent trans focus:outline-none leading-none'
export const DEFAULT_INPUT_LABEL_CLASSES = 'mt-0 mb-1 text-xs sm:text-sm'
export const DEFAULT_INPUT_GROUP_CLASSES = 'trans py-2 px-5 sm:py-4 sm:px-10 bg-body'

export const MAX_EXIT_FEE_PERCENTAGE = 10
export const MAX_TIMELOCK_DURATION_COEFFICIENT = 4
export const FEE_DECAY_DURATION_COEFFICIENT = 2
