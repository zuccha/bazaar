import { R, ResultVoid } from "../../../utils/result";
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
    return this.resource.createFromBaserom(baseromPath, config);
  }

  async createFromProject(
    projectDirectoryPath: string,
    partialOptions?: Partial<{ force: boolean }>,
  ): Promise<ResultVoid> {
    const project = new Project(projectDirectoryPath, this._bag);

    const result = await this.createFromResource(project, partialOptions);
    if (R.isError(result)) {
      return result;
    }

    return R.Void;
  }

  async initProject(
    directoryPath: string,
    name: string,
    config?: Partial<ProjectConfig>,
    partialOptions?: Partial<{ force: boolean }>,
  ): Promise<ResultVoid> {
    const project = new Project(this.fs.join(directoryPath, name), this._bag);

    this.logger.start("Initializing resource");
    const result = await this.initResource(project, config, partialOptions);
    if (R.isError(result)) {
      this.logger.failure();
      return result;
    }
    this.logger.success();

    return R.Void;
  }
}
