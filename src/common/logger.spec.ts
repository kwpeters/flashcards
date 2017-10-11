import * as assert from "assert";
import "mocha";
import logger from "./logger";

describe("logger", () => {

    beforeEach(() => {
        logger.reset();
    });

    afterEach(() => {
        logger.reset();
    });

    it("will be created in the enabled state", () => {
        const wasLogged = logger.log("");
        assert(wasLogged);
    });

    it("will not log messages when disabled", () => {
        logger.push(false);
        const wasLogged = logger.log("This text should never appear.");
        assert(!wasLogged);
    });

    it("pop() will restore the previous logging state", () => {
        let wasLogged: boolean;

        logger.push(false);
        wasLogged = logger.log("");
        assert(!wasLogged);

        logger.push(false);
        wasLogged = logger.log("");
        assert(!wasLogged);

        logger.push(true);
        wasLogged = logger.log("");
        assert(wasLogged);

        logger.pop();
        wasLogged = logger.log("");
        assert(!wasLogged);

        logger.pop();
        wasLogged = logger.log("");
        assert(!wasLogged);

        logger.pop();
        wasLogged = logger.log("");
        assert(wasLogged);
    });

    // A test just to see how various types get logged.
    // it("will log multiple values", () => {
    //     logger.log("one", 2, {three: 3});
    // });
});
