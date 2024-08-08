/*
*   Name: BizAgi postmessage Wrapper
*   Author: Juan Pablo Manrique
*   Comments:
*   -   This script will define a base class to handle postmessage comunication
*/

$.Class.extend("bizagi.postmessage", {}, {
    /**
    *   Constructor
    */
    init: function (params) {
        // Set workportal facade
        this.remoteServer = params.remoteServer;
        this.origin = params.origin;
        // start receiving sequence
        this.receiveMessage();
    },
    /**
    *   send, override this method in each bizagi.postmessage instance
    *       origin: describe the origin msg object
    *       msg:    msg to send
    */
    send: function (msg, origin) {
        var self = this;
        self.origin.postMessage(msg, self.remoteServer)
    },

    /**
    *   receive, override this method in each bizagi.postmessage instance
    */
    receive: function (msg) { },

    /**
    *   receive mesagge this method is private
    */
    receiveMessage: function () {
        var self = this;
        if (window.addEventListener) {
            self.origin.addEventListener("message", receive, true);
        }
        else {
            self.origin.attachEvent("onmessage", receive);
        }
    }
});