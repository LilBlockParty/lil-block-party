# Contracts
## Testing
Add this mainnet rpc url environment variable used in fork tests:
```
export MAINNET_RPC_URL=CHANGEME
```
Then run the tests with `forge test`.
```
$ forge test
[⠆] Compiling...
No files changed, compilation skipped

Running 9 tests for test/LilNounsOracle.t.sol:LilNounsOracleTest
[PASS] testFetchAuctionState() (gas: 8677663)
[PASS] testFetchNextNounSvg() (gas: 6090439)
[PASS] testFetchNextNounSvgAfterV2Descriptor() (gas: 216702929)
[PASS] testForkingBehavior() (gas: 4924744)
[PASS] testRefreshContractAddresses() (gas: 1457464)
[PASS] testRefusesTransfersWithCallData() (gas: 762745)
[PASS] testRefusesTransfersWithoutCallData() (gas: 762873)
[PASS] testSettleCurrentAndCreateNewAuctionExpectedHashInvalid() (gas: 782693)
[PASS] testSettleCurrentAndCreateNewAuctionExpectedHashValid() (gas: 1142806)
Test result: ok. 9 passed; 0 failed; finished in 5.13s
```
