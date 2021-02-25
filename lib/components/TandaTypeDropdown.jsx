import React, { useState } from 'react'

import { DropdownInputGroup } from 'lib/components/DropdownInputGroup'
import { PRIZE_POOL_VALUE } from 'lib/constants'

export const TandaTypeDropdown = (props) => {
  const { tandaType, setTandaType } = props

  const [currentTandaType, setCurrentTandaType] = useState(tandaType)

  const tandaTypes = {
    black: {
      value: PRIZE_POOL_VALUE.black,
      view: <>Black - Minimum value 1000</>
    },
    gold: {
      value: PRIZE_POOL_VALUE.gold,
      view: <>Gold - Minimum value 100</>
    },
    silver: {
      value: PRIZE_POOL_VALUE.silver,
      view: <>Silver - Minimum value 10</>
    }
  }

  const onValueSet = (newPrizePool) => {
    setCurrentTandaType(newPrizePool)
    setTandaType(newPrizePool)
  }

  const formatValue = (key) => tandaTypes[key].view

  return (
    <>
      <DropdownInputGroup
        id='prize-pool-dropdown'
        placeHolder='Select the type of prize pool'
        label={'Pool type'}
        formatValue={formatValue}
        onValueSet={onValueSet}
        current={currentTandaType}
        values={tandaTypes}
        required
      />
    </>
  )
}
