import { CliUx } from "@oclif/core";
import { CollectionInfo } from "../api/managers/collection";
import TextEffect from "./text-effect";

export const logCollection = (collection: CollectionInfo[]): void => {
  if (collection.length > 0) {
    CliUx.ux.table(collection, { name: {} });
  } else {
    CliUx.ux.log(TextEffect.i("<empty>"));
  }
};
