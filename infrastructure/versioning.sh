#!/usr/bin/env bash

# Bash 'strict' mode
set -euo pipefail
IFS=$'\n\t'

readonly PACKAGE_ROOT_PATH=$(git rev-parse --show-toplevel)/
PACKAGE_NAME=$(node -p -e "require('${PACKAGE_ROOT_PATH}package.json').name")
PUBLISHED_VERSION=$(npm show ${PACKAGE_NAME} version)
CURRENT_VERSION=$(node -p -e "require('${PACKAGE_ROOT_PATH}package.json').version")

echo PACKAGE_NAME $PACKAGE_NAME
echo PUBLISHED_VERSION $PUBLISHED_VERSION
echo CURRENT_VERSION $CURRENT_VERSION

NEW_VERSION=$CURRENT_VERSION
if [[ "${PUBLISHED_VERSION}" = "${CURRENT_VERSION}" ]]; then
  NEW_VERSION=$(npm --no-git-tag-version version patch)
  git add ${PACKAGE_ROOT_PATH}package.json
  git commit -m "CicleCi version upgrade to $NEW_VERSION due to a merge to master [ci skip]"
fi

echo NEW_VERSION $NEW_VERSION

git tag $NEW_VERSION
git push origin master
git push origin master --tags