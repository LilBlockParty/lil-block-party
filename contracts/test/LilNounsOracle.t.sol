//// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/LilNounsOracle.sol";
import "lil-nouns/NounsToken.sol";
import "lil-nouns/NounsSeeder.sol";
import "lil-nouns/interfaces/INounsDescriptor.sol";
import "lil-nouns/NounsAuctionHouse.sol";

contract LilNounsOracleTest is Test {
    NounsToken lilNounsToken;
    NounsAuctionHouse auctionHouse;
    INounsDescriptor descriptor;
    LilNounsOracle oracle;

    // Lil Noun 3935 was minted at block 15233857
    // See https://etherscan.io/tx/0x1c99ac9ee5ae42e48792c986b9d58251ac725aed744221b90db2a21c6ab1b641
    uint256 constant BLOCK_AT_3935_MINT = 15233857;
    // https://etherscan.io/block/15505027
    uint256 constant BLOCK_AT_5717_MINT = 15505027;
    // See https://etherscan.io/tx/0xd6c6dc31f969ad1e59cc54641a518512fc3c8c3dbe97770fc49e7ca9bafe9fd7
    uint256 constant AUCTION_HOUSE_DEPLOY_BLOCK = 14736713;

    address constant LIL_NOUNS_TOKEN_ADDRESS =
        0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B;
    address constant AUCTION_HOUSE_ADDRESS =
        0x55e0F7A3bB39a28Bd7Bcc458e04b3cF00Ad3219E;
    address constant V1_DESCRIPTOR_ADDRESS =
        0x11fb55d9580CdBfB83DE3510fF5Ba74309800Ad1;
    address constant V2_DESCRIPTOR_ADDRESS =
        0xb2a47999b3117c7dD628920ED8e77eBDfB948B68;
    address constant SEEDER_ADDRESS =
        0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515;

    receive() external payable {}

    string MAINNET_RPC_URL;
    string expectedSvgFor3935 =
        "PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgdmlld0JveD0iMCAwIDMyMCAzMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZDVkN2UxIiAvPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAiIHg9IjExMCIgeT0iMjYwIiBmaWxsPSIjY2ZjMmFiIiAvPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAiIHg9IjExMCIgeT0iMjcwIiBmaWxsPSIjY2ZjMmFiIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTEwIiB5PSIyODAiIGZpbGw9IiNjZmMyYWIiIC8+PHJlY3Qgd2lkdGg9IjcwIiBoZWlnaHQ9IjEwIiB4PSIxNDAiIHk9IjI4MCIgZmlsbD0iI2NmYzJhYiIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjExMCIgeT0iMjkwIiBmaWxsPSIjY2ZjMmFiIiAvPjxyZWN0IHdpZHRoPSI3MCIgaGVpZ2h0PSIxMCIgeD0iMTQwIiB5PSIyOTAiIGZpbGw9IiNjZmMyYWIiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxMTAiIHk9IjMwMCIgZmlsbD0iI2NmYzJhYiIgLz48cmVjdCB3aWR0aD0iNzAiIGhlaWdodD0iMTAiIHg9IjE0MCIgeT0iMzAwIiBmaWxsPSIjY2ZjMmFiIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTEwIiB5PSIzMTAiIGZpbGw9IiNjZmMyYWIiIC8+PHJlY3Qgd2lkdGg9IjcwIiBoZWlnaHQ9IjEwIiB4PSIxNDAiIHk9IjMxMCIgZmlsbD0iI2NmYzJhYiIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE0MCIgeT0iMjYwIiBmaWxsPSIjZmZjMTEwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTgwIiB5PSIyNjAiIGZpbGw9IiNmZmMxMTAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNTAiIHk9IjI3MCIgZmlsbD0iI2ZmYzExMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMjcwIiBmaWxsPSIjZmZjMTEwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTYwIiB5PSIyODAiIGZpbGw9IiNmZmMxMTAiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxNjAiIHk9IjI5MCIgZmlsbD0iI2ZmYzExMCIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjE1MCIgeT0iMzAwIiBmaWxsPSIjZmZjMTEwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSI2MCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjE0MCIgeT0iNzAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxNDAiIHk9IjgwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTcwIiB5PSI4MCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIHg9IjEzMCIgeT0iOTAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSI2MCIgeT0iMTAwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIxMCIgeD0iMTMwIiB5PSIxMDAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIyNDAiIHk9IjEwMCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjYwIiB5PSIxMTAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwIiB4PSIxNDAiIHk9IjExMCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE4MCIgeT0iMTEwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMjMwIiB5PSIxMTAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwIiB4PSI2MCIgeT0iMTIwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTAwIiB5PSIxMjAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjEwIiB4PSIxMzAiIHk9IjEyMCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iMzAiIGhlaWdodD0iMTAiIHg9IjIyMCIgeT0iMTIwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIxMCIgeD0iNzAiIHk9IjEzMCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iMTAiIHg9IjEzMCIgeT0iMTMwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIxMCIgeD0iMjAwIiB5PSIxMzAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjEwIiB4PSI3MCIgeT0iMTQwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIxMCIgeD0iMTQwIiB5PSIxNDAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjEwIiB4PSIxOTAiIHk9IjE0MCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iNTAiIGhlaWdodD0iMTAiIHg9IjgwIiB5PSIxNTAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwIiB4PSIxNDAiIHk9IjE1MCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIHg9IjE5MCIgeT0iMTUwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMjAiIHk9IjE2MCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iMTMwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMTYwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMjgwIiB5PSIxNjAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIzMCIgeT0iMTcwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iNjAiIHk9IjE3MCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iMTEwIiBoZWlnaHQ9IjEwIiB4PSIxMDAiIHk9IjE3MCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjI2MCIgeT0iMTcwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIxMCIgeD0iMzAiIHk9IjE4MCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iMTkwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMTgwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSIyMzAiIGhlaWdodD0iMTAiIHg9IjQwIiB5PSIxOTAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjE5MCIgaGVpZ2h0PSIxMCIgeD0iNjAiIHk9IjIwMCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjEwIiB4PSI3MCIgeT0iMjEwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIxMCIgeD0iMTEwIiB5PSIyMjAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNDAiIHk9IjIyMCIgZmlsbD0iIzBiNTAyNyIgLz48cmVjdCB3aWR0aD0iNTAiIGhlaWdodD0iMTAiIHg9IjE1MCIgeT0iMjIwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSI1MCIgaGVpZ2h0PSIxMCIgeD0iMTAwIiB5PSIyMzAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxNTAiIHk9IjIzMCIgZmlsbD0iIzBiNTAyNyIgLz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMjMwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTAiIHg9IjgwIiB5PSIyNDAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjE3MCIgaGVpZ2h0PSIxMCIgeD0iNzAiIHk9IjI1MCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjYwIiB5PSIyNjAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIyMzAiIHk9IjI2MCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iMTAiIHg9IjgwIiB5PSIxNDAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjE0MCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjgwIiB5PSIxNTAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMTUwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIxMCIgeD0iMTEwIiB5PSIxNTAiIGZpbGw9IiNmZjBlMGUiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNTAiIHk9IjE1MCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMTUwIiBmaWxsPSIjMDAwMDAwIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTgwIiB5PSIxNTAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwIiB4PSIyMDAiIHk9IjE1MCIgZmlsbD0iI2ZmMGUwZSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjI0MCIgeT0iMTUwIiBmaWxsPSIjMDAwMDAwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iODAiIHk9IjE2MCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIxNjAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwIiB4PSIxMTAiIHk9IjE2MCIgZmlsbD0iI2ZmMGUwZSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE1MCIgeT0iMTYwIiBmaWxsPSIjMDAwMDAwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTcwIiB5PSIxNjAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxODAiIHk9IjE2MCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIHg9IjIwMCIgeT0iMTYwIiBmaWxsPSIjZmYwZTBlIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMjQwIiB5PSIxNjAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwIiB4PSI1MCIgeT0iMTcwIiBmaWxsPSIjMDAwMDAwIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iOTAiIHk9IjE3MCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIHg9IjExMCIgeT0iMTcwIiBmaWxsPSIjZmYwZTBlIiAvPjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSIxNzAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxODAiIHk9IjE3MCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIHg9IjIwMCIgeT0iMTcwIiBmaWxsPSIjZmYwZTBlIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMjQwIiB5PSIxNzAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSI1MCIgeT0iMTgwIiBmaWxsPSIjMDAwMDAwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iODAiIHk9IjE4MCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIxODAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwIiB4PSIxMTAiIHk9IjE4MCIgZmlsbD0iI2ZmMGUwZSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE1MCIgeT0iMTgwIiBmaWxsPSIjMDAwMDAwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTcwIiB5PSIxODAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxODAiIHk9IjE4MCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIHg9IjIwMCIgeT0iMTgwIiBmaWxsPSIjZmYwZTBlIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMjQwIiB5PSIxODAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSI1MCIgeT0iMTkwIiBmaWxsPSIjMDAwMDAwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iODAiIHk9IjE5MCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIxOTAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwIiB4PSIxMTAiIHk9IjE5MCIgZmlsbD0iI2ZmMGUwZSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE1MCIgeT0iMTkwIiBmaWxsPSIjMDAwMDAwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTcwIiB5PSIxOTAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxODAiIHk9IjE5MCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIHg9IjIwMCIgeT0iMTkwIiBmaWxsPSIjZmYwZTBlIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMjQwIiB5PSIxOTAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSI4MCIgeT0iMjAwIiBmaWxsPSIjMDAwMDAwIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iOTAiIHk9IjIwMCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIHg9IjExMCIgeT0iMjAwIiBmaWxsPSIjZmYwZTBlIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSIyMDAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjIwMCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjE4MCIgeT0iMjAwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIxMCIgeD0iMjAwIiB5PSIyMDAiIGZpbGw9IiNmZjBlMGUiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIyNDAiIHk9IjIwMCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iMTAiIHg9IjgwIiB5PSIyMTAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjIxMCIgZmlsbD0iIzAwMDAwMCIgLz48L3N2Zz4=";
    string expectedSvgFor5717 =
        "PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgdmlld0JveD0iMCAwIDMyMCAzMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZDVkN2UxIiAvPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAiIHg9IjExMCIgeT0iMjYwIiBmaWxsPSIjZmZmZGYyIiAvPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAiIHg9IjExMCIgeT0iMjcwIiBmaWxsPSIjZmZmZGYyIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTEwIiB5PSIyODAiIGZpbGw9IiNmZmZkZjIiIC8+PHJlY3Qgd2lkdGg9IjcwIiBoZWlnaHQ9IjEwIiB4PSIxNDAiIHk9IjI4MCIgZmlsbD0iI2ZmZmRmMiIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjExMCIgeT0iMjkwIiBmaWxsPSIjZmZmZGYyIiAvPjxyZWN0IHdpZHRoPSI3MCIgaGVpZ2h0PSIxMCIgeD0iMTQwIiB5PSIyOTAiIGZpbGw9IiNmZmZkZjIiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxMTAiIHk9IjMwMCIgZmlsbD0iI2ZmZmRmMiIgLz48cmVjdCB3aWR0aD0iNzAiIGhlaWdodD0iMTAiIHg9IjE0MCIgeT0iMzAwIiBmaWxsPSIjZmZmZGYyIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTEwIiB5PSIzMTAiIGZpbGw9IiNmZmZkZjIiIC8+PHJlY3Qgd2lkdGg9IjcwIiBoZWlnaHQ9IjEwIiB4PSIxNDAiIHk9IjMxMCIgZmlsbD0iI2ZmZmRmMiIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjExMCIgeT0iMjYwIiBmaWxsPSIjZmZlZjE2IiAvPjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSIyNjAiIGZpbGw9IiNmZmVmMTYiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIyMDAiIHk9IjI2MCIgZmlsbD0iI2ZmZWYxNiIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjExMCIgeT0iMjcwIiBmaWxsPSIjZmZlZjE2IiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTkwIiB5PSIyNzAiIGZpbGw9IiNmZmVmMTYiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxMTAiIHk9IjI4MCIgZmlsbD0iI2ZmZWYxNiIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE0MCIgeT0iMjgwIiBmaWxsPSIjZmZlZjE2IiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTYwIiB5PSIyODAiIGZpbGw9IiNmZmVmMTYiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxOTAiIHk9IjI4MCIgZmlsbD0iI2ZmZWYxNiIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjExMCIgeT0iMjkwIiBmaWxsPSIjZmZlZjE2IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTQwIiB5PSIyOTAiIGZpbGw9IiNmZmVmMTYiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxNjAiIHk9IjI5MCIgZmlsbD0iI2ZmZWYxNiIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjE5MCIgeT0iMjkwIiBmaWxsPSIjZmZlZjE2IiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTEwIiB5PSIzMDAiIGZpbGw9IiNmZmVmMTYiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNDAiIHk9IjMwMCIgZmlsbD0iI2ZmZWYxNiIgLz48cmVjdCB3aWR0aD0iMzAiIGhlaWdodD0iMTAiIHg9IjE4MCIgeT0iMzAwIiBmaWxsPSIjZmZlZjE2IiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTEwIiB5PSIzMTAiIGZpbGw9IiNmZmVmMTYiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxOTAiIHk9IjMxMCIgZmlsbD0iI2ZmZWYxNiIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE1MCIgeT0iNjAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxNDAiIHk9IjcwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTQwIiB5PSI4MCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iODAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwIiB4PSIxMzAiIHk9IjkwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iNjAiIHk9IjEwMCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIHg9IjEzMCIgeT0iMTAwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMjQwIiB5PSIxMDAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSI2MCIgeT0iMTEwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIxMCIgeD0iMTQwIiB5PSIxMTAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxODAiIHk9IjExMCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjIzMCIgeT0iMTEwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIxMCIgeD0iNjAiIHk9IjEyMCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjEwMCIgeT0iMTIwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSI1MCIgaGVpZ2h0PSIxMCIgeD0iMTMwIiB5PSIxMjAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwIiB4PSIyMjAiIHk9IjEyMCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIHg9IjcwIiB5PSIxMzAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjEwIiB4PSIxMzAiIHk9IjEzMCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIHg9IjIwMCIgeT0iMTMwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSI1MCIgaGVpZ2h0PSIxMCIgeD0iNzAiIHk9IjE0MCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIHg9IjE0MCIgeT0iMTQwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSI1MCIgaGVpZ2h0PSIxMCIgeD0iMTkwIiB5PSIxNDAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjEwIiB4PSI4MCIgeT0iMTUwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIxMCIgeD0iMTQwIiB5PSIxNTAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwIiB4PSIxOTAiIHk9IjE1MCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjIwIiB5PSIxNjAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjEzMCIgaGVpZ2h0PSIxMCIgeD0iOTAiIHk9IjE2MCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjI4MCIgeT0iMTYwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMzAiIHk9IjE3MCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjYwIiB5PSIxNzAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjExMCIgaGVpZ2h0PSIxMCIgeD0iMTAwIiB5PSIxNzAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIyNjAiIHk9IjE3MCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIHg9IjMwIiB5PSIxODAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjE5MCIgaGVpZ2h0PSIxMCIgeD0iOTAiIHk9IjE4MCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iMjMwIiBoZWlnaHQ9IjEwIiB4PSI0MCIgeT0iMTkwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSIxOTAiIGhlaWdodD0iMTAiIHg9IjYwIiB5PSIyMDAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjE1MCIgaGVpZ2h0PSIxMCIgeD0iNzAiIHk9IjIxMCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iMzAiIGhlaWdodD0iMTAiIHg9IjExMCIgeT0iMjIwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTQwIiB5PSIyMjAiIGZpbGw9IiMwYjUwMjciIC8+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjEwIiB4PSIxNTAiIHk9IjIyMCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iNTAiIGhlaWdodD0iMTAiIHg9IjEwMCIgeT0iMjMwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSIyMzAiIGZpbGw9IiMwYjUwMjciIC8+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjIzMCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjEwIiB4PSI4MCIgeT0iMjQwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSIxNzAiIGhlaWdodD0iMTAiIHg9IjcwIiB5PSIyNTAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSI2MCIgeT0iMjYwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMjMwIiB5PSIyNjAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjEwIiB4PSI4MCIgeT0iMTQwIiBmaWxsPSIjZWM1YjQzIiAvPjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSIxMCIgeD0iMTcwIiB5PSIxNDAiIGZpbGw9IiNlYzViNDMiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSI4MCIgeT0iMTUwIiBmaWxsPSIjZWM1YjQzIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iOTAiIHk9IjE1MCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIHg9IjExMCIgeT0iMTUwIiBmaWxsPSIjMDAwMDAwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSIxNTAiIGZpbGw9IiNlYzViNDMiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjE1MCIgZmlsbD0iI2VjNWI0MyIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjE4MCIgeT0iMTUwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIxMCIgeD0iMjAwIiB5PSIxNTAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIyNDAiIHk9IjE1MCIgZmlsbD0iI2VjNWI0MyIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjgwIiB5PSIxNjAiIGZpbGw9IiNlYzViNDMiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMTYwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIxMCIgeD0iMTEwIiB5PSIxNjAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNTAiIHk9IjE2MCIgZmlsbD0iI2VjNWI0MyIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMTYwIiBmaWxsPSIjZWM1YjQzIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTgwIiB5PSIxNjAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwIiB4PSIyMDAiIHk9IjE2MCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjI0MCIgeT0iMTYwIiBmaWxsPSIjZWM1YjQzIiAvPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIxMCIgeD0iNTAiIHk9IjE3MCIgZmlsbD0iI2VjNWI0MyIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIxNzAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwIiB4PSIxMTAiIHk9IjE3MCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMzAiIGhlaWdodD0iMTAiIHg9IjE1MCIgeT0iMTcwIiBmaWxsPSIjZWM1YjQzIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTgwIiB5PSIxNzAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwIiB4PSIyMDAiIHk9IjE3MCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjI0MCIgeT0iMTcwIiBmaWxsPSIjZWM1YjQzIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iNTAiIHk9IjE4MCIgZmlsbD0iI2VjNWI0MyIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjgwIiB5PSIxODAiIGZpbGw9IiNlYzViNDMiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMTgwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIxMCIgeD0iMTEwIiB5PSIxODAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNTAiIHk9IjE4MCIgZmlsbD0iI2VjNWI0MyIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMTgwIiBmaWxsPSIjZWM1YjQzIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTgwIiB5PSIxODAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwIiB4PSIyMDAiIHk9IjE4MCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjI0MCIgeT0iMTgwIiBmaWxsPSIjZWM1YjQzIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iNTAiIHk9IjE5MCIgZmlsbD0iI2VjNWI0MyIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjgwIiB5PSIxOTAiIGZpbGw9IiNlYzViNDMiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMTkwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIxMCIgeD0iMTEwIiB5PSIxOTAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNTAiIHk9IjE5MCIgZmlsbD0iI2VjNWI0MyIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMTkwIiBmaWxsPSIjZWM1YjQzIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTgwIiB5PSIxOTAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwIiB4PSIyMDAiIHk9IjE5MCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjI0MCIgeT0iMTkwIiBmaWxsPSIjZWM1YjQzIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iODAiIHk9IjIwMCIgZmlsbD0iI2VjNWI0MyIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIyMDAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwIiB4PSIxMTAiIHk9IjIwMCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE1MCIgeT0iMjAwIiBmaWxsPSIjZWM1YjQzIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTcwIiB5PSIyMDAiIGZpbGw9IiNlYzViNDMiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxODAiIHk9IjIwMCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIHg9IjIwMCIgeT0iMjAwIiBmaWxsPSIjMDAwMDAwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMjQwIiB5PSIyMDAiIGZpbGw9IiNlYzViNDMiIC8+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjEwIiB4PSI4MCIgeT0iMjEwIiBmaWxsPSIjZWM1YjQzIiAvPjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSIxMCIgeD0iMTcwIiB5PSIyMTAiIGZpbGw9IiNlYzViNDMiIC8+PC9zdmc+";

    function setUp() public {
        MAINNET_RPC_URL = vm.envString("MAINNET_RPC_URL");
        auctionHouse = NounsAuctionHouse(AUCTION_HOUSE_ADDRESS);
        lilNounsToken = NounsToken(LIL_NOUNS_TOKEN_ADDRESS);
    }

    function deployLilNounsOracle() public returns (LilNounsOracle) {
        LilNounsOracle o = new LilNounsOracle(
            LIL_NOUNS_TOKEN_ADDRESS,
            AUCTION_HOUSE_ADDRESS,
            SEEDER_ADDRESS,
            V2_DESCRIPTOR_ADDRESS
        );
        o.refreshContractAddresses();
        return o;
    }

    // Helpers
    // Used to test negative assertions (assertNotEqual does not exist)
    function svgIsLilNoun3935(string memory svg3935)
        public
        view
        returns (bool)
    {
        // Compare hashes because Solidity doesn't support string equality'
        // comparison
        return
            keccak256(abi.encodePacked(expectedSvgFor3935)) ==
            keccak256(abi.encodePacked(svg3935));
    }

    function svgIsLilNoun5717(string memory svg5717)
        public
        view
        returns (bool)
    {
        // Compare hashes because Solidity doesn't support string equality'
        // comparison
        return
            keccak256(abi.encodePacked(expectedSvgFor5717)) ==
            keccak256(abi.encodePacked(svg5717));
    }

    // Tests
    //
    // testForkingBehavior does not test the LilNounsOracle contract.
    // It is included to establish/verify how fork testing can be
    // expected to work for other tests the other tests.
    function testForkingBehavior() public {
        // The goal of this test is to verify that the blockchain state after
        // running vm.rollFork(blockNumberX) includes all transactions at
        // blockNumberX
        vm.createSelectFork(MAINNET_RPC_URL);
        vm.rollFork(BLOCK_AT_3935_MINT);
        assertEq(block.number, BLOCK_AT_3935_MINT);

        // If forks that is set to blockNumberX includes all transactions in
        // blockNumberX,
        // we'd expect the next nounId to be 3936
        oracle = deployLilNounsOracle();
        (uint256 blockNumber, uint256 nextNounId, , , ) = oracle
            .fetchNextNoun();
        assertEq(blockNumber, BLOCK_AT_3935_MINT);
        assertEq(nextNounId, 3936); // Verified fork behavior

        // Also double check the svg is the expected svg at this block
        (
            uint48 background,
            uint48 body,
            uint48 access,
            uint48 head,
            uint48 glasses
        ) = lilNounsToken.seeds(3935);
        INounsSeeder.Seed memory seed3935 = INounsSeeder.Seed(
            background,
            body,
            access,
            head,
            glasses
        );
        descriptor = INounsDescriptor(oracle.descriptor());
        string memory svg3935 = descriptor.generateSVGImage(seed3935);

        assertTrue(svgIsLilNoun3935(svg3935));
    }

    function testSettleCurrentAndCreateNewAuctionExpectedHashValid() public {
        vm.createSelectFork(MAINNET_RPC_URL);
        vm.rollFork(BLOCK_AT_5717_MINT - 1);
        oracle = deployLilNounsOracle();
        (uint256 nounIdBeforeSettle, , , , , ) = auctionHouse.auction();
        assertEq(nounIdBeforeSettle, 5716);

        // uint256 reservePrice = auctionHouse.reservePrice();
        // oracle.settleAuction{value: reservePrice}(BLOCK_AT_5717_MINT - 1);
        oracle.settleAuction(BLOCK_AT_5717_MINT - 1);

        // Verify the nounId in the auction
        uint256 nounIdAfterSettle;
        (nounIdAfterSettle, , , , , ) = auctionHouse.auction();
        assertEq(nounIdBeforeSettle + 1, nounIdAfterSettle);
    }

    function testSettleCurrentAndCreateNewAuctionExpectedHashInvalid() public {
        vm.createSelectFork(MAINNET_RPC_URL);
        vm.rollFork(BLOCK_AT_3935_MINT); // Already minted
        oracle = deployLilNounsOracle();
        (uint256 nounIdBeforeSettle, , , , , ) = auctionHouse.auction();

        // Expect the transaction to revert since the blocknumber is too old
        // 0x6da5..61 is the blocknumber of the block before noun 3935 was minted. See https://etherscan.io/block/15233856
        // bytes32 expiredHash = PARENT_BLOCKHASH_BEFORE_3935_MINT;
        // uint256 reservePrice = auctionHouse.reservePrice();
        vm.expectRevert("Lil Noun expired.");
        // oracle.settleAuction{value: reservePrice}(BLOCK_AT_3935_MINT - 1);
        oracle.settleAuction(BLOCK_AT_3935_MINT - 1);
        uint256 nounIdAfterSettle;
        (nounIdAfterSettle, , , , , ) = auctionHouse.auction();
        assertEq(nounIdBeforeSettle, nounIdAfterSettle);
    }

    function testRefusesTransfersWithoutCallData() public {
        vm.createSelectFork(MAINNET_RPC_URL);
        oracle = deployLilNounsOracle();
        vm.expectRevert("revert");
        (bool sent, ) = payable(address(oracle)).call{value: 1 ether}(
            new bytes(0)
        );
        assertFalse(sent);
    }

    function testRefusesTransfersWithCallData() public {
        vm.createSelectFork(MAINNET_RPC_URL);
        oracle = deployLilNounsOracle();
        vm.expectRevert("revert");
        (bool sent, ) = payable(address(oracle)).call{value: 1 ether}(
            "calldata"
        );
        assertFalse(sent);
    }

    function testFetchNextNounSvg() public {
        // Goal of this test is to verify LilNounsOracle
        // contract accurately calculates the next noun ID svg if
        // fetchNextNoun is called with blocktag='pending'

        // Roll state to block one block before 3935 is minted
        vm.createSelectFork(MAINNET_RPC_URL);
        vm.rollFork(BLOCK_AT_3935_MINT - 1);
        oracle = deployLilNounsOracle();
        (
            uint256 blockNumber,
            uint256 nextNounId,
            string memory svg3935,
            ,

        ) = oracle.fetchNextNoun();
        assertEq(blockNumber, BLOCK_AT_3935_MINT - 1);
        assertEq(nextNounId, 3935);

        // Expect not equal because the calculation is using
        // BLOCK_AT_3935_MINT-1  as the block.number but 3935 was actually
        // minted with the following that block.number + 1
        assertFalse(svgIsLilNoun3935(svg3935));

        // Update only block.number / block.hash to BLOCK_AT_3935_MINT, and but otherwise
        // keep the state of the previous block
        vm.roll(BLOCK_AT_3935_MINT); // Note: vm.roll() is not vm.rollFork()

        // The current state effectively simulates BLOCK_AT_3935_MINT
        // during the 'pending' state: it has all the state of 0x...56, but
        // all calls are made in the context of block.number being 0x...57.
        //
        // This is how the frontend will fetch the next noun SVG,
        // by passing blockTag='pending'.
        (blockNumber, nextNounId, svg3935, , ) = oracle.fetchNextNoun();
        assertEq(blockNumber, BLOCK_AT_3935_MINT);
        assertEq(nextNounId, 3935);
        assertTrue(svgIsLilNoun3935(svg3935));
    }

    // testFetchNextNounSvg5717 is the same as testFetchNextNounSvg
    // except it runs on a block after the V2 descriptor was deployed
    function testFetchNextNounSvgAfterV2Descriptor() public {
        // Lil Noun 5717 was minted after token contract was upgraded
        // To use the the V2 Descriptor
        vm.createSelectFork(MAINNET_RPC_URL);
        vm.rollFork(BLOCK_AT_5717_MINT - 1);
        oracle = deployLilNounsOracle();
        (
            uint256 blockNumber,
            uint256 nextNounId,
            string memory svg5717,
            ,

        ) = oracle.fetchNextNoun();
        assertEq(blockNumber, BLOCK_AT_5717_MINT - 1);
        assertEq(nextNounId, 5717);
        assertFalse(svgIsLilNoun5717(svg5717));

        vm.roll(BLOCK_AT_5717_MINT);
        // The current state effectively simulates BLOCK_AT_5717_MINT
        // during the 'pending' state: it has all the state of 0x...56, but
        // all calls are made in the context of block.number being 0x...57.
        //
        // This is how the frontend will fetch the next noun SVG,
        // by passing blockTag='pending'.
        (blockNumber, nextNounId, svg5717, , ) = oracle.fetchNextNoun();
        assertEq(blockNumber, BLOCK_AT_5717_MINT);
        assertEq(nextNounId, 5717);
        assertTrue(svgIsLilNoun5717(svg5717));
    }

    function testFetchAuctionState() public {
        vm.createSelectFork(MAINNET_RPC_URL);
        // Block 0x...56 is one block before 3935 is minted.
        // The auction state should be OVER_NOT_SETTLED
        vm.rollFork(BLOCK_AT_3935_MINT - 1);
        oracle = deployLilNounsOracle();
        (, , , LilNounsOracle.AuctionState auctionState, ) = oracle
            .fetchNextNoun();
        assertEq(uint256(auctionState), 2);

        // Roll one block to 0x..57 which includes the minting of 3935
        // and thus kicks of the auction
        vm.rollFork(BLOCK_AT_3935_MINT);
        oracle = deployLilNounsOracle();
        (, , , auctionState, ) = oracle.fetchNextNoun();
        assertEq(uint256(auctionState), 1);

        // Roll to block in which the auction house contract was deployed.
        // This is the only time the auction state is NOT_STARTED
        vm.rollFork(AUCTION_HOUSE_DEPLOY_BLOCK);
        oracle = deployLilNounsOracle();
        (, , , auctionState, ) = oracle.fetchNextNoun();
        assertEq(uint256(auctionState), 0);
    }

    function testRefreshContractAddresses() public {
        vm.createSelectFork(MAINNET_RPC_URL);
        // V1 Oracle was in use when Noun 3935 was minted
        vm.rollFork(BLOCK_AT_3935_MINT);
        LilNounsOracle o = new LilNounsOracle(
            LIL_NOUNS_TOKEN_ADDRESS,
            AUCTION_HOUSE_ADDRESS,
            SEEDER_ADDRESS,
            V2_DESCRIPTOR_ADDRESS
        );
        assertEq(address(o.descriptor()), V2_DESCRIPTOR_ADDRESS);
        o.refreshContractAddresses();
        assertEq(address(o.descriptor()), V1_DESCRIPTOR_ADDRESS);

        // V2 Oracle was in use when Noun 5717 was minted
        vm.rollFork(BLOCK_AT_5717_MINT);
        o = new LilNounsOracle(
            LIL_NOUNS_TOKEN_ADDRESS,
            AUCTION_HOUSE_ADDRESS,
            SEEDER_ADDRESS,
            V2_DESCRIPTOR_ADDRESS
        );
        assertEq(address(o.descriptor()), V2_DESCRIPTOR_ADDRESS);
        o.refreshContractAddresses();
        assertEq(address(o.descriptor()), V2_DESCRIPTOR_ADDRESS);
    }
}
