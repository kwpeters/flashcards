import * as assert from "assert";
import "mocha";
import {SerializationService} from "./serializationService";
import {QuestionMultChoice} from "./questionMultChoice";
import {QuestionText} from "./questionText";
import * as _ from "lodash";
import logger from "./logger";

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

});
