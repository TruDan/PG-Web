/**
 * Created by truda on 13/05/2017.
 */

module.exports = angular.module("app.cast",[])
    .provider("$castConfig", CastConfigProvider)
    .provider("$castSender", CastSenderServiceProvider)
    .provider("$castReceiver", CastReceiverServiceProvider)
    .config(require('./config')).name;

function CastConfigProvider() {

    var config = {
        applicationId: '',
        namespaces: []
    };

    this.registerNamespace = function(namespace) {
        config.namespaces.push(namespace);
    };

    this.setApplicationId = function(applicationId) {
        config.applicationId = applicationId;
    };

    this.$get = [function() {
        return new CastConfigService(config);
    }];
}

function CastConfigService(config) {
    this.config = config;

    this.getApplicationId = function() {
        return config.applicationId;
    };

    this.getNamespaces = function() {
        return config.namespaces.slice(0);
    };
}

function CastSenderServiceProvider() {
    this.$get = ["$castConfig", function($castConfig) {
        return new CastSenderService($castConfig);
    }];
}

function CastSenderService($castConfig) {
    var $castSender = this;
    var config = {
        applicationId: $castConfig.getApplicationId(),
        namespaces: $castConfig.getNamespaces()
    };

    var isInitialised = false;
    var initFuncs = [];

    var context;

    var eventListeners = [];
    var sessionState = "";
    var session;

    var messageListeners = {};
    var receiver;


    /**
     * initialization error callback
     */
    var onError = function(message) {
        console.log('onError: ',message);
    };

    /**
     * generic success callback
     */
    var onSuccess = function(message) {
        console.log('onSuccess: ',message);
    };

    this.onInit = function(callback) {
        if(isInitialised) {
            callback();
            return;
        }
        initFuncs.push(callback);
    };

    this.init = function() {
        context = cast.framework.CastContext.getInstance();
        context.setOptions({
            receiverApplicationId: config.applicationId,
            autoJoinPolicy: chrome.cast.ORIGIN_SCOPED,
            resumeSavedSession: true
        });

        session = context.getCurrentSession();
        sessionState = context.getSessionState();
        context.addEventListener(cast.framework.CastContextEventType.SESSION_STATE_CHANGED, CastSessionStateListener);

        console.debug("Cast Sender Initialised");
        isInitialised = true;
        if(initFuncs.length > 0) {
            for(var i=0; i < initFuncs.length; i++) {
                initFuncs[i]();
            }
        }
    };

    this.requestSession = function() {
        return context.requestSession();
    };

    this.registerListener = function(listenerCallback, forceInit) {
        eventListeners.push(listenerCallback);
        if(session !== null || (typeof(forceInit) !== 'undefined' && forceInit))
            listenerCallback($castSender, session, sessionState);
    };

    this.unregisterListener = function(listenerCallback) {
        if(eventListeners.length > 0) {
            for (var i = 0; i < eventListeners.length; i++) {
                var listener = eventListeners[i];
                if (listener && listener === listenerCallback) {
                    eventListeners.splice(i, 1);
                }
            }
        }
    };

    this.sendMessage = function(namespace, message) {
        var s = context.getCurrentSession();
        if (s !== null) {
            console.log("Cast: SEND - ", namespace, message);
            return s.sendMessage(namespace, message).then(onSuccess, onError);
        }
    };

    this.getConfig = function() {
        return $.extend(true, {}, config);
    };

    this.getReceiverName = function() {
        return receiver.friendlyName;
    };

    this.getSessionState = function() {
        return sessionState;
    };

    function CastSessionStateListener(e) {
        if(e.errorCode !== null) {
            console.warn("Cast Error", e.errorCode, e.sessionState, e.session);
        }

        if(e.sessionState !== sessionState) {
            console.debug("Cast State Change", sessionState, e.sessionState, e.session, e.errorCode);

            session = e.session;
            if(session !== null)
                receiver = session.getCastDevice();
            else
                receiver = null;

            switch (e.sessionState) {
                case cast.framework.SessionState.NO_SESSION:

                    break;
                case cast.framework.SessionState.SESSION_STARTING:

                    break;
                case cast.framework.SessionState.SESSION_STARTED:

                    console.log("Session", session);
                    if(config.namespaces.length > 0) {
                        for(var i=0;i<config.namespaces.length;i++) {
                            var ns = config.namespaces[i];

                            messageListeners[ns] = new CastSenderMessageListener(ns);
                            console.log("Cast: REGL - ", ns);
                        }
                    }

                    break;
                case cast.framework.SessionState.SESSION_START_FAILED:

                    break;
                case cast.framework.SessionState.SESSION_ENDING:

                    break;
                case cast.framework.SessionState.SESSION_ENDED:

                    break;
                case cast.framework.SessionState.SESSION_RESUMED:

                    break;
            }

            if(eventListeners.length > 0) {
                for(var j =0;j<eventListeners.length;j++) {
                    eventListeners[j]($castSender, session, e.sessionState);
                }
            }

            sessionState = e.sessionState;
        }
    }

    this.registerMessageListener = function(namespace, listenerCallback) {
        if(typeof(messageListeners[namespace]) === 'undefined') {
            console.error("Attempted to register message listener on a namespace that has not been registered.", namespace);
            return;
        }

        messageListeners[namespace].registerListener(listenerCallback);
    };

    function CastSenderMessageListener(namespace) {
        this.namespace = namespace;

        var messageListeners = [];

        function onMessage(namespace, message) {
            console.log('Cast: RECV - ', namespace, message);

            if(messageListeners.length > 0) {
                for(var i=0; i < messageListeners.length; i++) {
                    messageListeners[i]($castSender, message);
                }
            }
        }

        this.registerListener = function(listenerCallback) {
            messageListeners.push(listenerCallback);
        };

        this.sendMessage = function(message) {
            $castSender.sendMessage(namespace, message);
        };

        session.addMessageListener(namespace, onMessage);
    }

    window.__onGCastApiAvailable = function(isAvailable) {
        if (isAvailable) {
            $castSender.init();
        }
    };

    if(typeof(cast) !== 'undefined' && typeof(chrome) !== 'undefined') {
        this.init();
    }
}


