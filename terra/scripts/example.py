from asyncio import constants
from bot.Bot import Bot
from bot.Token import Token
from terra_sdk.client.lcd import LCDClient
from dotenv import load_dotenv
import os, sys, json, base64

from bot.Monstera import Monstera
load_dotenv() 

def create_swap_signature(swap_message, signer):
    str_swap_msg = json.dumps(swap_message).strip().replace(' ', '').encode()
    sig_buffer = signer.key.sign(str_swap_msg)
    decode_signature = base64.b64encode(sig_buffer).decode()
    return ''.join(decode_signature)

deployer_key = os.environ.get("MNEMONIC_KEY")

network = "testnet"
bot = Bot(network, deployer_key)
deployer = bot.get_deployer()
print(deployer.key.acc_address)

## Get contract data 
deployed_path = os.path.abspath("scripts/data/deployed.json")
f = open(deployed_path)
deployed_data = json.load(f)

contract_addr = None 
try:
    contract_addr = deployed_data["address"]
except:
    print("Please check the deployed file")
    sys.exit(1)

monstera = Monstera(network, deployer_key, contract_addr)
token_addr = "terra14luhcnjz4dau2lkar3rwtsykc33qq254tmsd44tkjlhwww0uhzeqs295dz"
token = Token(network, deployer_key, "a",[], "a", token_addr)


print(repr(monstera))
accepted_token = repr(token)
des_token = "0x8Ce5B4dD170C050A89243C860F393806B4c0bc26"
des_user = "0xbda814f95aB6Beb1305C55F4894ad1b9632Ac0da"


mint_swap_message = {
    "transaction_id": "kien_mint1",
    "cur_token": accepted_token,
    "des_token": des_token,
    "cur_user": deployer.key.acc_address,
    "des_user": des_user,
    "amount": "100000000"
}

print(mint_swap_message)
sig = create_swap_signature(mint_swap_message, deployer)
monstera.mint(deployer, mint_swap_message, sig)

"""Failed"""
#\monstera.mint(user2, swap_message, sig)
# swap_message["transaction_id"] = "test2"
# monstera.mint(user2, swap_message, sig)


burn_swap_message = {
    "transaction_id": "kien_burn1",
    "cur_token": accepted_token,
    "des_token": des_token,
    "cur_user": deployer.key.acc_address,
    "des_user": des_user,
    "amount": "100000000"
}

token.increase_allowance(deployer, repr(monstera), "100000000")
monstera.burn(deployer, burn_swap_message)