echo $'\n ---------------------\n Deploying the the ekokraft contract ... \n --------------------\n'
npx hardhat run scripts/deploy.js --network bsc
if [ $? -eq 1 ]; then
    echo "ERROR: Found error. Stop !!!!"
    exit 0
else
    echo $'====> Successfully'
fi

echo $'\n ---------------------\n Seting grants of the public round... \n --------------------\n'
npx hardhat run scripts/setGrants/public.js --network bsc
if [ $? -eq 1 ]; then
    echo "ERROR: Found error. Stop !!!!"
    exit 0
else
    echo $'====> Successfully'
fi



echo $'\n ---------------------\n Deploying the public round... \n --------------------\n'
npx hardhat run scripts/deploy/private.js --network bsc
if [ $? -eq 1 ]; then
    echo "ERROR: Found error. Stop !!!!"
    exit 0
else
    echo $'====> Successfully'
fi

echo $'\n ---------------------\n Seting grants of the public round... \n --------------------\n'
npx hardhat run scripts/setGrants/private.js --network bsc
if [ $? -eq 1 ]; then
    echo "ERROR: Found error. Stop !!!!"
    exit 0
else
    echo $'====> Successfully'
fi




echo $'\n ---------------------\n Deploying the strategic round... \n --------------------\n'
npx hardhat run scripts/deploy/strategic.js --network bsc
if [ $? -eq 1 ]; then
    echo "ERROR: Found error. Stop !!!!"
    exit 0
else
    echo $'====> Successfully'
fi

echo $'\n ---------------------\n Seting grants of the strategic round... \n --------------------\n'
npx hardhat run scripts/setGrants/strategic.js --network bsc
if [ $? -eq 1 ]; then
    echo "ERROR: Found error. Stop !!!!"
    exit 0
else
    echo $'====> Successfully'
fi





echo $'\n ---------------------\n Deploying the Angel round... \n --------------------\n'
npx hardhat run scripts/deploy/angel.js --network bsc
if [ $? -eq 1 ]; then
    echo "ERROR: Found error. Stop !!!!"
    exit 0
else
    echo $'====> Successfully'
fi

echo $'\n ---------------------\n Seting grants of the Angel round... \n --------------------\n'
npx hardhat run scripts/setGrants/angel.js --network bsc
if [ $? -eq 1 ]; then
    echo "ERROR: Found error. Stop !!!!"
    exit 0
else
    echo $'====> Successfully'
fi


