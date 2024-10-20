#!/bin/zsh

# Does a backup copy of the database. Takes the MongoDB URI as argument.
#
# Troubleshooting: if you get a DNS error message, it might be because of a
# problem in the DNS configuration of your ISP provider. In this case, you can
# use the Cloudflare DNS server instead. To do this, add the 1.1.1.1 nameserver
# to your local DNS configuration.
mongodump --uri $1