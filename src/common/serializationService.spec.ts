import * as assert from "assert";
import "mocha";
import {SerializationService} from "./serializationService";
import {QuestionMultChoice} from "./questionMultChoice";
import {QuestionText} from "./questionText";
import * as _ from "lodash";
import logger from "./logger";
import {ISerializable} from "./serialization";

describe("SerializationService", () => {

    it("deserialize() will return undefined when there is no registered aide for a blob", () => {
        const illegalBlobs = [
            {
                serialization: {id: "QuestionMultChoiceXyzzy", schema: 1},
                question:      "question text",
                answer:        "answer text",
                wrongAnswers:  ["wrong a", "wrong b", "wrong c"]
            }
        ];

        const serSvc = new SerializationService();
        serSvc.registerAide(QuestionMultChoice.serializationAide);
        serSvc.registerAide(QuestionText.serializationAide);

        logger.push(false);
        const instances = serSvc.deserialize(illegalBlobs);
        logger.pop();
        assert.equal(instances, undefined);
    });


    it("deserialize() will return undefined when the schema is unsupported", () => {
        const illegalBlobs = [
            {
                serialization: {id: "QuestionMultChoice", schema: 99},
                question:      "question text",
                answer:        "answer text",
                wrongAnswers:  ["wrong a", "wrong b", "wrong c"]
            }
        ];

        const serSvc = new SerializationService();
        serSvc.registerAide(QuestionMultChoice.serializationAide);
        serSvc.registerAide(QuestionText.serializationAide);

        logger.push(false);
        const instances = serSvc.deserialize(illegalBlobs);
        logger.pop();
        assert.equal(instances, undefined);
    });


    it("can deserialize an array heterogeneous objects", () => {
        const serializedBlobs = [
            {
                serialization: {id: "QuestionMultChoice", schema: 1},
                question:      "question text",
                answer:        "answer text",
                wrongAnswers:  ["wrong a", "wrong b", "wrong c"]
            },
            {
                serialization: {id: "QuestionText", schema: 1},
                question:      "question text",
                answer:        "answer text"
            }
        ];

        const serSvc = new SerializationService();
        serSvc.registerAide(QuestionMultChoice.serializationAide);
        serSvc.registerAide(QuestionText.serializationAide);

        const instances = serSvc.deserialize(serializedBlobs);
        assert(_.isArray(instances));
        assert.equal(instances!.length, 2);
        assert(instances![0] instanceof QuestionMultChoice);
        assert(instances![1] instanceof QuestionText);
    });


    it("can do a round trip serialization and deserialization", () => {
        const origInstances = [
            new QuestionText("question 1", "answer 1"),
            new QuestionMultChoice("question 2", "answer 2", ["wrong 2a", "wrong 2b"]),
            new QuestionText("question 3", "answer 3"),
            new QuestionMultChoice("question 4", "answer 4", ["wrong 4a", "wrong 4b"])
        ];

        const serSvc = new SerializationService();
        serSvc.registerAide(QuestionText.serializationAide);
        serSvc.registerAide(QuestionMultChoice.serializationAide);

        const serialized = serSvc.serialize(origInstances);
        const finalInstances = serSvc.deserialize(serialized);
        assert(_.isArray(finalInstances));
        assert.equal(finalInstances!.length, 4);

        if (finalInstances)
        {
            let curInst: ISerializable;

            curInst = finalInstances[0];
            assert(curInst instanceof QuestionText);
            if (curInst instanceof QuestionText) {
                assert.equal(curInst.question, "question 1");
                assert.equal(curInst.answer, "answer 1");
            }

            curInst = finalInstances[1];
            assert(curInst instanceof QuestionMultChoice);
            if (curInst instanceof QuestionMultChoice) {
                assert.equal(curInst.question, "question 2");
                assert.equal(curInst.answer, "answer 2");
                assert.deepEqual(curInst.wrongAnswers, ["wrong 2a", "wrong 2b"]);
            }

            curInst = finalInstances[2];
            assert(curInst instanceof QuestionText);
            if (curInst instanceof QuestionText) {
                assert.equal(curInst.question, "question 3");
                assert.equal(curInst.answer, "answer 3");
            }

            curInst = finalInstances[3];
            assert(curInst instanceof QuestionMultChoice);
            if (curInst instanceof QuestionMultChoice) {
                assert.equal(curInst.question, "question 4");
                assert.equal(curInst.answer, "answer 4");
                assert.deepEqual(curInst.wrongAnswers, ["wrong 4a", "wrong 4b"]);
            }
        }
    });
});
