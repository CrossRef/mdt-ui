#!/usr/bin/env bash

# Update apt repositories
apt-get update

# Install Apache to serve static files
apt-get install -y apache2

# Update the Apache configuration to serve our webapp
cat > /etc/apache2/sites-available/crossref-local.conf <<EOF
<VirtualHost *:80>
  ServerAdmin webmaster@localhost
  DocumentRoot /vagrant

  AllowEncodedSlashes NoDecode

  <Directory /vagrant/metadatamanager>
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted

    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} !index
    RewriteRule (.*) /index.html [L,QSA]
  </Directory>

  ErrorLog ${APACHE_LOG_DIR}/error.log
  CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
EOF

a2ensite crossref-local
a2dissite 000-default
a2enmod rewrite

service apache2 restart