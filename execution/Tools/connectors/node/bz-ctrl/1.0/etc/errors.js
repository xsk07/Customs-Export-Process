module.exports = {    
    // Authentication Errors
    "AUTH.UNKNOW": "Unknown authenticationType: %s",
    "AUTH.USER_UNAUTHORIZED": "User unauthorized",
    "AUTH.INVALID_RESPONSE_TYPE": "response_type is not allowed, permitted flows are: [Client Credentials Grant, Resource Owner Password Credentials]",
    "AUTH.INVALID_GRANT": "invalid_grant [Description] grant_type: -%s- is invalid. Value valids are [client_credentials, password]",
    "AUTH.ERROR": "Authentication Error: %s",
        
    // Globals Errors
    "GLB.RESTART_SERVER": "Restaring server because %s changed",
    "GLB.RESTART_SERVER_TIMES": "Restarting server for %s time",
    "GLB.EXIT_SERVER": "Server exited with code %s",
    "GLB.WORKER_KILLED": "Cluster worker PID: %s killed! [details - code: %s, signal: %s]",
    "GLB.WORKER_FORK": "Cluster worker PID: %s started!",
    "GLB.WORKER_LISTENING": "Cluster worker PID: %s listening! the worker is now connected to %s:%s [type: %s]",
    "GLB.WORKER_DISCONNECT": "Cluster worker PID: %s disconnected!",
    "GLB.WORKER_ONLINE": "Cluster worker PID: %s is online!",
    "GLB.WORKER_RESTART": "Cluster worker restarting...",
    "GLB.BAD_REQUEST": "HTTP Status 400 - Bad Request. The request sent by the client was syntactically incorrect. See logs for more details",
    "GLB.INTERNAL_SERVER_ERROR": "HTTP Status 500 - Internal server error. The remote server encountered an unexpected condition which prevented it from fulfilling the request. Reviews the remote server log for details"
}