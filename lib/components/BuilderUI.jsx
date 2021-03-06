import React, { useContext, useState } from 'react'
import { ethers } from 'ethers'
import loadFirebase  from '../../firebase.config';

import CompoundPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPrizePool'
import CompoundPrizePoolBuilderAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPrizePoolBuilder'
import StakePrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/StakePrizePool'
import StakePrizePoolBuilderAbi from '@pooltogether/pooltogether-contracts/abis/StakePrizePoolBuilder'
import SingleRandomWinnerBuilderAbi from '@pooltogether/pooltogether-contracts/abis/SingleRandomWinnerBuilder'
import { SovrynPrizePoolAbi } from 'lib/abis/SorvynPrizePoolAbi'
import { SovrynPrizePoolBuilderAbi } from 'lib/abis/SorvynPrizePoolBuilderAbi'
import { fetchTokenChainData } from 'lib/utils/fetchTokenChainData'
import ERC20Abi from 'lib/abis/ERC20Abi'

import {
  CONTRACT_ADDRESSES,
  MAX_EXIT_FEE_PERCENTAGE,
  PRIZE_POOL_TYPE,
  TICKET_DECIMALS
} from 'lib/constants'
import { BuilderForm } from 'lib/components/BuilderForm'
import { BuilderResultPanel } from 'lib/components/BuilderResultPanel'
import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { poolToast } from 'lib/utils/poolToast'
import { daysToSeconds, percentageToFraction } from 'lib/utils/format'
import { calculateMaxTimelockDuration } from 'lib/utils/calculateMaxTimelockDuration'

const now = () => Math.floor(new Date().getTime() / 1000)
const toWei = ethers.utils.parseEther

const getLogs = (receipt, filter) => {
  return receipt.logs.filter(log =>
    log.address.toLowerCase() == filter.address.toLowerCase() && filter.topics.every((topic) =>
      topic == null || log.topics.includes(topic)
      )
    )
}

