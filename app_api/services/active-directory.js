const ActiveDirectory = require('activedirectory');

const config = { 
                url: 'ldaps://utg.loc',       //LDAP URL (e.g. ldap(S)://my.domain.com)
                baseDN: 'dc=utg,dc=loc',       //baseDN { String } - Base LDAP DN to search for users in
                username: 'i-lookup-ad@utg.loc', //User name of account with access to search the directory
                password: 'Esr0123--',
                tlsOptions: { rejectUnauthorized: false } 
              }

const ad = new ActiveDirectory(config);

exports.authenticateAsync = (name, pass) => {
  return new Promise( (resolve, reject) => {
    ad.authenticate(name, pass, function(err, auth) {
      if (err) {
        reject(err);
      }
        resolve(auth);
    });
  });
}


