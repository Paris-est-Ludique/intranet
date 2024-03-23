#!/bin/bash

# Script from :
# https://emilwypych.com/2020/10/25/how-to-run-discord-bot-on-cloud-run/?cn-reloaded=1

GCP_CONFIGURATION_NAME=barajeuxonline
GCP_PROJECT_NAME=barajeuxonline
GCP_REGION=europe-west1
PROJECT_NAME=barajeuxonline-bot

if [ -z "$1" ]
then
    ENVSUFFIX="test"
else
    ENVSUFFIX=$1
fi

# Ensure proper GCP configuration is set
echo "[GCloud] get configuration"
gcloud config configurations activate ${GCP_CONFIGURATION_NAME}

# rm data/auth.json
# cp data/auth-"${ENVSUFFIX}".json data/auth.json
echo "[Docker] Build a new docker image"

docker build --no-cache -t gcr.io/${GCP_PROJECT_NAME}/"${PROJECT_NAME}-${ENVSUFFIX}" .

echo "[Docker] Push the new docker image"
docker push gcr.io/${GCP_PROJECT_NAME}/"${PROJECT_NAME}-${ENVSUFFIX}"

echo "[GCloud] Deploy new revision of ${PROJECT_NAME}-${ENVSUFFIX}"

gcloud run deploy "${PROJECT_NAME}-${ENVSUFFIX}" --image=gcr.io/${GCP_PROJECT_NAME}/"${PROJECT_NAME}-${ENVSUFFIX}" \
  --platform=managed --region=${GCP_REGION} --allow-unauthenticated \
  --max-instances 1 --memory=2Gi --cpu=2

echo "[GCloud] Ensure that there is cron job for checking ${PROJECT_NAME}-${ENVSUFFIX}"

# Get proper URL
GCP_APP_URL=$(gcloud run services list --platform=managed --region=${GCP_REGION} \
  --filter="status.address.url ~ ${PROJECT_NAME}-${ENVSUFFIX}" \
  --format="value(status.address.url)")

gcloud scheduler jobs create http GET-"${PROJECT_NAME}-${ENVSUFFIX}" \
  --schedule="* * * * *" --uri="${GCP_APP_URL}" --http-method GET
