import * as assert from "assert";
import "mocha";
import {QuestionMultChoice} from "./questionMultChoice";


describe("QuestionMultChoice", () => {

    it("after construction, appropriate properties will be set", () => {
        const q = new QuestionMultChoice("1 + 2 = ?", "3", ["2", "4", "5"]);
        assert.equal(q.questions, "1 + 2 = ?");
        assert.equal(q.answer, "3");
        assert.deepEqual(q.wrongAnswers, ["2", "4", "5"]);
    });

});
