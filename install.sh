#!/usr/bin/env bash

echo "Installing ionic..."
npm i -g ionic &&
echo "Ionic installed successfully."
echo "Installing cordova..."
npm i -g cordova && 
echo "Cordova successfully installed"
echo "Installing javascript-obfuscator"
npm i -g javascript-obfuscator &&
echo "Javascript-obfuscator successfully installed"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd $DIR &&
npm i 
