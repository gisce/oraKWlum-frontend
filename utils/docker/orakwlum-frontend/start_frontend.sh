#!/bin/bash
# Set Server Name
if [ "$#" -ne 1 ]; then
    server_name="okW-frontend"
else
    server_name="$1"
fi
name="frontend"
container="okw/"$name
ports="-p 80:80 -p 443:443"
socket_path="/tmp/docker_sockets"
if [ -d $socket_path ]; then
    mkdir -p $socket_path
fi
# Ensure permissions on socket
chmod -R 777 $socket_path
sockets="-v $socket_path:/tmp/"
log_path="/var/log/orakwlum/frontend"
if [ -d $log_path ]; then
    mkdir -p $log_path
fi
logs="-v $log_path:/var/log/orakwlum"
container_id=`docker run $ports --name $name -d $sockets $logs -i $container /run_frontend.sh $server_name`
if [ "$container_id" != "" ]
then
    echo "$container_id" > id_frontend
    echo "Container $container started! id: $container_id"
else
    if [ -e "id_frontend" ]; then
        rm id_frontend
    fi
    echo "Error spawning docker!"
fi
