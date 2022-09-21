// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract SignatureUtils {
    function getMessageHash(
        string memory transactionId_,
        address curToken_,  
        string memory desToken_,
        address curUser_,
        string memory desUser_,
        uint256 amount_
    )public pure returns (bytes32){
        return
            keccak256(
                abi.encodePacked(
                    transactionId_,
                    curToken_,
                    desToken_,
                    curUser_,
                    desUser_,
                    amount_
                )
            );
    }

    function getEthSignedMessageHash(bytes32 _messageHash)
        internal
        pure
        returns (bytes32)
    {
        return
            keccak256(
                abi.encodePacked(
                    "\x19Ethereum Signed Message:\n32",
                    _messageHash
                )
            );
    }

    function verify(
        string memory transactionId_,
        address curToken_,  
        string memory desToken_,
        address curUser_,
        string memory desUser_,
        uint256 amount_,
        bytes memory signature
    ) public pure returns (address)
    {
        bytes32 messageHash = getMessageHash(transactionId_, curToken_, desToken_, curUser_, desUser_, amount_);
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
        return recoverSigner(ethSignedMessageHash, signature);
    }

    function recoverSigner(bytes32 hash, bytes memory signature)
        public
        pure
        returns (address)
    {
        bytes32 r;
        bytes32 s;
        uint8 v;

        // Check the signature length
        if (signature.length != 65) {
            return (address(0));
        }

        assembly {
            r := mload(add(signature, 0x20))
            s := mload(add(signature, 0x40))
            v := byte(0, mload(add(signature, 0x60)))
        }

        // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
        if (v < 27) {
            v += 27;
        }

        // If the version is correct return the signer address
        if (v != 27 && v != 28) {
            return (address(0));
        } else {
            // solium-disable-next-line arg-overflow
            return ecrecover(hash, v, r, s);
        }
    }
}