@echo off

echo ==================================================
echo Inicializando Nodemon a la carpeta de distribucion
echo ==================================================

pushd ..
nodemon dist/
pause