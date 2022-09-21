from asyncio import constants
from bot.Bot import Bot
from bot.Token import Token
from terra_sdk.client.lcd import LCDClient
from dotenv import load_dotenv
import os, sys, json, base64

from bot.Monstera import Monstera
load_dotenv() 




try:
    deployer_key = os.environ.get("MNEMONIC_KEY")
    contract_addr = os.environ.get("CONTRACT_ADDR")
except:
    print("Invalid enviroment variable")
    sys.exit()
deployer_key = os.environ.get("MNEMONIC_KEY")

network = "testnet"

bot = Bot(network, deployer_key)
deployer = bot.get_deployer()
print(repr(deployer.key.acc_address))


monstera = Monstera(network, deployer_key, None)
mag = Token(network, deployer_key, "MAG", [(deployer.key.acc_address, "1000000000")], repr(monstera))
mstr = Token(network, deployer_key, "MSTR", [], repr(monstera))


deployed_path = os.path.abspath("scripts/data/deployed.json")

deployed_data = {
    "address": repr(monstera),
    "mag": repr(mag),
    "mstr": repr(mstr)
}

with open(deployed_path, "w") as outfile:
    json.dump(deployed_data, outfile)