import { R, ResultVoid } from "../../../utils/result";
import { ManagerBag } from "../../manager";
import Project, { ProjectConfig } from "../../project";
import { ResourceBag } from "../../resource";
import Template from "../template";

export default class ProjectTemplate extends Template<ProjectConfig, Project> {
  protected id = "ProjectTemplate";

  private _resourceBag: ResourceBag;
  protected resource: Project;

  constructor(
    directoryPath: string,
    managerBag: ManagerBag,
    resourceBag: ResourceBag,
  ) {
    super(managerBag);

    this._resourceBag = resourceBag;
    this.resource = new Project(directoryPath, managerBag, resourceBag);
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
    const project = new Project(
      projectDirectoryPath,
      this.managerBag,
      this._resourceBag,
    );

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
    const project = new Project(
      this.fs.join(directoryPath, name),
      this.managerBag,
      this._resourceBag,
    );

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
