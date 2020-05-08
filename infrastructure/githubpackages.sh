#!/bin/bash
set -x
echo -e "registry=https://npm.pkg.github.com/" >> .npmrc
echo -e "_auth=$GITHUB_PUBLISH_TOKEN\nemail=$GITHUB_PUBLISH_EMAIL\nalways-auth=true" >> .npmrc
