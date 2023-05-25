#! /bin/sh
echo "Starting Server..............................." 
if [ -d ".env" ];
then
    echo "Enabling virtual env"
else
    echo "No Virtual env. Please run Run.sh"
    exit N
fi

. .env/Scripts/activate
export ENV=development
python app.py
deactivate
