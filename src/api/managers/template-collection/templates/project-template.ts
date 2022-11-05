import { R, Result, ResultVoid } from "../../../utils/result";
import Project, {
  ProjectConfig,
  ProjectErrorCodes,
  ProjectExtraErrorCodes,
} from "../../project";
import { ResourceBag, ResourceErrorCodes } from "../../resource";
import Template, { TemplateErrorCodes } from "../template";

export type ProjectTemplateErrorCodes = {
  CreateFromBaserom: ProjectErrorCodes["CreateFromBaserom"];
  CreateFromProject:
    | TemplateErrorCodes["CreateFromResource"]
    | ProjectExtraErrorCodes["Snapshot"]
    | ProjectExtraErrorCodes["Validate"];
  GetMetadata: ProjectErrorCodes["GetMetadata"];
  UpdateMetadata: ProjectErrorCodes["UpdateMetadata"];
  InitProject:
    | TemplateErrorCodes["InitResource"]
    | ProjectExtraErrorCodes["Snapshot"]
    | ProjectExtraErrorCodes["Validate"];
  Remove: ResourceErrorCodes["Remove"] | ProjectExtraErrorCodes["Validate"];
};

export default class ProjectTemplate extends Template<
  ProjectConfig,
  ProjectExtraErrorCodes,
  Project
> {
  protected id = "ProjectTemplate";

  protected resource: Project;
  private _bag: ResourceBag;

  constructor(directoryPath: string, bag: ResourceBag) {
    super(bag);
    this._bag = bag;
    this.resource = new Project(directoryPath, bag);
  }

  async createFromBaserom(
    baseromPath: string,
    config?: Partial<ProjectConfig>,
  ): Promise<ResultVoid<ProjectTemplateErrorCodes["CreateFromBaserom"]>> {
    this.logger.start("Creating project from baserom");
    const result = await this.resource.createFromBaserom(baseromPath, config);
    if (R.isError(result)) {
      this.logger.failure();
      return result;
    }

    this.logger.success();
    return result;
  }

  async createFromProject(
    projectDirectoryPath: string,
    partialOptions?: Partial<{ force: boolean }>,
  ): Promise<ResultVoid<ProjectTemplateErrorCodes["CreateFromProject"]>> {
    const project = new Project(projectDirectoryPath, this._bag);

    this.logger.start("Creating template from project");
    const result = await this.createFromResource(project, partialOptions);
    if (R.isError(result)) {
      this.logger.failure();
      return result;
    }
    this.logger.success();

    return R.Void;
  }

  async initProject(
    directoryPath: string,
    name: string,
    config?: Partial<ProjectConfig>,
    partialOptions?: Partial<{ force: boolean }>,
  ): Promise<ResultVoid<ProjectTemplateErrorCodes["InitProject"]>> {
    const project = new Project(this.fs.join(directoryPath, name), this._bag);

    this.logger.start("Initializing project");
    const result = await this.initResource(project, config, partialOptions);
    if (R.isError(result)) {
      this.logger.failure();
      return result;
    }
    this.logger.success();

    return R.Void;
  }

  async remove(): Promise<ResultVoid<ProjectTemplateErrorCodes["Remove"]>> {
    this.logger.start("Removing project");
    const result = await this.resource.remove();
    if (R.isError(result)) {
      this.logger.failure();
      return result;
    }
    this.logger.success();

    return R.Void;
  }

  async getMetadata(): Promise<
    Result<ProjectConfig, ProjectTemplateErrorCodes["GetMetadata"]>
  > {
    this.logger.start("Gathering project metadata");
    const metadataResult = await this.resource.getMetadata();
    if (R.isError(metadataResult)) {
      this.logger.failure();
      return metadataResult;
    }
    this.logger.success();

    return metadataResult;
  }

  async updateMetadata(
    metadata: Partial<ProjectConfig>,
  ): Promise<ResultVoid<ProjectTemplateErrorCodes["UpdateMetadata"]>> {
    this.logger.start("Updating project metadata");
    const result = await this.resource.updateMetadata(metadata);
    if (R.isError(result)) {
      this.logger.failure();
      return result;
    }
    this.logger.success();

    return R.Void;
  }
}
