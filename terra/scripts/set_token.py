from asyncio import constants
from bot.Bot import Bot
from terra_sdk.client.lcd import LCDClient
from dotenv import load_dotenv
import os, sys, json, base64, time

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

for network in token_data:
    if network == "terra":
        for key in token_data[network]:
           
            try:
                monstera.set_accepted_token(deployer, token_data[network][key], True)    
                print(f"Setting for {key} of {network} SUCEEDED")
            except:
                print(f"Setting for {key} of {network} FAILED")
                continue
            
            time.sleep(2)
    else:
        
        for key in token_data[network]:
            try:
                monstera.set_accepted_des_token(deployer, token_data[network][key], True)    
                print(f"Setting destination token for {key} of {network} SUCEEDED")
            except:
                print(f"Setting destination token for {key} of {network} FAILED")
                continue
            
            time.sleep(2)
