import * as _ from "lodash";

export class Logger {
    private _stateStack: Array<boolean>;

    public constructor() {
        this.reset();
    }

    public log(...args: Array<any>): boolean {
        // If this logger is currently disabled, do nothing.
        if (!this._stateStack[0]) {
            return false;
        }

        const strings = _.map(args, (arg) => {
            if (_.isObjectLike(arg)) {
                return JSON.stringify(arg, undefined, 2);
            } else {
                return arg.toString();
            }
        });

        const wholeStr = _.join(strings, " ");

        // Don't invoke console.log() if the resulting string has 0 length.
        if (wholeStr.length > 0)
        {
            console.log();
        }
        return true;
    }

    public push(newState: boolean): void {
        this._stateStack.unshift(newState);
    }

    public pop(): void {
        // Never remove the last enabled state from the stack.
        if (this._stateStack.length > 1) {
            this._stateStack.shift();
        }
    }

    public reset(): void {
        this._stateStack = [true];
    }
}



export default new Logger();
