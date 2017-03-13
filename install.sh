#!/bin/bash

# This script installs the plugin among Miaou ones. It assumes
# all involved git repositories are inside the same directory.
# If you have trouble using this, please contact me on Miaou
# (@dystroy on https://dystroy.org/miaou)

ROOT_PATH=`dirname $0`
PLUGIN_PATH="$ROOT_PATH/plugin"
DEPLOY_PATH="../miaou/plugins/ufo"

# installing the plugin in the plugins directory of the miaou installation
rm -rf $DEPLOY_PATH
cp -r $PLUGIN_PATH $DEPLOY_PATH
