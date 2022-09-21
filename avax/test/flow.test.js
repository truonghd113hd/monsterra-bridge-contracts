const hardhat = require('hardhat');
const { expect } = require("chai");
const { BigNumber, Contract } = require("ethers");

const {
  provider,
  utils
} = hardhat.ethers;

const {
  time, balance
} = require('@openzeppelin/test-helpers');


let des_accepted_token = "0xbda814f95aB6Beb1305C55F4894ad1b9632Ac0da";
let des_user = "0xbda814f95aB6Beb1305C55F4894ad1b9632AcAda"

const MAX_SWAP_AMOUNT = ethers.utils.parseEther('40000');
const INITIAL_BALANCE = ethers.utils.parseEther('1000000');


describe("Ekokraft", ()=>{
    let monsterra, mag;
    beforeEach('function', async ()=>{
        [owner, user1, user2, admin, amountApprover, signer] = await hardhat.ethers.getSigners();

        //init ekokraft contract 
        let Monsterra = await hardhat.ethers.getContractFactory("Monsterra");
        monsterra = await upgrades.deployProxy(Monsterra, [
        ], {initializer: "initialize"}, {kind: "uups"});

        // init mag token 
        let MAG = await hardhat.ethers.getContractFactory("MAGToken");
        mag = await MAG.deploy(monsterra.address);
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


    it("Burn token", async()=>{
        await monsterra.setSigner(signer.address);

        await monsterra.setAcceptedToken(mag.address, true);
        await monsterra.setAcceptedDesToken(des_accepted_token, true);


        let tx_id = "mint0";
        let cur_token = mag.address;
        let des_token = des_accepted_token;
        let cur_user = user2.address;
        let des_user = user2.address;
        let amount = MAX_SWAP_AMOUNT.sub(2);

        let signature = await getSwapSinature(tx_id, cur_token, des_token, cur_user, des_user, amount);
        await monsterra.connect(user2).mint(tx_id, cur_token, des_token, cur_user, des_user, amount, signature);
        expect(await mag.balanceOf(user2.address)).to.be.equal(amount);


        //burn token 
        await mag.connect(user2).approve(monsterra.address, amount);

        let tx_id_2 = "burn0";
        await monsterra.connect(user2).burn(tx_id_2, cur_token, des_token, des_user, amount.div(2));
        expect(await mag.balanceOf(user2.address)).to.be.equal(amount.div(2));

    })

    it("Mint token", async()=>{
        await monsterra.setSigner(signer.address);

        await monsterra.setAcceptedToken(mag.address, true);
        await monsterra.setAcceptedDesToken(des_accepted_token, true);


        let tx_id = "mint0";
        let cur_token = mag.address;
        let des_token = des_accepted_token;
        let cur_user = user2.address;
        let des_user = user2.address;
        let amount = hardhat.ethers.utils.parseEther("100");

        let signature = await getSwapSinature(tx_id, cur_token, des_token, cur_user, des_user, amount);
        await monsterra.connect(user2).mint(tx_id, cur_token, des_token, cur_user, des_user, amount, signature);


        await expect(monsterra.connect(user2).mint(tx_id, cur_token, des_token, cur_user, des_user, amount, signature)).to.be.reverted;
        
        expect(await mag.balanceOf(user2.address)).to.be.equal(amount);
    })

    it("When paused, cannot trade", async()=> {
        await monsterra.setSigner(signer.address);

        await monsterra.setAcceptedToken(mag.address, true);
        await monsterra.setAcceptedDesToken(des_accepted_token, true);


        let tx_id = "mint0";
        let cur_token = mag.address;
        let des_token = des_accepted_token;
        let cur_user = user2.address;
        let des_user = user2.address;
        let amount = MAX_SWAP_AMOUNT.sub(2);

        let signature = await getSwapSinature(tx_id, cur_token, des_token, cur_user, des_user, amount);
        await monsterra.connect(user2).mint(tx_id, cur_token, des_token, cur_user, des_user, amount, signature);


        // OWNER pause the system 
        await monsterra.setPauseStatus(true);

        await mag.connect(user2).approve(monsterra.address, amount);
        let tx_id_2 = "burn0";
        await expect(monsterra.connect(user2).burn(tx_id_2, cur_token, des_token, des_user, amount.div(2))).to.be.reverted;

        let tx_id3 = "mint2";
        let signature2 = await getSwapSinature(tx_id3, cur_token, des_token, cur_user, des_user, amount);
        await expect(monsterra.connect(user2).mint(tx_id3, cur_token, des_token, cur_user, des_user, amount, signature2)).to.be.reverted;

        // OWNER unpause the system 
        await monsterra.setPauseStatus(false);
        await monsterra.connect(user2).burn(tx_id_2, cur_token, des_token, des_user, amount.div(2));
    })


    it("Mint token: Manipulate data", async()=>{
        await monsterra.setSigner(signer.address);

        await monsterra.setAcceptedToken(mag.address, true);
        await monsterra.setAcceptedDesToken(des_accepted_token, true);


        let tx_id = "mint0";
        let cur_token = mag.address;
        let des_token = des_accepted_token;
        let cur_user = user2.address;
        let des_user = user2.address;
        let amount = hardhat.ethers.utils.parseEther("100");

        let signature = await getSwapSinature(tx_id, cur_token, des_token, cur_user, des_user, amount);
        
        await expect(monsterra.connect(user2).mint("tx2", cur_token, des_token, cur_user, des_user, amount, signature)).to.be.reverted;
        await expect(monsterra.connect(user2).mint(tx_id, cur_token, des_token, cur_user, des_user, amount.mul(2), signature)).to.be.reverted;
       
    })

    it("MAX SWAP amount for claim", async()=>{
        await monsterra.setSigner(signer.address);

        await monsterra.setAcceptedToken(mag.address, true);
        await monsterra.setAcceptedDesToken(des_accepted_token, true);


        let amount =  MAX_SWAP_AMOUNT.add(1);

        let tx_id = "unlock0";
        let cur_token = mag.address;
        let des_token = des_accepted_token;
        let cur_user = user2.address;

        let signature = await getSwapSinature(tx_id, cur_token, des_token, cur_user, des_user, amount);
        await monsterra.connect(user2).mint(tx_id, cur_token, des_token, cur_user, des_user, amount, signature);

        //Owner set max swap amount 
        await monsterra.connect(owner).setMaxSwapAmount(mag.address, MAX_SWAP_AMOUNT);
        let tx_id2= "mint2";
        let signature2 = await getSwapSinature(tx_id2, cur_token, des_token, cur_user, des_user, amount);
        await expect(monsterra.connect(user2).mint(tx_id2, cur_token, des_token, cur_user, des_user, amount, signature2)).to.be.reverted;

        //amount approver allow the transaction to be executed
        await monsterra.connect(owner).setAmountApprover(amountApprover.address, true);
        await monsterra.connect(amountApprover).setApprovedTxByAmount([tx_id2], true);
        await monsterra.connect(user2).mint(tx_id2, cur_token, des_token, cur_user, des_user, amount, signature2);

    })

    async function getSwapSinature(internalTx_, cur_token, des_token, cur_user, des_user, amount) {
        const hash = await monsterra.getMessageHash(internalTx_, cur_token, des_token,cur_user, des_user, amount) ;
        const signature = await web3.eth.sign(hash, signer.address);
        return signature;
      }
})