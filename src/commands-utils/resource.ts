import { Flags } from "@oclif/core";
import { OptionFlag } from "@oclif/core/lib/interfaces";

type Label = { singular: string; plural: string };

export const ResourceFlags = (
  label: Label,
): {
  name: OptionFlag<string>;
} => ({
  name: Flags.string({
    summary: `Name of the ${label.singular}`,
    description: `The name is unique among ${label.plural}.`,
    required: true,
  }),
});

export const ResourceConfigFlags = (
  label: Label,
): {
  author: OptionFlag<string[] | undefined>;
  version: OptionFlag<string | undefined>;
} => ({
  author: Flags.string({
    summary: `Author(s) of the ${label.singular}`,
    description: "You can specify this flag several times to add more authors.",
    multiple: true,
    required: false,
  }),
  version: Flags.string({
    summary: `Version of the ${label.singular}`,
    description:
      "The version can be anything, but it's suggested following semantic versioning.",
    required: false,
  }),
});
