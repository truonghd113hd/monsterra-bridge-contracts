# Deploying Monstera bridge 
Here are the steps to guide you through how to deploy and set up for Monstera bridge contract to work correctly 

## For Monstera-bsc contract 
- Deploy the contract (scripts/deploy)
- Setting up the contract
    - There are some field, function that you need to set after the data is provided 
        1. setAdmin()  -> to get admin role 
        2. setSigner()  -> set the signer (address of signer) who performs signing action to allow transaction in the destination network 
        2. setAcceptedToken() -> to allow token in bsc chain to able to swap (in our scope: MAG and MSTR token of the BSC network)
        3. setAcceptedDesToken() -> to allow token in the destination chain to be able to swap (in our scope: MAG and MSTR token of the Terra network)


## For Monstera-terra contract 
---> Note: For monstera-terra contract to work, the contract need to have the minting right of the corresponding accepted token (in our scope: MAG and MSTR of the Terra network)

- Deploy the contract (get the wasm file or using the script we provide)
- Setting up the contract 
    - There are some field, function that you need to set after the data is provided 
        1. setAdmin()  -> to get admin role 
        2. setSigner()  -> set the signer (public key of signer) who performs signing action to allow transaction in the destination network 
        2. setAcceptedToken() -> to allow token in bsc chain to able to swap (in our scope: MAG and MSTR token of the Terra network)
        3. setAcceptedDesToken() -> to allow token in the destination chain to be able to swap (in our scope: MAG and MSTR token of the BSC network)

## Specs
- BSC: Lock unlock
- Avax: Mint burn 

## Prerequisite
- Avax Ekokraft contract can mint new MAG/MSTR token

## Contract 
### Avax
Ekokraft: 0xcbAC5b8381cBF82278B569a0cBe875EC88373af9
MAG: 0x8f46C63e862B5e172449c6E8287Da3A033837cF1
MSTR: 0xc8b66c7CD76384E48e140bF5756f79A011998b58


### BSC
Ekokraft: 0xD9580a674485b94db3D4CeDcE0C7058203835fe7
MAG: 0xC49CCc0e1AbF5811EC8090d05Ef6355F62EeD4BA
MSTR: 0x0f1E5a37632aB7DE805ac52f13Eb963ec6C1B187

### Initital Setting
owner: 0xbda814f95aB6Beb1305C55F4894ad1b9632Ac0da
signer: 0xbda814f95aB6Beb1305C55F4894ad1b9632Ac0da
admin: 0xbda814f95aB6Beb1305C55F4894ad1b9632Ac0da 

###   Role
owner => set admins 
admin => set signer, set_accepted_token, set_des_accepted_token
