<p align="center">
  <img src="https://github.com/CoinTanda/cointanda-ui/blob/master/assets/CT_icon_hi.png?raw=true" alt="CoinTanda Brand" style="max-width:100%;" width="200">
</p>

<br />

## CoinTanda v3 - Tanda Builder Frontend

This UI is useful for deploying a new set of Tanda contracts using the (currently unreleased) v3 PoolTogether protocol.

This app is live [here](https://cointanda-buidler.web.app).

You can easily deploy a PeriodicPrizePool with a SingleRandomWinner prize strategy, or use a custom prize strategy by entering in your own prize strategy contract address.

To run the project against a local node you can use the [cointanda-contracts](https://github.com/cointanda/cointanda-contracts/tree/version-3). With those contracts you can bootstrap a local Buidler EVM instance with test data so that you can develop the app locally.

#### Setup

Install dependencies:

```bash
$ yarn
```

Make sure you have `direnv` installed and copy `.envrc.example` to `.envrc`:

```bash
$ cp .envrc.example .envrc
```

Fill in your own values for `.envrc`, then run:

```bash
$ direnv allow
```

To run the local server, run:

```
$ yarn dev
```

To run locally but connected to the testnet:

```
$ yarn start
```

#### Adding tokens
To add a token to the builder you need to add the name and address to the network in [constants.js](https://github.com/CoinTanda/cointanda-build-ui/blob/master/lib/constants.js) and add it with it's image to [TokenDropdwon.jsx](https://github.com/CoinTanda/cointanda-build-ui/blob/master/lib/components/TokenDropdown.jsx)