function CastReceiverServiceProvider() {
    this.$get = ["$castConfig", function($castConfig) {
        return new CastReceiverService($castConfig);
    }];
}

function CastReceiverService($castConfig) {
    var $castReceiver = this;
    var config = {
        applicationId: $castConfig.getApplicationId(),
        namespaces: $castConfig.getNamespaces()
    };

    var messageListeners = {};
    var receiver;

    this.init = function() {
        window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
        receiver = window.castReceiverManager;

        receiver.onSenderConnected = function(event) {
            console.log("Sender Connected: ", event);

        };

        receiver.onSenderDisconnected = function(event) {
            console.log("Sender Disconnected: ", event);
            if(receiver.getSenders().length == 0) {
                window.close();
            }
        };

        if(config.namespaces.length > 0) {
            for(var i=0;i<config.namespaces.length;i++) {
                var ns = config.namespaces[i];

                messageListeners[ns] = new CastReceiverMessageListener(ns);
                console.log("Cast: REGL - ", ns);
            }
        }

        receiver.start();
        console.debug("Cast Receiver Initialised");
    };

    this.registerMessageListener = function(namespace, listenerCallback) {
        if(typeof(messageListeners[namespace]) === 'undefined') {
            console.error("Attempted to register message listener on a namespace that has not been registered.", namespace);
            return;
        }

        messageListeners[namespace].registerListener(listenerCallback);
    };

    this.getApplicationData = function() {
        return receiver.getApplicationData();
    };

    function CastReceiverMessageListener(namespace) {
        this.namespace = namespace;

        var messageBus = window.castReceiverManager.getCastMessageBus(namespace, cast.receiver.CastMessageBus.MessageType.JSON);
        var messageListeners = [];

        function onMessage(namespace, senderId, message) {
            console.log('Cast: RECV - ', namespace, message);

            if(messageListeners.length > 0) {
                for(var i=0; i < messageListeners.length; i++) {
                    messageListeners[i](new CastMessageContext(senderId, message));
                }
            }
        }

        function CastMessageContext(senderId, message) {
            this.senderId = senderId;
            this.message = message;

            this.respond = function(response) {
                messageBus.send(this.senderId, response);
            };
        }

        this.registerListener = function(listenerCallback) {
            messageListeners.push(listenerCallback);
        };

        messageBus.onMessage = function(event) {
            console.log("Cast: RECVRAW - ", namespace, event);

            if(event.type === cast.receiver.CastMessageBus.EventType.MESSAGE) {
                onMessage(namespace, event.senderId, event.data);
            }
        };
    }


    window['__onGCastApiAvailable'] = function(isAvailable) {
        if (isAvailable) {
            if(typeof(cast.receiver) !== 'undefined')
                $castReceiver.init();
        }
    };

    if(typeof(cast) !== 'undefined') {
        if(typeof(cast.receiver) !== 'undefined')
            this.init();
    }
}