const sendPrizeStrategyTx = async (
  params,
  walletContext,
  chainId,
  setTx,
  setResultingContractAddresses
) => {
  const usersAddress = walletContext.state.address
  const provider = walletContext.state.provider
  const format = provider.formatter.formats
  format.receipt.root = format.receipt.logsBloom
  Object.assign(provider.formatter, { format })

  const signer = provider.getSigner()
  Object.assign(signer.provider.formatter, { format })
  const {
    rngService,
    prizePeriodStartAt,
    prizePeriodInDays,
    ticketName,
    ticketSymbol,
    sponsorshipName,
    sponsorshipSymbol,
    creditMaturationInDays,
    ticketCreditLimitPercentage,
    externalERC20Awards,
    prizePoolType,
    cTokenAddress,
    iTokenAddress,
    cToken,
    iToken,
    tandaType
  } = params

  const [prizePoolBuilderContract, prizePoolConfig, prizePoolAbi] = getPrizePoolDetails(
    params,
    signer,
    chainId
  )

  const singleRandomWinnerBuilderAddress =
    CONTRACT_ADDRESSES[chainId]['SINGLE_RANDOM_WINNER_BUILDER']
  const singleRandomWinnerBuilderContract = new ethers.Contract(
    singleRandomWinnerBuilderAddress,
    SingleRandomWinnerBuilderAbi,
    signer
  )

  // Determine appropriate Credit Rate based on Credit Limit / Credit Maturation (in seconds)
  const prizePeriodSeconds = daysToSeconds(prizePeriodInDays)
  const ticketCreditLimitMantissa = percentageToFraction(ticketCreditLimitPercentage).toString()
  const ticketCreditMaturationInSeconds = daysToSeconds(creditMaturationInDays)
  const ticketCreditRateMantissa = ethers.utils
    .parseEther(ticketCreditLimitMantissa)
    .div(ticketCreditMaturationInSeconds)

  const prizePeriodStartInt = parseInt(prizePeriodStartAt, 10)
  const prizePeriodStartTimestamp = (prizePeriodStartInt === 0
    ? now()
    : prizePeriodStartInt
  ).toString()

  const rngServiceAddress = CONTRACT_ADDRESSES[chainId].RNG_SERVICE[rngService]

  const singleRandomWinnerConfig = {
    rngService: rngServiceAddress,
    prizePeriodStart: prizePeriodStartTimestamp,
    prizePeriodSeconds,
    ticketName,
    ticketSymbol,
    sponsorshipName,
    sponsorshipSymbol,
    ticketCreditLimitMantissa: toWei(ticketCreditLimitMantissa),
    ticketCreditRateMantissa,
    externalERC20Awards
  }

  try {
    const newTx = await prizePoolBuilderContract.createSingleRandomWinner(
      prizePoolConfig,
      singleRandomWinnerConfig,
      TICKET_DECIMALS,
      {
        gasLimit: 3000000
      }
    )

    setTx((tx) => ({
      ...tx,
      hash: newTx.hash,
      sent: true
    }))

    await newTx.wait()
    const receipt = await provider.getTransactionReceipt(newTx.hash)

    setTx((tx) => ({
      ...tx,
      completed: true
    }))

    poolToast.success('Transaction complete!')

    // events
    const prizePoolCreatedFilter = prizePoolBuilderContract.filters.PrizePoolCreated(usersAddress)
    const prizePoolCreatedRawLogs = getLogs(receipt, prizePoolCreatedFilter)
    const prizePoolCreatedEventLog = prizePoolBuilderContract.interface.parseLog(
      prizePoolCreatedRawLogs[0]
    )
    const prizePool = prizePoolCreatedEventLog.args.prizePool

    const prizePoolContract = new ethers.Contract(prizePool, prizePoolAbi, signer)
    const prizeStrategySetFilter = prizePoolContract.filters.PrizeStrategySet(null)
    const prizeStrategySetRawLogs = getLogs(receipt, prizeStrategySetFilter)
    const prizeStrategySetEventLogs = prizePoolContract.interface.parseLog(
      prizeStrategySetRawLogs[0]
    )
    const prizeStrategy = prizeStrategySetEventLogs.args.prizeStrategy

    const singleRandomWinnerCreatedFilter = singleRandomWinnerBuilderContract.filters.SingleRandomWinnerCreated(
      prizeStrategy
    )
    const singleRandomWinnerCreatedRawLogs = getLogs(receipt, singleRandomWinnerCreatedFilter)
    const singleRandomWinnerCreatedEventLog = singleRandomWinnerBuilderContract.interface.parseLog(
      singleRandomWinnerCreatedRawLogs[0]
    )
    const ticket = singleRandomWinnerCreatedEventLog.args.ticket
    const sponsorship = singleRandomWinnerCreatedEventLog.args.sponsorship

    const tokenAddress = (await prizePoolContract.token()).toLowerCase()
    console.log('tokenAddress', tokenAddress)
    const tokenContract = new ethers.Contract(tokenAddress, ERC20Abi, signer)
    const tokenDecimals = await tokenContract.decimals()
    const tokenSymbol = await tokenContract.symbol()
    const tokenName = await tokenContract.name()
    const fire = await loadFirebase()
    const newData = {
      exitFeePercentage: ticketCreditLimitPercentage,
      feeDecayTimeInDays: creditMaturationInDays,
      governorAddress: (await signer.getAddress()).toLowerCase(),
      poolAddress: prizePool.toLowerCase(),
      poolType: prizePoolType,
      pricePeriodInDays: prizePeriodInDays,
      prizeStrategyAddress: prizeStrategy.toLowerCase(),
      rngAddress: rngServiceAddress.toLowerCase(),
      sponsorship: {
        address: sponsorship.toLowerCase(),
        name: sponsorshipName,
        symbol: sponsorshipSymbol,
      },
      tandaType: tandaType,
      ticket: {
        address: ticket.toLowerCase(),
        decimals: 18,
        name: ticketName,
        symbol: ticketSymbol,
      },
      token: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        name: tokenName
      }
    }
    if (prizePoolType == PRIZE_POOL_TYPE.compound) {
      newData.cToken = {
        address: cTokenAddress,
        symbol: cToken,
      }
    }
    if (prizePoolType == PRIZE_POOL_TYPE.sovryn) {
      newData.iToken = {
        address: iTokenAddress,
        symbol: iToken,
      }
    }
    console.error(newData)
    fire.database().ref(`${chainId}/tandas/${prizePool.toLowerCase()}`).set(newData);

    setResultingContractAddresses({
      prizePool,
      prizeStrategy,
      ticket,
      sponsorship
    })
  } catch (e) {
    setTx((tx) => ({
      ...tx,
      hash: '',
      inWallet: true,
      sent: true,
      completed: true,
      error: true
    }))

    poolToast.error(`Error with transaction. See JS Console`)

    console.error(e.message)
  }
}

/**
 * Returns [
 *  prizePoolBuilderContract - instances of ethers Contract
 *  cToken - address of the cToken
 *  prizePoolAbi - ABI of the selected Prize Pool
 * ]
 *
 * @param params - Passthrough of params from sendPrizeStrategyTx
 * @param signer
 * @param chainId
 */
