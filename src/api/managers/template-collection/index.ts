import { R, Result } from "../../utils/result";
import Directory from "../directory";
import { ResourceBag } from "../resource";
import ProjectTemplate from "./templates/project-template";

export type TemplateInfo = {
  name: string;
};

const ErrorCode = {
  Generic: "TemplateCollection.Generic",
};

export default class TemplateCollection extends Directory {
  static ErrorCode = ErrorCode;

  protected id = "TemplateCollection";

  private _bag: ResourceBag;

  constructor(directoryPath: string, bag: ResourceBag) {
    super(directoryPath, bag);
    this._bag = bag;
  }

  projectsDirectoryPath(...paths: string[]): string {
    return this.path("Projects", ...paths);
  }

  async listProjects(): Promise<Result<TemplateInfo[]>> {
    const scope = this.scope("listProjects");

    this.logger.start(`Gathering info about project templates' directory`);
    const directoryInfoResult = await this.fs.getDirectoryInfo(
      this.projectsDirectoryPath(),
    );
    if (R.isError(directoryInfoResult)) {
      this.logger.failure();
      const message = `Failed to get "${this.projectsDirectoryPath()}" directory info`;
      return R.Stack(directoryInfoResult, scope, message, ErrorCode.Generic);
    }
    this.logger.success();

    const projectTemplateInfos = directoryInfoResult.data.directoryNames.map(
      (directoryName) => ({ name: directoryName }),
    );
    return R.Ok(projectTemplateInfos);
  }

  project(name: string): ProjectTemplate {
    return new ProjectTemplate(this.projectsDirectoryPath(name), this._bag);
  }
}
