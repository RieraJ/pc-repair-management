#!/bin/bash
# Script ejecutado por dpkg como root después de instalar el .deb.
# Establece los permisos SUID necesarios para que chrome-sandbox funcione.
chown root "/opt/Gestión de Reparaciones/chrome-sandbox"
chmod 4755 "/opt/Gestión de Reparaciones/chrome-sandbox"
