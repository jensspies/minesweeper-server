export enum LogLevel {
    trace = 'trace',
    debug = 'debug',
    info = 'info',
    warn = 'warn',
    error = 'error',
    fatal = 'fatal'
}

export class LoggedClass {
    protected logger: any;
    constructor (logger: any) {
        this.logger = logger;
    }

    public log(message: string, level: LogLevel) {
        switch (level) {
            case LogLevel.warn:
                this.logger.warn(message); 
                break;
            case LogLevel.debug:
                this.logger.debug(message); 
                break;
            case LogLevel.info:
                this.logger.info(message); 
                break;
            case LogLevel.error:
                this.logger.error(message); 
                break;
            case LogLevel.trace:
                this.logger.trace(message);
                break;
        }
    }

}