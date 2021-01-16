import React, { useState } from 'react'

import { PRIZE_POOL_TYPE } from 'lib/constants'
import { DropdownInputGroup } from 'lib/components/DropdownInputGroup'

import BproPng from 'assets/images/bpro.png'
import BatSvg from 'assets/images/bat.svg'
import DocPng from 'assets/images/doc.png'
import DaiSvg from 'assets/images/dai.svg'
import UsdcSvg from 'assets/images/usdc.svg'
import UsdtSvg from 'assets/images/usdt.svg'
import WbtcSvg from 'assets/images/wbtc.svg'
import RbtcSvg from 'assets/images/rbtc.svg'
import ZrxSvg from 'assets/images/zrx.svg'
import RifPng from 'assets/images/rif.png'

export const SOVRYN_TOKENS = Object.freeze({
  iBpro: {
    value: 'iBPro',
    view: (
      <>
        <img src={BproPng} className='inline-block w-6 sm:w-8 mr-3' />
        BPro
      </>
    ),
  },
  iDoc: {
    value: 'iDOC',
    view: (
      <>
        <img src={DocPng} className='inline-block w-6 sm:w-8 mr-3' />
        DOC
      </>
    ),
  },
  iUsdc: {
    value: 'iUSDT',
    view: (
      <>
        <img src={UsdtSvg} className='inline-block w-6 sm:w-8 mr-3' />
        USDT
      </>
    ),
  },
})

export const COMPOUND_TOKENS = Object.freeze({
  cDai: {
    value: 'cDAI',
    view: (
      <>
        <img src={DaiSvg} className='inline-block w-6 sm:w-8 mr-3' />
        Dai
      </>
    ),
  },
  cRif: {
    value: 'cRif',
    view: (
      <>
        <img src={RifPng} className='inline-block w-6 sm:w-8 mr-3' />
        Rif
      </>
    ),
  },
  // cRbtc: {
  //   value: 'cRBTC',
  //   view: (
  //     <>
  //       <img src={RbtcSvg} className='inline-block w-6 sm:w-8 mr-3' />
  //       Bitcoin
  //     </>
  //   ),
  // },
  // cUsdc: {
  //   value: 'cUSDC',
  //   view: (
  //     <>
  //       <img src={UsdcSvg} className='inline-block w-6 sm:w-8 mr-3' />
  //       USDC
  //     </>
  //   ),
  // },
  // cUsdt: {
  //   value: 'cUSDT',
  //   view: (
  //     <>
  //       <img src={UsdtSvg} className='inline-block w-6 sm:w-8 mr-3' />
  //       Tether
  //     </>
  //   ),
  // },
  // cBat: {
  //   value: 'cBAT',
  //   view: (
  //     <>
  //       <img src={BatSvg} className='inline-block w-6 sm:w-8 mr-3' />
  //       Basic Attn Token
  //     </>
  //   ),
  // },
  // cWbtc: {
  //   value: 'cWBTC',
  //   view: (
  //     <>
  //       <img src={WbtcSvg} className='inline-block w-6 sm:w-8 mr-3' />
  //       Wrapped Bitcoin
  //     </>
  //   ),
  // },
  // cZrx: {
  //   value: 'cZRX',
  //   view: (
  //     <>
  //       <img src={ZrxSvg} className='inline-block w-6 sm:w-8 mr-3' />
  //       0x
  //     </>
  //   ),
  // },
})

export const TokenDropdown = (props) => {

  var currentToken, setCurrentToken, tokenList;
  if (props.prizePoolType === PRIZE_POOL_TYPE.compound) {
    [currentToken, setCurrentToken] = useState(props.cToken)
    tokenList = COMPOUND_TOKENS
  } else if (props.prizePoolType === PRIZE_POOL_TYPE.sovryn) {
    [currentToken, setCurrentToken] = useState(props.iToken)
    tokenList = SOVRYN_TOKENS
  }

  const onValueSet = (newToken) => {
    setCurrentToken(newToken)
    props.onChange(newToken)
  }

  const formatValue = (key) => tokenList[key].view
  return (
    <>
      <DropdownInputGroup
        id='token-dropdown'
        placeHolder='Select a token to be deposited and used as a yield source'
        label={'Deposit token'}
        formatValue={formatValue}
        onValueSet={onValueSet}
        current={currentToken}
        values={tokenList}
      />
    </>
  )
}
