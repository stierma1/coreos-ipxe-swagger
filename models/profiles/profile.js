'use strict';

function Profile(options) {
    if (!options) {
        options = {};
    }

    this.cloud_config = options.cloud_config;
    this.cloud_config_version = options.cloud_config_version;
    this.version = options.version;
    this.sshkey = options.sshkey;
    this.rootfstype = options.rootfstype;
    this.coreos_autologin = options.coreos_autologin;
    this.console = options.console;
}

module.exports = Profile;
