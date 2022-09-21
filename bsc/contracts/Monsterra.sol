// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

// Open Zeppelin libraries for controlling upgradability and access.
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

import "./utils/SignatureUtils.sol";

struct SwapData {
   address curToken; // token of the current network/chain
   string desToken; // corresponding token of other network/chain
   address curUser; //address of the current network/chain
   string desUser; // corresponding address of other network/chain
   address signer;
   uint256 amount;
   string side;
}


contract Monsterra is Initializable, UUPSUpgradeable, OwnableUpgradeable, SignatureUtils, ReentrancyGuardUpgradeable{
   /**
   * @dev This contract using the lock unlock mechanism, for bridging between any evm chain (bsc) and destiantion chain (terra,...)
   *  When user want to buy/unlock new tokens of destination chain, they will lock their tokens in this contract 
   *  When user want to get tokens of the current chain (by burning/locking tokens in the destiantion chain), they can unlock and get token in this contract
   */
   string constant LOCK = "lock";
   string constant UNLOCK = "unlock";

   using SafeERC20Upgradeable for IERC20Upgradeable;
   
   mapping(string => SwapData) public swapDatas;
   address private signer; // signer address who is responsible for signing the unlock transaction 
   mapping(address => bool) public acceptedTokens;   // accepted tokens of the current chain 
   mapping(string => bool) public acceptedDesTokens; // accepted tokens of the destination chain 
   mapping(address => bool) public adminLists;       // admins

   mapping(address => bool) amountApprovers;  // person who accepts when the swap amount exceed the max limit 
   mapping(string => bool) approvedTxs;  // txs that are approved by the amount approver  
   
   mapping(address => uint256) public maxSwapAmounts;
   bool public paused;

   event SwapEvent(
      string transactionId,
      address indexed curToken,
      string desToken,
      address indexed curUser,
      string desUser,
      uint256 amount,
      string side
   );

   event RoleEvent(
      string eventType,
      address user,
      bool status
   );

   event SetMaxSwapEvent (
      address setter,
      address token,
      uint256 amount
   );

   event ApprovedTxsByAmountEvent(
      string[] internalTxs,
      bool status
   );

   event PauseEvent(
      address setter,
      bool status
   );

   ///@dev no constructor in upgradable contracts. Instead we have initializers
   function initialize() public initializer {
      ///@dev as there is no constructor, we need to initialise the OwnableUpgradeable explicitly
       __Ownable_init();

      adminLists[msg.sender] = true; 
      signer = msg.sender;
      paused = false;
   }

   ///@dev required by the OZ UUPS module
   function _authorizeUpgrade(address) internal override onlyOwner {}


   modifier onlyAdmins(){
      require(adminLists[msg.sender]== true, "Authentication: Require admins");
      _;
   }

   modifier onlyAmountApprover(){
      require(amountApprovers[msg.sender] == true || msg.sender == owner(), "Authentication: Require amount approver");
      _;
   }


   modifier whenNotPaused(){
      require(paused == false, "System: Paused");
      _;
   }

   /* ======================== AUTHENTICATION FUNCTIONS ================ */
   function setAdmin(address user_, bool status_) external onlyOwner{
      adminLists[user_] = status_;
      emit RoleEvent("set_admin", user_, true);
   }

   function setSigner(address user_) external onlyOwner{
      signer=user_;
      emit RoleEvent("set_signer", user_, true);
   }

   
   function setAcceptedToken(address tokenAddress_, bool status_) external onlyAdmins{
      acceptedTokens[tokenAddress_] = status_;
   }
   
   function setAcceptedDesToken(string memory token_, bool status_) external onlyAdmins{
      acceptedDesTokens[token_] = status_;
   }

   function setPauseStatus(bool status_) external onlyOwner {
      paused = status_;
      emit PauseEvent(msg.sender, status_);
   }

   ///@dev set amount approver 
   function setAmountApprover(address approver_, bool status_) external onlyOwner{
      amountApprovers[approver_] = status_;
      emit RoleEvent("set_amount_approver", approver_, true);
   }

   ///@dev set max swap amount
   function setMaxSwapAmount(address token_, uint256 maxAmount_) external onlyAdmins {
      maxSwapAmounts[token_] = maxAmount_;
      emit SetMaxSwapEvent(msg.sender, token_, maxAmount_);
   }

   function setApprovedTxByAmount(string[] memory internalTxs_, bool status_) external onlyAmountApprover{
      for (uint256 i =0; i< internalTxs_.length; i++){
         approvedTxs[internalTxs_[i]] = status_;
      }
      emit ApprovedTxsByAmountEvent(internalTxs_, status_);
   }

   function getSigner() external view returns(address){
      return signer;
   }
   /* ====================== MAIN FUNCTIONS ====================== */
   /**
    * @dev user will lock their cur accepted token in order to recevie des accepted token from the destination chain
    * @param transactionId_ unique internal trasaction id - from BE 
    */
   function lock(
      string memory transactionId_,
      address curToken_,  
      string memory desToken_,
      string memory desUser_,
      uint256 amount_ 
   ) external whenNotPaused {
      require(isTransactionExisted(transactionId_) != true, "Lock: Transaction existed");
      _validateSwapData(curToken_, desToken_, amount_);

      // Transfer 
      require(IERC20Upgradeable(curToken_).balanceOf(msg.sender) >= amount_, "Lock: Transfer amount exceeds balance");
      require(IERC20Upgradeable(curToken_).allowance(msg.sender, address(this)) >= amount_, "Lock: Transfer amount exceeds allowance");

      IERC20Upgradeable(curToken_).safeTransferFrom(
         msg.sender,
         address(this),
         amount_
      );

      // save data and emit event 
      SwapData memory swapData = SwapData(
         curToken_,
         desToken_,
         msg.sender,
         desUser_,
         address(0),
         amount_,
         LOCK
      );

      swapDatas[transactionId_] = swapData;
      emit SwapEvent(transactionId_, curToken_, desToken_, msg.sender, desUser_, amount_, LOCK);
   }

   /**
    * @dev prerequisite: user lock/burn their accepted cur token in the coressponding contract in the destiantion chain. -> to get signature and unlock des token in this chain
    */
   function unlock(
      string memory transactionId_,
      address curToken_,  
      string memory desToken_,
      address curUser_,
      string memory desUser_,
      uint256 amount_,
      bytes memory signature_
   ) external whenNotPaused nonReentrant{
      require(isTransactionExisted(transactionId_) != true, "Unlock: Transaction existed");

      _validateSwapData(curToken_, desToken_, amount_);
      require(_validateMaxSwapAmount(transactionId_, curToken_, amount_), "Unlock: Swap amount unapproved and exceed max swap amount ");
      require(signer == verify(transactionId_, curToken_, desToken_, curUser_, desUser_, amount_,signature_), "Unlock: Invalid signature");

      //valid date if it is correct user call the function
      require(curUser_ == msg.sender, "Unlock: not the correct user");
      require(IERC20Upgradeable(curToken_).balanceOf(address(this)) >= amount_, "Unlock: Transfer amount exceeds balance");

      IERC20Upgradeable(curToken_).safeTransfer(
         msg.sender,
         amount_
      );

      // save data and emit event 
      SwapData memory swapData = SwapData(
         curToken_,
         desToken_,
         curUser_,
         desUser_,
         signer,
         amount_,
         UNLOCK
      );

      swapDatas[transactionId_] = swapData;
      emit SwapEvent(transactionId_, curToken_, desToken_, msg.sender, desUser_, amount_, UNLOCK);
   }

   function isTransactionExisted(string memory transactionId_) public view returns(bool){
      return swapDatas[transactionId_].amount != 0;
   }

   function _validateSwapData(
      address curToken_,  
      string memory desToken_,
      uint256 amount_
   ) internal view{
      require(amount_ >= 0, "Lock: Amount not valid");

      require(acceptedTokens[curToken_] ==true, "Lock: Invalid cur network token");
      require(acceptedDesTokens[desToken_] == true, "Lock: Invalid des network token");
   }

   function _validateMaxSwapAmount(string memory transactionId_, address curToken_, uint256 amount_) internal view returns(bool) {
      // if max swap amount unlimited or swap amount < MAX swap amount 
      if (amount_ <= maxSwapAmounts[curToken_] || maxSwapAmounts[curToken_] == 0){
         return true;
      }
      return approvedTxs[transactionId_];
   }

   /* =================== EMERGENCY =========================== */
   function emergencyWithdraw(address token_, uint256 amount_) external onlyOwner{
      require(IERC20Upgradeable(token_).balanceOf(address(this))>= amount_, "EmergencyWithdraw: Transfer amount exceed balance");

      IERC20Upgradeable(token_).safeTransfer(
         msg.sender, 
         amount_
      );
   }
}