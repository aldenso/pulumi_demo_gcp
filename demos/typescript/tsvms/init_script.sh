#!/usr/bin/bash
SCRIPTLOG="/var/log/init_script.log"

yum update -y >> "$SCRIPTLOG" 2>&1
yum install -y docker >> "$SCRIPTLOG" 2>&1