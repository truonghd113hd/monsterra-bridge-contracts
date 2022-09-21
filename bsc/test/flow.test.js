const hardhat = require('hardhat');
const { expect } = require("chai");
const { BigNumber } = require("ethers");

const {
    provider,
    utils
  } = hardhat.ethers;
  

const INITIAL_BALANCE = ethers.utils.parseEther('1000000');

let des_user = "avax_user";
let des_accepted_token = "avax_token";

const MAX_SWAP_AMOUNT = ethers.utils.parseEther('40000');

describe("Monsterra", ()=>{
    let monsterra, mag;
    beforeEach('function', async ()=>{
        [owner, user1, user2, admin, amountApprover, signer] = await hardhat.ethers.getSigners();
        const Monsterra = await hardhat.ethers.getContractFactory("Monsterra");
        monsterra = await upgrades.deployProxy(Monsterra,[], {initializer: "initialize"}, {kind: "uups"});

        monsterra.setSigner(signer.address);
        const MAG = await hardhat.ethers.getContractFactory("MAGToken");
        mag = await MAG.deploy();


        const MSTR = await hardhat.ethers.getContractFactory("MSTRToken");
        mstr = await MSTR.deploy();

        await mag.mint(user2.address, INITIAL_BALANCE);
    })
    
    it("Owner ==> Set admin", async()=> {
        await monsterra.connect(owner).setAdmin(user1.address, true);
        await expect(monsterra.connect(user1).setAdmin(user2.address, true)).to.be.reverted;
    })

    it("Owner ==> Set signer", async()=> {
        await monsterra.connect(owner).setAdmin(user1.address, true);

        await expect(monsterra.connect(user1).setSigner(signer.address)).to.be.reverted;
        
        await monsterra.connect(owner).setSigner(signer.address);
    })

    it("Owner ==> Set amount approver", async() =>{
        await monsterra.connect(owner).setAdmin(admin.address, true);
        await expect(monsterra.connect(admin).setAmountApprover(amountApprover.address, true)).to.be.reverted;

        await monsterra.connect(owner).setAmountApprover(amountApprover.address, true);
    })

    it("Onwer ==> Pause", async()=> {
        await monsterra.connect(owner).setPauseStatus(true);
    })


    it("Admins ==> Set MAX amount", async()=> {
        await monsterra.connect(owner).setMaxSwapAmount(mag.address, MAX_SWAP_AMOUNT);
    })


    it("lock check", async()=> {
        //not set accepted token yet
        await expect(monsterra.connect(user2).lock(
            "1",
            mag.address,
            des_accepted_token,
            des_user,
            ethers.utils.parseEther("100")
        )).to.be.reverted

        expect(await monsterra.connect(owner).setAcceptedToken(mag.address, true)).to.be.ok;
        
        await expect(monsterra.connect(user2).lock(
            "1",
            mag.address,
            des_accepted_token,
            des_user,
            ethers.utils.parseEther("100")
        )).to.be.reverted

        expect(await monsterra.connect(owner).setAcceptedDesToken("avax_token", true)).to.be.ok;
        
            
        //approve 
        expect(await mag.connect(user2).approve(monsterra.address, INITIAL_BALANCE)).to.be.ok;

        expect(await monsterra.connect(user2).lock(
            "1",
            mag.address,
            des_accepted_token,
            des_user,
            ethers.utils.parseEther("100")
        )).to.be.ok;

        expect(await mag.balanceOf(monsterra.address)).to.be.equal(ethers.utils.parseEther("100"))
    })

    it("unlock token", async()=>{
        await monsterra.setSigner(signer.address);

        await monsterra.setAcceptedToken(mag.address, true);
        await monsterra.setAcceptedDesToken(des_accepted_token, true);
        

        //lock token to contract
        expect(await mag.connect(user2).approve(monsterra.address, INITIAL_BALANCE)).to.be.ok;

        expect(await monsterra.connect(user2).lock(
            "1",
            mag.address,
            des_accepted_token,
            des_user,
            ethers.utils.parseEther("100")
        )).to.be.ok;
        expect(await mag.balanceOf(monsterra.address)).to.be.equal(hardhat.ethers.utils.parseEther("100"));

        //unlock
        let tx_id = "unlock0";
        let cur_token = mag.address;
        let des_token = des_accepted_token;
        let cur_user = user2.address;
        let amount = hardhat.ethers.utils.parseEther("100");

        let signature = await getSwapSinature(tx_id, cur_token, des_token, cur_user, des_user, amount);
        await monsterra.connect(user2).unlock(tx_id, cur_token, des_token, cur_user, des_user, amount, signature);

        await expect(monsterra.connect(user2).unlock(tx_id, cur_token, des_token, cur_user, des_user, amount, signature)).to.be.reverted;

        let tx_id2 = "unlock1";
        let signature2 = await getSwapSinature(tx_id2, cur_token, des_token, cur_user, des_user, amount);
        await expect(monsterra.connect(user2).unlock("txid3", cur_token, des_token, cur_user, des_user, amount, signature2)).to.be.reverted;
        await expect(monsterra.connect(user2).unlock("txid2", des_accepted_token, des_token, cur_user, des_user, amount, signature2)).to.be.reverted;
    })

    it("When paused, cannot trade", async()=>{
        await monsterra.connect(owner).setPauseStatus(true);
        await monsterra.connect(owner).setAdmin(admin.address, true);

        await monsterra.connect(admin).setAcceptedToken(mag.address, true);
        await monsterra.connect(admin).setAcceptedDesToken(des_accepted_token, true);

        await expect(monsterra.connect(user2).lock(
            "1",
            mag.address,
            des_accepted_token,
            des_user,
            ethers.utils.parseEther("100")
        )).to.be.reverted;

        //unlock
        let tx_id = "unlock0";
        let cur_token = mag.address;
        let des_token = des_accepted_token;
        let cur_user = user2.address;
        let amount = hardhat.ethers.utils.parseEther("100");
        
        await mag.mint(monsterra.address, INITIAL_BALANCE); // mint fund for contract

        let signature = await getSwapSinature(tx_id, cur_token, des_token, cur_user, des_user, amount);
        await expect(monsterra.connect(user2).unlock(tx_id, cur_token, des_token, cur_user, des_user, amount, signature)).to.be.reverted;
    })

    it("MAX SWAP amount for claim", async()=>{
        await monsterra.connect(owner).setAdmin(admin.address, true);
        await monsterra.connect(admin).setAcceptedToken(mag.address, true);
        await monsterra.connect(admin).setAcceptedDesToken(des_accepted_token, true);

        //unlock
        let tx_id = "unlock0";
        let cur_token = mag.address;
        let des_token = des_accepted_token;
        let cur_user = user2.address;

        await mag.mint(monsterra.address, INITIAL_BALANCE); // mint fund for contract

        let amount = hardhat.ethers.utils.parseEther("100");
        let signature = await getSwapSinature(tx_id, cur_token, des_token, cur_user, des_user, amount);
        await monsterra.connect(user2).unlock(tx_id, cur_token, des_token, cur_user, des_user, amount, signature);
        

         //Owner set max swap amount 
        await monsterra.connect(owner).setMaxSwapAmount(mag.address, MAX_SWAP_AMOUNT);
        let amount2 =  MAX_SWAP_AMOUNT.add(1);
        let tx_id2 = "unlock2";
        let signature2 = await getSwapSinature(tx_id2, cur_token, des_token, cur_user, des_user, amount2);
        
        await expect(monsterra.connect(user2).unlock(tx_id2, cur_token, des_token, cur_user, des_user, amount2, signature2)).to.be.reverted;

        //amonut approver allow the transaction to be executed 
        await monsterra.connect(owner).setAmountApprover(amountApprover.address, true);
        await monsterra.connect(amountApprover).setApprovedTxByAmount(["unlock2"], true);

        await monsterra.connect(user2).unlock(tx_id2, cur_token, des_token, cur_user, des_user, amount2, signature2);
    })


    it("Unlock token: Manipulate data", async()=>{
        await mag.mint(monsterra.address, INITIAL_BALANCE)


        await monsterra.setSigner(signer.address);

        await monsterra.setAcceptedToken(mag.address, true);
        await monsterra.setAcceptedToken(mstr.address, true);
        await monsterra.setAcceptedDesToken(des_accepted_token, true);
        
        let tx_id = "unlock0";
        let cur_token = mag.address;
        let des_token = des_accepted_token;
        let cur_user = user2.address;
        let amount = hardhat.ethers.utils.parseEther("100");
        let signature = await getSwapSinature(tx_id, cur_token, des_token, cur_user, des_user, amount);
        await expect(monsterra.connect(user2).unlock("unlock1", cur_token, des_token, cur_user, des_user, amount, signature)).to.be.reverted;
        await expect(monsterra.connect(user2).unlock(tx_id, mstr.address, des_token, cur_user, des_user, amount, signature)).to.be.reverted;
        await expect(monsterra.connect(user2).unlock(tx_id, cur_token, des_token, cur_user, des_user, amount.mul(2), signature)).to.be.reverted;
        
    })



    async function getSwapSinature(internalTx_, cur_token, des_token, cur_user, des_user, amount) {
        const hash = await monsterra.getMessageHash(internalTx_, cur_token, des_token,cur_user, des_user, amount) ;
        const signature = await web3.eth.sign(hash, signer.address);
        return signature;
    }


})