import React from 'react'

import { Card } from 'lib/components/Card'
import { InputLabel } from 'lib/components/InputLabel'
import { PrizePoolDropdown } from 'lib/components/PrizePoolDropdown'
import { TandaTypeDropdown } from 'lib/components/TandaTypeDropdown'
import { TextInputGroup } from './TextInputGroup'

export const PrizePoolTypeCard = (props) => {
  const { prizePoolType, updatePrizePoolType,  tandaType, setTandaType } = props

  return (
    <Card>
      <InputLabel
        primary='Tanda Type'
        description='The minimun value that is permited, for example black is 1000, gold is 100, and silver is 10'
      >
        <TandaTypeDropdown
          tandaType={tandaType}
          setTandaType={setTandaType}
        />
      </InputLabel>
      <InputLabel
        primary='Pool Type'
        description='A “Yield Prize Pool” earns yield on deposited tokens which generate the prize. A “Stake Prize Pool” does not earn yield on deposited tokens and the prize must be added manually by the pool creator.'
      >
        <PrizePoolDropdown
          updatePrizePoolType={updatePrizePoolType}
          prizePoolType={prizePoolType}
        />
      </InputLabel>
    </Card>
  )
}
