#!/bin/bash
set -x
echo -e "@$GITHUB_PUBLISH_SCOPE:registry=https://npm.pkg.github.com/" >> .npmrc
echo -e "_auth=$GITHUB_PUBLISH_TOKEN\nemail=$GITHUB_PUBLISH_EMAIL\nalways-auth=true" >> .npmrc
npm set @$GITHUB_PUBLISH_SCOPE:registry https://npm.pkg.github.com
