import React, { useState } from 'react'

import { Button } from 'lib/components/Button'
import { PRIZE_POOL_TYPE } from 'lib/constants'
import { TokenDetailsCard } from 'lib/components/TokenDetailsCard'
import { PrizePeriodCard } from 'lib/components/PrizePeriodCard'
import { RNGCard } from 'lib/components/RNGCard'
import { PrizePoolTypeCard } from 'lib/components/PrizePoolTypeCard'
import { FairnessCard } from 'lib/components/FairnessCard'
import { COMPOUND_TOKENS, SOVRYN_TOKENS } from 'lib/components/TokenDropdown'

const getPrizePoolName = (prizePool) => {
  switch (prizePool) {
    case PRIZE_POOL_TYPE.compound: {
      return 'Compound'
    }
    case PRIZE_POOL_TYPE.sovryn: {
      return 'Sovryn'
    }
    case PRIZE_POOL_TYPE.stake: {
      return 'Stake'
    }
  }
}

const getPrizePoolSymbol = (prizePool) => {
  switch (prizePool) {
    case PRIZE_POOL_TYPE.compound: {
      return 'C'
    }
    case PRIZE_POOL_TYPE.sovryn: {
      return 'I'
    }
    case PRIZE_POOL_TYPE.stake: {
      return 'S'
    }
  }
}

const joinText = (array, separator = ' ') => array.filter(Boolean).join(separator)

export const BuilderForm = (props) => {
  const { handleSubmit, vars, stateSetters } = props

  const {
    prizePoolType,
    cToken,
    iToken,
    stakedTokenData,
    stakedTokenAddress,
    rngService,
    prizePeriodInDays,
    sponsorshipName,
    sponsorshipSymbol,
    ticketName,
    ticketSymbol,
    creditMaturationInDays,
    ticketCreditLimitPercentage
  } = vars

  const {
    setPrizePoolType,
    setCToken,
    setIToken,
    setStakedTokenData,
    setStakedTokenAddress,
    setRngService,
    setPrizePeriodInDays,
    setSponsorshipName,
    setSponsorshipSymbol,
    setTicketName,
    setTicketSymbol,
    setCreditMaturationInDays,
    setTicketCreditLimitPercentage
  } = stateSetters

  const [userChangedCreditMaturation, setUserChangedCreditMaturation] = useState(false)
  const [userChangedTicketName, setUserChangedTicketName] = useState(false)
  const [userChangedTicketSymbol, setUserChangedTicketSymbol] = useState(false)
  const [userChangedSponsorshipName, setUserChangedSponsorshipName] = useState(false)
  const [userChangedSponsorshipTicker, setUserChangedSponsorshipTicker] = useState(false)

  /**
   * Updates Token name & ticker symbol as well as Sponsorship
   * token name and ticker symbol if the user hasn't manually edited them.
   * @param {*} prizePoolType
   * @param {*} assetSymbol
   */
  const updateTicketLabels = (prizePoolType, assetSymbol = '') => {
    if (!userChangedTicketName) {
      setTicketName(joinText(['CT', getPrizePoolName(prizePoolType), assetSymbol, 'Ticket']))
    }
    if (!userChangedSponsorshipName) {
      setSponsorshipName(
        joinText(['CT', getPrizePoolName(prizePoolType), assetSymbol, 'Sponsorship'])
      )
    }
    if (!userChangedTicketSymbol) {
      setTicketSymbol(joinText(['T', getPrizePoolSymbol(prizePoolType), assetSymbol], ''))
    }
    if (!userChangedSponsorshipTicker) {
      setSponsorshipSymbol(joinText(['S', getPrizePoolSymbol(prizePoolType), assetSymbol], ''))
    }
  }

  /**
   * Updates the state of the selected Prize Pool type
   * & updates token names
   * @param {*} prizePoolType new Prize Pool Type
   */
  const updatePrizePoolType = (prizePoolType) => {
    switch (prizePoolType) {
      case PRIZE_POOL_TYPE.compound: {
        updateTicketLabels(prizePoolType, cToken)
        break
      }
      case PRIZE_POOL_TYPE.sovryn: {
        updateTicketLabels(prizePoolType, iToken)
        break
      }
      case PRIZE_POOL_TYPE.stake: {
        updateTicketLabels(prizePoolType, '')
        break
      }
    }
    setPrizePoolType(prizePoolType)
  }

  /**
   * Updates the state of the selected cToken
   * & updates token names
   * @param {*} cToken new cToken to select
   */
  const updateCToken = (cToken) => {
    updateTicketLabels(PRIZE_POOL_TYPE.compound, COMPOUND_TOKENS[cToken].value)
    setCToken(cToken)
  }

  /**
   * Updates the state of the selected iToken
   * & updates token names
   * @param {*} iToken new iToken to select
   */
  const updateIToken = (iToken) => {
    updateTicketLabels(PRIZE_POOL_TYPE.sovryn, SOVRYN_TOKENS[iToken].value)
    setIToken(iToken)
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='font-bold mb-4 sm:mb-6 text-lg sm:text-5xl text-accent-1'>
          Prize Pool Parameters
        </div>

        <PrizePoolTypeCard
          prizePoolType={prizePoolType}
          updatePrizePoolType={updatePrizePoolType}
        />

        {Boolean(prizePoolType) && (
          <>
            <TokenDetailsCard
              prizePoolType={prizePoolType}
              cToken={cToken}
              iToken={iToken}
              updateCToken={updateCToken}
              updateIToken={updateIToken}
              stakedTokenAddress={stakedTokenAddress}
              stakedTokenData={stakedTokenData}
              setStakedTokenAddress={setStakedTokenAddress}
              setStakedTokenData={setStakedTokenData}
              updateTicketLabels={updateTicketLabels}
              setUserChangedTicketName={setUserChangedTicketName}
              ticketName={ticketName}
              setTicketName={setTicketName}
              setUserChangedTicketSymbol={setUserChangedTicketSymbol}
              ticketSymbol={ticketSymbol}
              setTicketSymbol={setTicketSymbol}
              setUserChangedSponsorshipName={setUserChangedSponsorshipName}
              sponsorshipName={sponsorshipName}
              setSponsorshipName={setSponsorshipName}
              setUserChangedSponsorshipTicker={setUserChangedSponsorshipTicker}
              sponsorshipSymbol={sponsorshipSymbol}
              setSponsorshipSymbol={setSponsorshipSymbol}
            />

            <RNGCard setRngService={setRngService} rngService={rngService} />

            <PrizePeriodCard
              userChangedCreditMaturation={userChangedCreditMaturation}
              setCreditMaturationInDays={setCreditMaturationInDays}
              setPrizePeriodInDays={setPrizePeriodInDays}
              prizePeriodInDays={prizePeriodInDays}
            />

            <FairnessCard
              setTicketCreditLimitPercentage={setTicketCreditLimitPercentage}
              ticketCreditLimitPercentage={ticketCreditLimitPercentage}
              setUserChangedCreditMaturation={setUserChangedCreditMaturation}
              setCreditMaturationInDays={setCreditMaturationInDays}
              creditMaturationInDays={creditMaturationInDays}
            />

            <div className='mt-10 mb-4 sm:mb-10'>
              <Button
                className='w-full'
                backgroundColorClasses='bg-green hover:bg-highlight-4 active:bg-highlight-5'
                color='green'
              >
                Create New Prize Pool
              </Button>
            </div>
          </>
        )}
      </form>
    </>
  )
}
