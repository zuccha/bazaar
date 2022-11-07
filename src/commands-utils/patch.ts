import { ResourceConfigFlags, ResourceFlags } from "./resource";

const patchLabel = { singular: "patch", plural: "patches" };
export const PatchFlags = ResourceFlags(patchLabel);
export const PatchConfigFlags = ResourceConfigFlags(patchLabel);
