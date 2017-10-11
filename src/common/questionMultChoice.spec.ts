import * as assert from "assert";
import "mocha";
import {QuestionMultChoice} from "./questionMultChoice";


describe("QuestionMultChoice", () => {

    const serialized = {
        serialization: {id: "QuenstionMultChoice", schema: 1},
        question:      "question text",
        answer:        "answer text",
        wrongAnswers:  ["wrong a", "wrong b", "wrong c"]
    };

    describe("serializationAide", () => {

        it("will deserialize into the expected instance", () => {
            const instance = QuestionMultChoice.serializationAide.deserialize(serialized);
            assert.notEqual(instance, undefined);
            assert.equal(instance!.question, "question text");
            assert.equal(instance!.answer, "answer text");
            assert.deepEqual(instance!.wrongAnswers, ["wrong a", "wrong b", "wrong c"]);
        });

    });

    it("after construction, appropriate properties will be set", () => {
        const q = new QuestionMultChoice(
            "question text",
            "answer text",
            ["wrong a", "wrong b", "wrong c"]);
        assert.equal(q.question, "question text");
        assert.equal(q.answer, "answer text");
        assert.deepEqual(q.wrongAnswers, ["wrong a", "wrong b", "wrong c"]);
    });

    it("will serialize itself into the expected form", () => {
        const q = new QuestionMultChoice("question text",
                                         "answer text",
                                         ["wrong a", "wrong b", "wrong c"]);
        assert.deepEqual(q.serialize(), serialized);
    });

});
