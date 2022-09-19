#!/bin/bash
set -x
image_name=network-registry-dashboard
container_name=network-registry
container_status=`docker ps -a --filter name=${container_name} --format="{{.State}}"`

if [ "${container_status}" == "exited" ] || [ "${container_status}" == "" ]; then
   docker rm -f ${container_name} 2> /dev/null
   docker run -d --name ${container_name} ${image_name}
else 
   echo "Previous container still ${container_status}"; 
fi
