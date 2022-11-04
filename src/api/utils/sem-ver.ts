import { R, Result } from "./result";

const ErrorCode = {
  InvalidMajor: "SemVerErrorCode.InvalidMajor",
  InvalidMinor: "SemVerErrorCode.InvalidMinor",
  InvalidPatch: "SemVerErrorCode.InvalidPatch",
};

const MajorRegExp = /^(\d)+$/;
const MinorRegExp = /^(\d+)\.(\d+)$/;
const PatchRegExp = /^(\d+)\.(\d+)\.(\d+)$/;

const SemVer = {
  ErrorCode,

  isMajor(version: string): boolean {
    return MajorRegExp.test(version);
  },

  isMinor(version: string): boolean {
    return MinorRegExp.test(version);
  },

  isPatch(version: string): boolean {
    return PatchRegExp.test(version);
  },

  increaseMajor(version: string): Result<string> {
    const scope = "SemVer.increaseMajor";
    const message = `Version "${version}" doesn't follow SemVer format, expected "<number>", "<number>.<number>", or "<number>.<number>.<number>"`;

    const majorMatch = version.match(MajorRegExp);
    if (majorMatch) {
      const major = Number.parseInt(majorMatch[1]!, 10) + 1;
      return R.Ok(`${major}`);
    }

    const minorMatch = version.match(MinorRegExp);
    if (minorMatch) {
      const major = Number.parseInt(minorMatch[1]!, 10) + 1;
      return R.Ok(`${major}.0`);
    }

    const patchMatch = version.match(PatchRegExp);
    if (patchMatch) {
      const major = Number.parseInt(patchMatch[1]!, 10) + 1;
      return R.Ok(`${major}.0.0`);
    }

    return R.Error(scope, message, ErrorCode.InvalidMajor);
  },

  increaseMinor(version: string): Result<string> {
    const scope = "SemVer.increaseMinor";
    const message = `Version "${version}" doesn't follow SemVer format, expected "<number>.<number>" or "<number>.<number>.<number>"`;

    if (SemVer.isMajor(version)) {
      return R.Error(scope, message, ErrorCode.InvalidMinor);
    }

    const minorMatch = version.match(MinorRegExp);
    if (minorMatch) {
      const major = minorMatch[1]!;
      const minor = Number.parseInt(minorMatch[2]!, 10) + 1;
      return R.Ok(`${major}.${minor}`);
    }

    const patchMatch = version.match(PatchRegExp);
    if (patchMatch) {
      const major = patchMatch[1]!;
      const minor = Number.parseInt(patchMatch[2]!, 10) + 1;
      return R.Ok(`${major}.${minor}.0`);
    }

    return R.Error(scope, message, ErrorCode.InvalidMinor);
  },

  increasePatch(version: string): Result<string> {
    const scope = "SemVer.increasePatch";
    const message = `Version "${version}" doesn't follow SemVer format, expected "<number>.<number>.<number>"`;

    if (SemVer.isMajor(version)) {
      return R.Error(scope, message, ErrorCode.InvalidPatch);
    }

    if (SemVer.isMinor(version)) {
      return R.Error(scope, message, ErrorCode.InvalidPatch);
    }

    const patchMatch = version.match(PatchRegExp);
    if (patchMatch) {
      const major = patchMatch[1]!;
      const minor = patchMatch[2]!;
      const patch = Number.parseInt(patchMatch[3]!, 10) + 1;
      return R.Ok(`${major}.${minor}.${patch}`);
    }

    return R.Error(scope, message, ErrorCode.InvalidPatch);
  },
};

export default SemVer;
