from bot.Bot import Bot
from terra_sdk.client.lcd import LCDClient
from dotenv import load_dotenv
import os, sys, json, base64
load_dotenv() 

try:
    deployer_key = os.environ.get("MNEMONIC_KEY")
    contract_addr = os.environ.get("CONTRACT_ADDR")
except:
    print("Invalid enviroment variable")
    sys.exit()

bot = Bot("testnet", deployer_key)
deployer = bot.get_deployer()

token_code_id = 67275
bot.instantiate_contract(
    token_code_id,
    {
        "name": "MAG",
        "symbol": "MAG",
        "decimals": 6,
        "initial_balances": [],
        "mint": {
            "minter": "terra15e5ccsqqvnxcc898mdqwwnsl797d63a4jlevj6"
        }
    }
)


bot.instantiate_contract(
    token_code_id,
    {
        "name": "MSTR",
        "symbol": "MSTR",
        "decimals": 6,
        "initial_balances": [],
        "mint": {
            "minter": "terra15e5ccsqqvnxcc898mdqwwnsl797d63a4jlevj6"
        }
    }
)