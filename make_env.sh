#! /bin/sh

if [ -d ".env" ];
then
    echo "Installing using pip"
else
    echo "creating .env and install using pip"
    pip install virtualenv
    virtualenv .env
fi

. .env/Scripts/activate
pip install --upgrade pip
pip install -r requirements.txt
# Work done. so deactivate the virtual env
deactivate
