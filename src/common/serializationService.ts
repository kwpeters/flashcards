import {ISerializable, ISerializationAide, ISerialized} from "./serialization";
import * as _ from "lodash";
import logger from "./logger";

export class SerializationService
{
    private _aides: {[id: string]: ISerializationAide} = {};

    public registerAide(aide: ISerializationAide): boolean
    {
        // Check to see if we already have an aid using the same ID.
        if (this._aides[aide.serializationId])
        {
            return false;
        }

        this._aides[aide.serializationId] = aide;
        return true;
    }

    public deserialize(blobs: Array<ISerialized>): Array<ISerializable> | undefined
    {
        const instances: Array<ISerializable> = [];
        const errorBlobs: Array<ISerialized> = [];

        _.forEach(blobs, (curBlob) => {

            // Get the aide responsible for deserializing the current blob.
            const aide = this._aides[curBlob.serialization.id];
            if (aide === undefined) {
                // There is no aid registered for the current blob's ID.
                errorBlobs.push(curBlob);
                return;
            }

            const inst = aide.deserialize(curBlob);

            if (inst !== undefined) {
                // Success.
                instances.push(inst);
            } else {
                // Failed to deserialize.
                errorBlobs.push(curBlob);
            }
        });

        
        if (errorBlobs.length > 0) {
            logger.log("The following items failed to deserialize:");
            _.forEach(errorBlobs, (curBlob) => {
                logger.log(curBlob);
            });
            return undefined;
        }

        // All blobs successfully deserialized.  Return the hydrated instances.
        return instances;
    }
}
