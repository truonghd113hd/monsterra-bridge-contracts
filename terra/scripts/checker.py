from asyncio import constants
from bot.Bot import Bot
from terra_sdk.client.lcd import LCDClient
from dotenv import load_dotenv
import os, sys, json, base64

from bot.Monstera import Monstera
load_dotenv() 
deployer_key = os.environ.get("MNEMONIC_KEY")

network = "testnet"
bot = Bot("testnet", deployer_key)
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

token_path = os.path.abspath("scripts/data/token.json")
f = open(token_path)
token_data = json.load(f)

signer = monstera.get_signer()
print(f"Signer is: {signer}")
for network in token_data:
    if network == "terra":
        for key in token_data[network]:
           
            status = monstera.is_accepted_token(token_data[network][key])
            print(f"Accepted token of {token_data[network][key]}: {status}")
    else:
        
        for key in token_data[network]:
            status = monstera.is_accepted_des_token(token_data[network][key])
            print(f"Accepted des token of {token_data[network][key]}: {status}")