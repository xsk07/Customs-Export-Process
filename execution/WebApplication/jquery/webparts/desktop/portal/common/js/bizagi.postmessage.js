/*
*   Name: BizAgi PostMessage Wrapper
*   Author: Juan Pablo Manrique
*   Comments:
*   -   This script will define a base class to handle postmessage comunication
*/

// Create or Define BizAgi namespace
bizagi = (typeof (bizagi) !== "undefined") ? bizagi : {};

bizagi.postmessage = function (params) {

    var that = this;
    this.subscribers = {};
    this.remoteServer = params.remoteServer;
    this.destination = params.destination;
    this.origin = params.origin;

    this.send = function (msg) {
        var self = this;
        if (self.destination) {
            try {
                self.destination.postMessage(msg, self.remoteServer);
            } catch (e) {
                console.log("PostMessage error:", e.toString());
            }
        }
    };

    this.trigger = function (eventType, message) {
        var self = this;
        var data = {
            event: eventType,
            message: message
        };
        self.send(data);
    };

    this.receive = function (msg) {
        var self = this;
        if (msg.data.event) {
            var subscriber = self.subscribers[msg.data.event];
            if (subscriber) {
                for (var i = 0; i < subscriber.length; i++) {
                    subscriber[i](msg.data);
            }
        }
}
    };

    this.startReceiving = function () {
        var self = this;
        if (window.addEventListener) {
            self.origin.addEventListener("message", self.receive.bind(self), true);
        }
        else {
            self.origin.attachEvent("onmessage", self.receive.bind(self));
}
    };

    this.subscribe = function (remoteEvent, callback) {
        var subscriber = this.subscribers[remoteEvent];
        if (!subscriber) this.subscribers[remoteEvent]=[];
        this.subscribers[remoteEvent].push(callback);
}

    this.startReceiving();
}