const getPrizePoolDetails = (params, signer, chainId) => {
  const {
    prizePoolType,
    cTokenAddress,
    iTokenAddress,
    stakedTokenAddress,
    prizePeriodInDays,
    ticketCreditLimitPercentage
  } = params

  const maxExitFeePercentage = MAX_EXIT_FEE_PERCENTAGE
  const maxTimelockDurationDays = calculateMaxTimelockDuration(prizePeriodInDays)
  const maxExitFeeMantissa = percentageToFraction(maxExitFeePercentage).toString()
  const maxTimelockDuration = daysToSeconds(maxTimelockDurationDays)

  switch (prizePoolType) {
    case PRIZE_POOL_TYPE.compound: {
      const compoundPrizePoolBuilderAddress =
        CONTRACT_ADDRESSES[chainId]['COMPOUND_PRIZE_POOL_BUILDER']

      return [
        new ethers.Contract(compoundPrizePoolBuilderAddress, CompoundPrizePoolBuilderAbi, signer),
        {
          cToken: cTokenAddress,
          maxExitFeeMantissa: toWei(maxExitFeeMantissa),
          maxTimelockDuration
        },
        CompoundPrizePoolAbi
      ]
    }
    case PRIZE_POOL_TYPE.sovryn: {
      const sovrynPrizePoolBuilderAddress = CONTRACT_ADDRESSES[chainId]['SOVRYN_PRIZE_POOL_BUILDER']
      return [
        new ethers.Contract(sovrynPrizePoolBuilderAddress, SovrynPrizePoolBuilderAbi, signer),
        {
          iToken: iTokenAddress,
          maxExitFeeMantissa: toWei(maxExitFeeMantissa),
          maxTimelockDuration
        },
        SovrynPrizePoolAbi
      ]
    }
    case PRIZE_POOL_TYPE.stake: {
      const stakePrizePoolBuilderAddress = CONTRACT_ADDRESSES[chainId]['STAKE_PRIZE_POOL_BUILDER']

      return [
        new ethers.Contract(stakePrizePoolBuilderAddress, StakePrizePoolBuilderAbi, signer),
        {
          token: stakedTokenAddress,
          maxExitFeeMantissa: toWei(maxExitFeeMantissa),
          maxTimelockDuration
        },
        StakePrizePoolAbi
      ]
    }
  }
}

/**
 * BuilderUI Component
 */
