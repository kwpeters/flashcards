import * as assert from "assert";
import "mocha";
import {QuestionText} from "./questionText";


describe("QuestionText", () => {

    it("after construction, appropriate properties will be set", () => {
        const q = new QuestionText("1 + 2 = ___", "3");
        assert.equal(q.question, "1 + 2 = ___");
        assert.equal(q.answer, "3");
    });


});
