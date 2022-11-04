import { R, Result, ResultVoid } from "../../../utils/result";
import Project, { ProjectConfig } from "../../project";
import { ResourceBag } from "../../resource";
import Template from "../template";

export default class ProjectTemplate extends Template<ProjectConfig, Project> {
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
  ): Promise<ResultVoid> {
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
  ): Promise<ResultVoid> {
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
  ): Promise<ResultVoid> {
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

  async getMetadata(): Promise<Result<ProjectConfig>> {
    this.logger.start("Gathering project metadata");
    const metadataResult = await this.resource.getMetadata();
    if (R.isError(metadataResult)) {
      this.logger.failure();
      return metadataResult;
    }
    this.logger.success();

    return metadataResult;
  }

  async updateMetadata(metadata: Partial<ProjectConfig>): Promise<ResultVoid> {
    this.logger.start("Updating project metadata");
    const result = await this.resource.updateMetadata(metadata);
    if (R.isError(result)) {
      this.logger.failure();
      return result;
    }
    this.logger.success();

    return result;
  }
}