export const BuilderUI = (props) => {
  const [resultingContractAddresses, setResultingContractAddresses] = useState({})
  const [prizePoolType, setPrizePoolType] = useState('')
  const [cToken, setCToken] = useState('')
  const [iToken, setIToken] = useState('')
  const [stakedTokenAddress, setStakedTokenAddress] = useState('')
  const [stakedTokenData, setStakedTokenData] = useState()
  const [rngService, setRngService] = useState('')
  const [prizePeriodStartAt, setPrizePeriodStartAt] = useState('0')
  const [prizePeriodInDays, setPrizePeriodInDays] = useState('7')
  const [sponsorshipName, setSponsorshipName] = useState('CT Sponsorship')
  const [sponsorshipSymbol, setSponsorshipSymbol] = useState('ST')
  const [ticketName, setTicketName] = useState('CT')
  const [ticketSymbol, setTicketSymbol] = useState('CT')
  const [creditMaturationInDays, setCreditMaturationInDays] = useState('14')
  const [ticketCreditLimitPercentage, setTicketCreditLimitPercentage] = useState('0')
  const [externalERC20Awards, setExternalERC20Awards] = useState([])
  const [tandaType, setTandaType] = useState('')
  const [tx, setTx] = useState({
    inWallet: false,
    sent: false,
    completed: false
  })

  const walletContext = useContext(WalletContext)

  const digChainIdFromWalletState = () => {
    const onboard = walletContext._onboard

    let chainId = 1
    if (onboard) {
      chainId = onboard.getState().appNetworkId
    }

    return chainId
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const chainId = digChainIdFromWalletState()

    const requiredValues = [
      rngService,
      sponsorshipName,
      sponsorshipSymbol,
      ticketName,
      ticketSymbol,
      creditMaturationInDays,
      ticketCreditLimitPercentage,
      tandaType
    ]

    const cTokenAddress = CONTRACT_ADDRESSES[chainId][cToken]
    const iTokenAddress = CONTRACT_ADDRESSES[chainId][iToken]
    switch (prizePoolType) {
      case PRIZE_POOL_TYPE.compound: {
        requiredValues.push(cTokenAddress)
        break
      }
      case PRIZE_POOL_TYPE.sovryn: {
        requiredValues.push(iTokenAddress)
        break
      }
      // case PRIZE_POOL_TYPE.stake: {
      //   requiredValues.push(stakedTokenAddress)

      //   if (!stakedTokenData?.tokenSymbol) {
      //     poolToast.error(`Invalid Staking Token Address`)
      //     return
      //   }

      //   break
      // }
    }
    if (!requiredValues.every(Boolean)) {
      poolToast.error(`Please fill out all fields`)
      console.error(
        `Missing one or more of sponsorshipName, sponsorshipSymbol, ticketName, ticketSymbol, stakedTokenAddress, creditMaturationInDays, ticketCreditLimitPercentage or creditRateMantissa for token ${cToken} on network ${chainId}!`
      )
      return
    }

    setTx((tx) => ({
      ...tx,
      inWallet: true
    }))

    const params = {
      prizePoolType,
      stakedTokenAddress,
      cTokenAddress,
      iTokenAddress,
      rngService,
      prizePeriodStartAt,
      prizePeriodInDays,
      ticketName,
      ticketSymbol,
      sponsorshipName,
      sponsorshipSymbol,
      creditMaturationInDays,
      ticketCreditLimitPercentage,
      externalERC20Awards,
      cToken,
      iToken,
      tandaType,
    }

    sendPrizeStrategyTx(params, walletContext, chainId, setTx, setResultingContractAddresses)
  }

  const txInFlight = tx.inWallet || tx.sent
  const txCompleted = tx.completed

  const resetState = (e) => {
    e.preventDefault()
    setPrizePoolType('')
    setCToken('')
    setIToken('')
    setStakedTokenAddress('')
    setStakedTokenData(undefined)
    setPrizePeriodInDays(7)
    setSponsorshipName('CT Sponsorship')
    setSponsorshipSymbol('ST')
    setTicketName('CT')
    setTicketSymbol('CT')
    setCreditMaturationInDays('7')
    setTicketCreditLimitPercentage('1')
    setRngService('')
    setTx({})
    setResultingContractAddresses({})
    setTandaType('')
  }

  return (
    <>
      {typeof resultingContractAddresses.prizePool === 'string' ? (
        <>
          <div className='bg-default -mx-8 sm:-mx-0 sm:mx-auto py-4 px-12 sm:p-10 pb-16 rounded-xl sm:w-full lg:w-3/4 text-base sm:text-lg mb-20'>
            <BuilderResultPanel resultingContractAddresses={resultingContractAddresses} />
          </div>
        </>
      ) : (
        <>
          {txInFlight ? (
            <>
              <div className='bg-default -mx-8 sm:-mx-0 sm:mx-auto py-4 px-12 sm:p-10 pb-16 rounded-xl sm:w-full lg:w-3/4 text-base sm:text-lg mb-20'>
                <TxMessage txType='Deploy Tanda Contracts' tx={tx} />
              </div>
            </>
          ) : (
            <>
              <BuilderForm
                handleSubmit={handleSubmit}
                vars={{
                  prizePoolType,
                  cToken,
                  iToken,
                  stakedTokenData,
                  stakedTokenAddress,
                  rngService,
                  prizePeriodStartAt,
                  prizePeriodInDays,
                  sponsorshipName,
                  sponsorshipSymbol,
                  ticketName,
                  ticketSymbol,
                  creditMaturationInDays,
                  ticketCreditLimitPercentage,
                  externalERC20Awards,
                  tandaType,
                }}
                stateSetters={{
                  setPrizePoolType,
                  setCToken,
                  setIToken,
                  setStakedTokenData,
                  setStakedTokenAddress,
                  setRngService,
                  setPrizePeriodStartAt,
                  setPrizePeriodInDays,
                  setSponsorshipName,
                  setSponsorshipSymbol,
                  setTicketName,
                  setTicketSymbol,
                  setCreditMaturationInDays,
                  setTicketCreditLimitPercentage,
                  setExternalERC20Awards,
                  setTandaType,
                }}
              />
            </>
          )}
        </>
      )}

      {txCompleted && (
        <>
          <div className='bg-default -mx-8 sm:-mx-0 sm:mx-auto py-4 px-12 sm:p-10 pb-16 rounded-xl sm:w-full lg:w-3/4 text-base sm:text-lg mb-20'>
            <div className='my-3 text-center'>
              <button
                className='font-bold rounded-full text-green-1 border border-green-1 hover:text-white hover:bg-lightPurple-1000 text-xxs sm:text-base pt-2 pb-2 px-3 sm:px-6 trans'
                onClick={resetState}
              >
                Reset Form
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
