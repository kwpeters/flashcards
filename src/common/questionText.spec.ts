import * as assert from "assert";
import "mocha";
import {QuestionText} from "./questionText";


describe("QuestionText", () => {

    const serialized = {
        serialization: {id: "QuestionText", schema: 1},
        question:      "question text",
        answer:        "answer text"
    };

    describe("serializationAide", () => {

        it("will deserialize into the expected instance", () => {
            const instance = QuestionText.serializationAide.deserialize(serialized);
            assert.notEqual(instance, undefined);
            assert.equal(instance!.question, "question text");
            assert.equal(instance!.answer, "answer text");
        });

    });

    it("after construction, appropriate properties will be set", () => {
        const q = new QuestionText("question text", "answer text");
        assert.equal(q.question, "question text");
        assert.equal(q.answer, "answer text");
    });

    it("will serialize itself into the expected form", () => {
        const q = new QuestionText("question text", "answer text");
        assert.deepEqual(q.serialize(), serialized);
    });

});
